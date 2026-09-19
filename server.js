import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parser for API requests
  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // In-memory SoundCloud cache
  const scCache = new Map();
  const scCacheFile = path.join(process.cwd(), 'src/data/soundcloudCache.json');
  if (fs.existsSync(scCacheFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(scCacheFile, 'utf8'));
      for (const [k, v] of Object.entries(data)) {
        if (!k.startsWith('_')) {
          scCache.set(k.toLowerCase(), v);
        }
      }
    } catch (e) {
      console.error('Error loading soundcloud cache:', e);
    }
  }

  // SoundCloud Resolver endpoint
  app.get('/api/soundcloud/resolve', async (req, res) => {
    try {
      const query = (req.query.q || '').trim();
      const trackUrlParam = (req.query.url || '').trim();

      if (!query && !trackUrlParam) {
        return res.status(400).json({ error: 'Missing query parameter q or url' });
      }

      // 1. If direct SoundCloud URL provided, fetch oEmbed metadata
      if (trackUrlParam) {
        try {
          const oembedRes = await fetch(
            `https://soundcloud.com/oembed?url=${encodeURIComponent(trackUrlParam)}&format=json`
          );
          if (oembedRes.ok) {
            const data = await oembedRes.json();
            return res.json({
              trackUrl: trackUrlParam,
              title: data.title,
              author: data.author_name,
              artworkUrl: data.thumbnail_url
                ? data.thumbnail_url.replace('-large', '-t500x500')
                : null,
              html: data.html,
            });
          }
        } catch (err) {}
        return res.json({ trackUrl: trackUrlParam });
      }

      // 2. Check query cache
      const cacheKey = query.toLowerCase();
      if (scCache.has(cacheKey)) {
        return res.json(scCache.get(cacheKey));
      }

      // 3. Search SoundCloud sounds
      const searchUrl = `https://soundcloud.com/search/sounds?q=${encodeURIComponent(query)}`;
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml',
        },
      });

      if (!response.ok) {
        return res.status(502).json({ error: 'Failed to query SoundCloud' });
      }

      const html = await response.text();
      const systemPaths = new Set([
        'search',
        'popular',
        'pages',
        'terms',
        'settings',
        'signin',
        'upload',
        'mobile',
        'you',
        'charts',
        'stream',
        'discover',
        'notifications',
        'messages',
        'stations',
        'imprint',
      ]);

      const matches = [...html.matchAll(/href="\/([a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+)"/g)]
        .map((m) => m[1])
        .filter((p) => !systemPaths.has(p.split('/')[0]));

      if (!matches.length) {
        return res.status(404).json({ error: 'No matching SoundCloud track found' });
      }

      const trackSlug = matches[0];
      const trackUrl = `https://soundcloud.com/${trackSlug}`;

      let trackInfo = { trackUrl, title: query, author: '', artworkUrl: null };
      try {
        const oembedRes = await fetch(
          `https://soundcloud.com/oembed?url=${encodeURIComponent(trackUrl)}&format=json`
        );
        if (oembedRes.ok) {
          const odata = await oembedRes.json();
          trackInfo = {
            trackUrl,
            title: odata.title,
            author: odata.author_name,
            artworkUrl: odata.thumbnail_url
              ? odata.thumbnail_url.replace('-large', '-t500x500')
              : null,
            html: odata.html,
          };
        }
      } catch (e) {}

      scCache.set(cacheKey, trackInfo);
      return res.json(trackInfo);
    } catch (err) {
      console.error('SoundCloud resolve error:', err);
      res.status(500).json({ error: 'Internal resolver error' });
    }
  });

  // SoundCloud live search endpoint
  app.get('/api/soundcloud/search', async (req, res) => {
    try {
      const query = (req.query.q || '').trim();
      if (!query) return res.json({ results: [] });

      const searchUrl = `https://soundcloud.com/search/sounds?q=${encodeURIComponent(query)}`;
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml',
        },
      });

      if (!response.ok) return res.json({ results: [] });

      const html = await response.text();
      const systemPaths = new Set([
        'search',
        'popular',
        'pages',
        'terms',
        'settings',
        'signin',
        'upload',
        'mobile',
        'you',
        'charts',
        'stream',
        'discover',
        'notifications',
        'messages',
        'stations',
      ]);

      const uniqueSlugs = [
        ...new Set(
          [...html.matchAll(/href="\/([a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+)"/g)]
            .map((m) => m[1])
            .filter((p) => !systemPaths.has(p.split('/')[0]))
        ),
      ].slice(0, 10);

      const results = uniqueSlugs.map((slug) => {
        const [author, titleSlug] = slug.split('/');
        const cleanTitle = (titleSlug || '').replace(/-/g, ' ');
        return {
          id: `sc-${slug}`,
          trackUrl: `https://soundcloud.com/${slug}`,
          title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
          artist: author,
          source: 'soundcloud',
        };
      });

      res.json({ results });
    } catch (e) {
      res.json({ results: [] });
    }
  });

  // Game frame proxy & sanitizer (resolves text/plain and XML <Module> issues on CDN games)
  app.get('/api/game-frame', async (req, res) => {
    try {
      const targetUrl = req.query.url;
      if (!targetUrl || typeof targetUrl !== 'string') {
        return res.status(400).send('Missing target game URL parameter');
      }

      let parsedUrl;
      try {
        parsedUrl = new URL(targetUrl);
        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
          return res.status(400).send('Invalid URL protocol');
        }
      } catch {
        return res.status(400).send('Malformed game URL');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch(targetUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        return res
          .status(response.status)
          .send(`Failed to fetch game content: HTTP ${response.status} ${response.statusText}`);
      }

      let text = await response.text();

      // 1. Extract HTML from XML CDATA if present (<Module><Content type="html"><![CDATA[...]]></Content></Module>)
      if (text.includes('<![CDATA[')) {
        const start = text.indexOf('<![CDATA[') + 9;
        const end = text.lastIndexOf(']]>');
        if (end > start) {
          text = text.substring(start, end);
        }
      }

      // 2. If <Module> exists without CDATA, extract <html>...</html>
      if (text.includes('<Module') && text.includes('<html')) {
        const htmlStart = text.indexOf('<html');
        const htmlEnd = text.lastIndexOf('</html>');
        if (htmlEnd > htmlStart) {
          text = text.substring(htmlStart, htmlEnd + 7);
        } else {
          text = text.substring(htmlStart);
        }
      }

      // 3. Inject base href if not present so relative scripts/assets resolve
      if (!text.includes('<base ') && !text.includes('<base>')) {
        const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1);
        const baseTag = `<base href="${baseUrl}">`;
        if (text.includes('<head>')) {
          text = text.replace('<head>', `<head>\n  ${baseTag}`);
        } else if (text.includes('<head ')) {
          text = text.replace(/<head[^>]*>/, `$&\\n  ${baseTag}`);
        } else if (text.includes('<html')) {
          text = text.replace(/<html[^>]*>/, `$&\\n<head>${baseTag}</head>`);
        } else {
          text = `<head>${baseTag}</head>\n` + text;
        }
      }

      // 4. Inject unblocking styles and viewport meta if missing
      if (!text.includes('viewport')) {
        const metaTag =
          '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">';
        if (text.includes('<head>')) {
          text = text.replace('<head>', `<head>\n  ${metaTag}`);
        }
      }

      // 5. Send as clean HTML with permissive framing
      res.removeHeader('X-Frame-Options');
      res.removeHeader('Content-Security-Policy');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(text);
    } catch (err) {
      console.error('Game frame proxy error:', err);
      res.status(502).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: system-ui, sans-serif; background: #0e0b1c; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .card { background: #17122c; border: 1px solid #282044; padding: 24px; border-radius: 12px; text-align: center; max-width: 400px; }
            a { display: inline-block; margin-top: 16px; background: #9333ea; color: white; padding: 10px 18px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 13px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h3>Game Loading Alternate Stream</h3>
            <p style="color: #8c85a6; font-size: 13px;">This title could not load directly through the proxy. Click below to open in a direct tab.</p>
            <a href="${req.query.url}" target="_blank" rel="noopener noreferrer">Launch Game in New Tab</a>
          </div>
        </body>
        </html>
      `);
    }
  });

  // AI Chat endpoint (supports Navy AI key sk-navy-... and Google Gemini with auto-fallback)
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history, systemInstruction, temperature, apiKey } = req.body;

      if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ error: 'A message prompt is required.' });
      }

      const defaultSystemPrompt =
        systemInstruction ||
        'You are grrmondays AI, an intelligent, helpful, and friendly AI assistant. You assist users with homework, science, history, programming, math formulas, gaming, and general research. Provide direct, informative, well-formatted markdown answers with helpful lists, bold emphasis, and code blocks.';

      const promptText = message.trim();
      const requestedKey = (apiKey && typeof apiKey === 'string' && apiKey.trim()) || '';

      // 1. If user explicitly provided a Navy AI key (sk-navy-...), attempt Navy AI
      if (requestedKey.startsWith('sk-navy-')) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);

          const navyMessages = [
            { role: 'system', content: defaultSystemPrompt },
          ];

          if (Array.isArray(history)) {
            for (const item of history) {
              if (item && item.text && typeof item.text === 'string' && item.text.trim()) {
                navyMessages.push({
                  role:
                    item.role === 'model' || item.role === 'ai' || item.role === 'assistant'
                      ? 'assistant'
                      : 'user',
                  content: item.text.trim(),
                });
              }
            }
          }

          navyMessages.push({
            role: 'user',
            content: promptText,
          });

          const navyResponse = await fetch('https://api.navy/v1/chat/completions', {
            method: 'POST',
            signal: controller.signal,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${requestedKey}`,
            },
            body: JSON.stringify({
              model: 'gemini-3.8-flash',
              messages: navyMessages,
              temperature: typeof temperature === 'number' ? Math.max(0, Math.min(2, temperature)) : 0.7,
            }),
          });
          clearTimeout(timeoutId);

          if (navyResponse.ok) {
            const navyData = await navyResponse.json();
            const navyReply = navyData.choices?.[0]?.message?.content;
            if (navyReply && typeof navyReply === 'string' && navyReply.trim()) {
              return res.json({ reply: navyReply.trim(), provider: 'navy' });
            }
          }
        } catch {
          // Gracefully continue to Google Gemini
        }
      }

      // 2. Google Gemini engine with multi-model resilience (3.6 -> 3.8 -> 3.5)
      const geminiApiKey =
        (!requestedKey.startsWith('sk-navy-') && requestedKey) ||
        process.env.GEMINI_API_KEY;

      if (!geminiApiKey) {
        return res.status(400).json({
          error:
            'No valid AI API key available. Please configure your API key in Settings.',
        });
      }

      const ai = new GoogleGenAI({
        apiKey: geminiApiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      // Format Gemini conversation history
      const contents = [];

      if (Array.isArray(history)) {
        for (const item of history) {
          if (item && item.text && typeof item.text === 'string' && item.text.trim()) {
            contents.push({
              role:
                item.role === 'model' || item.role === 'ai' || item.role === 'assistant'
                  ? 'model'
                  : 'user',
              parts: [{ text: item.text.trim() }],
            });
          }
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: promptText }],
      });

      // Try high-availability models with gemini-3.6-flash as primary for instant response times
      const candidateModels = ['gemini-3.6-flash', 'gemini-3.8-flash', 'gemini-3.5-flash-lite'];
      let lastGeminiError = null;

      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction: defaultSystemPrompt,
              temperature: typeof temperature === 'number' ? Math.max(0, Math.min(2, temperature)) : 0.7,
            },
          });

          const reply = response.text || 'No response content was generated.';
          return res.json({ reply, provider: 'gemini', model: modelName });
        } catch (err) {
          lastGeminiError = err;
          const isRetryable =
            err?.status === 503 ||
            err?.message?.includes('503') ||
            err?.message?.includes('high demand') ||
            err?.message?.includes('UNAVAILABLE') ||
            err?.status === 429 ||
            err?.message?.includes('429');

          if (isRetryable) {
            continue;
          }
          break;
        }
      }

      throw lastGeminiError || new Error('All AI generation models failed.');
    } catch (err) {
      console.error('AI Service Error:', err);
      const errorMessage =
        err?.message || 'An unexpected error occurred while communicating with the AI service.';
      return res.status(500).json({ error: errorMessage });
    }
  });

  // Vite and Static SPA integration
  const distPath = path.join(process.cwd(), 'dist');
  const distIndexHtml = path.join(distPath, 'index.html');

  if (process.env.NODE_ENV === 'production' && fs.existsSync(distIndexHtml)) {
    app.use(
      express.static(distPath, {
        etag: false,
        maxAge: 0,
        setHeaders: (res) => {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        },
      })
    );
    app.get('*', (req, res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.sendFile(distIndexHtml);
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

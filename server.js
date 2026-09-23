import 'dotenv/config';
import express from 'express';
import compression from 'compression';
import path from 'path';
import fs from 'fs';
import { Readable } from 'stream';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // High-performance gzip/deflate compression for instant transfers
  app.use(compression());

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

      // 2. Check query cache (ensure cached item is NOT a 30s snipped preview)
      const cacheKey = query.toLowerCase();
      const forceFull = req.query.forceFull === 'true';
      if (!forceFull && scCache.has(cacheKey)) {
        const cached = scCache.get(cacheKey);
        if (cached && !cached.isSnipped && (!cached.duration || cached.duration > 35000)) {
          return res.json(cached);
        }
      }

      // Helper to fetch track hydration metadata and detect 30-second Go+ snipped previews
      const fetchTrackDetails = async (slug) => {
        try {
          const res = await fetch(`https://soundcloud.com/${slug}`, {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
              Accept: 'text/html,application/xhtml+xml',
            },
          });
          if (!res.ok) return null;
          const trHtml = await res.text();
          const match = trHtml.match(/<script>window\.__sc_hydration\s*=\s*(\[[\s\S]*?\]);<\/script>/);
          if (match) {
            const hyd = JSON.parse(match[1]);
            const soundObj = hyd.find((item) => item.hydratable === 'sound');
            if (soundObj && soundObj.data) {
              const d = soundObj.data;
              const isSnipped =
                d.policy === 'SNIP' ||
                (d.duration <= 35000 && d.full_duration > 45000) ||
                (d.media?.transcodings || []).some((t) => t.snipped);
              return {
                slug,
                trackUrl: `https://soundcloud.com/${slug}`,
                title: d.title,
                author: d.user?.username || '',
                artworkUrl: d.artwork_url ? d.artwork_url.replace('-large', '-t500x500') : null,
                duration: d.duration,
                fullDuration: d.full_duration,
                isSnipped: Boolean(isSnipped),
              };
            }
          }
        } catch (e) {}
        return null;
      };

      // Helper to query soundcloud and extract track slugs
      const querySoundCloudSlugs = async (searchQuery) => {
        try {
          const searchUrl = `https://soundcloud.com/search/sounds?q=${encodeURIComponent(searchQuery)}`;
          const response = await fetch(searchUrl, {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
              Accept: 'text/html,application/xhtml+xml',
            },
          });
          if (!response.ok) return [];
          const html = await response.text();
          return [...html.matchAll(/href="\/([a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+)"/g)]
            .map((m) => m[1])
            .filter((p) => {
              const parts = p.split('/');
              return parts.length === 2 && !systemPaths.has(parts[0]) && !ignoreSegments.has(parts[1]);
            });
        } catch (e) {
          return [];
        }
      };

      // 3. Search SoundCloud sounds
      let rawMatches = await querySoundCloudSlugs(query);

      // Query tokenization and scoring
      const cleanNorm = (str) =>
        (str || '')
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]/g, ' ')
          .trim();

      const queryWords = cleanNorm(query)
        .split(/\s+/)
        .filter((w) => w.length > 1);

      const penaltyWords = ['remix', 'cover', 'slowed', 'reverb', 'speed', 'instrumental', '8d', 'nightcore', 'tribute', 'karaoke', 'reaction', 'typebeat', 'beat'];

      const scoreCandidates = (slugs) => {
        return slugs.map((slug) => {
          const [authorSlug, trackSlug] = slug.split('/');
          const authorClean = cleanNorm(authorSlug.replace(/-/g, ' '));
          const trackClean = cleanNorm(trackSlug.replace(/-/g, ' '));
          const authorTokens = authorClean.split(/\s+/);
          const trackTokens = trackClean.split(/\s+/);

          let score = 0;
          let matchedTokens = 0;

          for (const w of queryWords) {
            if (trackTokens.includes(w)) {
              score += 5;
              matchedTokens++;
            } else if (trackClean.includes(w)) {
              score += 2.5;
              matchedTokens++;
            }

            if (authorTokens.includes(w)) {
              score += 4;
              matchedTokens++;
            } else if (authorClean.includes(w)) {
              score += 2;
              matchedTokens++;
            }
          }

          // Check for unwanted modifiers
          for (const pw of penaltyWords) {
            if (!query.toLowerCase().includes(pw)) {
              if (trackTokens.includes(pw) || trackClean.includes(pw)) score -= 12;
              if (authorTokens.includes(pw) || authorClean.includes(pw)) score -= 6;
            }
          }

          return { slug, score, matchedTokens };
        });
      };

      let scoredMatches = scoreCandidates(rawMatches);
      scoredMatches.sort((a, b) => b.score - a.score);

      // 4. Verify candidate track details (filter out 30-second Go+ snipped previews)
      const topSlugs = [...new Set(scoredMatches.map((m) => m.slug))].slice(0, 6);
      let candidateDetails = await Promise.all(topSlugs.map((s) => fetchTrackDetails(s)));
      let validCandidates = candidateDetails.filter(Boolean);

      // Check if we have any full-length candidate (not snipped and >40 seconds)
      let nonSnipped = validCandidates.filter((c) => !c.isSnipped && c.duration > 40000);

      // If all initial results are 30s snippets, attempt fallback search for audio upload
      if (!nonSnipped.length) {
        const fallbackQueries = [`${query} audio`, `${query} full`];
        for (const fbq of fallbackQueries) {
          const fbSlugs = await querySoundCloudSlugs(fbq);
          const fbScored = scoreCandidates(fbSlugs);
          fbScored.sort((a, b) => b.score - a.score);
          const fbTop = [...new Set(fbScored.map((m) => m.slug))].slice(0, 5);
          const fbDetails = await Promise.all(fbTop.map((s) => fetchTrackDetails(s)));
          const fbFull = fbDetails.filter((c) => c && !c.isSnipped && c.duration > 40000);
          if (fbFull.length) {
            nonSnipped = fbFull;
            break;
          }
        }
      }

      let bestMatch;
      if (nonSnipped.length > 0) {
        // Score non-snipped candidates and select top
        const scoredFull = nonSnipped.map((c) => {
          const matchMeta = scoredMatches.find((m) => m.slug === c.slug);
          return {
            ...c,
            score: matchMeta ? matchMeta.score : 5,
          };
        });
        scoredFull.sort((a, b) => b.score - a.score);
        bestMatch = scoredFull[0];
      } else if (validCandidates.length > 0) {
        bestMatch = validCandidates[0];
      } else if (scoredMatches.length > 0) {
        bestMatch = {
          slug: scoredMatches[0].slug,
          trackUrl: `https://soundcloud.com/${scoredMatches[0].slug}`,
          title: query,
          author: '',
          artworkUrl: null,
          isSnipped: false,
        };
      } else {
        return res.status(404).json({ error: 'No matching SoundCloud track found' });
      }

      let trackInfo = {
        trackUrl: bestMatch.trackUrl,
        title: bestMatch.title || query,
        author: bestMatch.author || '',
        artworkUrl: bestMatch.artworkUrl || null,
        duration: bestMatch.duration || null,
        fullDuration: bestMatch.fullDuration || null,
        isSnipped: bestMatch.isSnipped || false,
      };

      // Fallback to oembed if title/author are still missing
      if (!trackInfo.author) {
        try {
          const oembedRes = await fetch(
            `https://soundcloud.com/oembed?url=${encodeURIComponent(trackInfo.trackUrl)}&format=json`
          );
          if (oembedRes.ok) {
            const odata = await oembedRes.json();
            trackInfo.title = trackInfo.title || odata.title;
            trackInfo.author = trackInfo.author || odata.author_name;
            if (!trackInfo.artworkUrl && odata.thumbnail_url) {
              trackInfo.artworkUrl = odata.thumbnail_url.replace('-large', '-t500x500');
            }
          }
        } catch (e) {}
      }

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

  // AI Chat endpoint using Google Gemini SDK with role-based system instructions and model routing
  const handleChatRequest = async (req, res) => {
    try {
      const { message, history, systemInstruction, temperature, model, taskType } = req.body;

      if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ error: 'A message prompt is required.' });
      }

      const defaultSystemPrompt =
        systemInstruction ||
        'You are Gemini AI in grrmondays Web OS, a helpful, brilliant, and friendly AI assistant. You help users with gaming, programming, homework, research, and creative tasks. Format replies with clean markdown, clear paragraphs, code blocks with syntax highlighting, and bullet points where helpful.';

      const promptText = message.trim();
      const geminiApiKey = process.env.GEMINI_API_KEY;

      if (!geminiApiKey) {
        return res.status(500).json({
          error: 'Gemini API key is not configured on the server.',
        });
      }

      const ai = new GoogleGenAI({
        apiKey: geminiApiKey,
      });

      // Format Gemini multi-turn conversation history
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

      // Ordered model candidates with robust fallback
      const candidateModels = [
        'gemini-2.5-flash',
        'gemini-3.8-flash',
        'gemini-flash-latest',
        'gemini-2.5-flash-lite',
      ];

      // If user specifically requested a model, put it at front
      if (model && !candidateModels.includes(model)) {
        candidateModels.unshift(model);
      }

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
          return res.json({
            reply,
            provider: 'gemini',
            model: modelName,
            taskType: taskType || 'general',
          });
        } catch (err) {
          lastGeminiError = err;
          console.warn(`Model ${modelName} failed, trying next candidate:`, err?.message || err);
          continue;
        }
      }

      throw lastGeminiError || new Error('All AI generation models failed.');
    } catch (err) {
      console.error('AI Service Error:', err);
      const errorMessage =
        err?.message || 'An unexpected error occurred while communicating with the AI service.';
      return res.status(500).json({ error: errorMessage });
    }
  };

  app.post('/api/chat', handleChatRequest);
  app.post('/api/ai/chat', handleChatRequest);

  // Vite and Static SPA integration
  const distPath = path.join(process.cwd(), 'dist');
  const distIndexHtml = path.join(distPath, 'index.html');
  const distAssetsPath = path.join(distPath, 'assets');

  if (process.env.NODE_ENV === 'production' && fs.existsSync(distIndexHtml)) {
    // 1. Immutable long-term caching for hashed static assets
    if (fs.existsSync(distAssetsPath)) {
      app.use(
        '/assets',
        express.static(distAssetsPath, {
          etag: true,
          maxAge: '30d',
          setHeaders: (res) => {
            res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
          },
        })
      );
    }

    // 2. Static root assets with ETag
    app.use(
      express.static(distPath, {
        etag: true,
        maxAge: '1h',
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache, must-revalidate');
          } else {
            res.setHeader('Cache-Control', 'public, max-age=86400');
          }
        },
      })
    );

    // 3. Fallback for SPA routing
    app.get('*', (req, res) => {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
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

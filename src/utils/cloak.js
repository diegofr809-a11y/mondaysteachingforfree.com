import { CLOAK_PRESETS } from '../data/initialData';

export const resolvePlayableUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let url = rawUrl.trim();
  // Route CDN files that serve text/plain or Google Gadget XML through /api/game-frame
  if (url.includes('cdn.jsdelivr.net') || url.includes('raw.githubusercontent.com')) {
    url = `/api/game-frame?url=${encodeURIComponent(url)}`;
  }
  // Ensure absolute URL if relative
  if (url.startsWith('/')) {
    try {
      return `${window.location.origin}${url}`;
    } catch {
      return url;
    }
  }
  return url;
};

export const applyTabCloak = (cloakId, customTitle, customFavicon) => {
  let title = 'grrmondays';
  let favicon =
    'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%239333ea%22 stroke-width=%222%22><polygon points=%226 3 20 12 6 21 6 3%22/></svg>';

  if (cloakId === 'custom') {
    title = customTitle?.trim() || 'Classes';
    favicon = customFavicon?.trim() || 'https://ssl.gstatic.com/classroom/favicon.png';
  } else {
    const preset = CLOAK_PRESETS.find((p) => p.id === cloakId) || CLOAK_PRESETS[0];
    title = preset.title;
    favicon = preset.favicon;
  }

  // Set document title
  document.title = title;

  // Set favicon
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.href = favicon;
};

export const triggerPanic = (panicUrl) => {
  const url = panicUrl.startsWith('http') ? panicUrl : `https://${panicUrl}`;
  window.location.replace(url);
};

export const openAboutBlankCloaked = (targetUrl, title = 'Google Classroom', customFavicon) => {
  if (!targetUrl) return false;

  const resolvedUrl = resolvePlayableUrl(targetUrl);
  const cleanTitle = (title || 'Google Classroom').trim();
  const cleanFavicon =
    customFavicon || 'https://ssl.gstatic.com/classroom/favicon.png';

  const stealthHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${cleanTitle.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</title>
  <link rel="icon" type="image/x-icon" href="${cleanFavicon}">
  <link rel="shortcut icon" href="${cleanFavicon}">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100vw; height: 100vh; overflow: hidden; background: #000; margin: 0; padding: 0; }
    iframe { width: 100%; height: 100%; border: none; display: block; }
  </style>
</head>
<body>
  <iframe
    src="${resolvedUrl}"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen; gamepad; focus-without-user-activation *; pointer-lock *"
    allowfullscreen="true"
    webkitallowfullscreen="true"
    mozallowfullscreen="true"
  ></iframe>
</body>
</html>`;

  // 1. First Attempt: Direct about:blank with document.write
  try {
    const win = window.open('about:blank', '_blank');
    if (win && !win.closed) {
      try {
        win.document.open();
        win.document.write(stealthHtml);
        win.document.close();
        return true;
      } catch (docErr) {
        console.warn('Cross-origin about:blank write blocked, falling back to Blob', docErr);
        // Window is open, but document.write failed due to sandbox/origin isolation
        try {
          const blob = new Blob([stealthHtml], { type: 'text/html;charset=utf-8' });
          win.location.href = URL.createObjectURL(blob);
          return true;
        } catch {
          win.location.href = resolvedUrl;
          return true;
        }
      }
    }
  } catch (winErr) {
    console.warn('window.open about:blank blocked or threw', winErr);
  }

  // 2. Second Attempt: Open Blob URL with cloak shell (bypasses most strict iframe popup blocks)
  try {
    const blob = new Blob([stealthHtml], { type: 'text/html;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const win = window.open(blobUrl, '_blank');
    if (win && !win.closed) {
      return true;
    }

    // Dynamic anchor click fallback for Blob URL
    const a = document.createElement('a');
    a.href = blobUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    }, 2000);
    return true;
  } catch (blobErr) {
    console.warn('Blob fallback window failed', blobErr);
  }

  // 3. Third Attempt: Direct link click in new tab as safe fallback
  try {
    const a = document.createElement('a');
    a.href = resolvedUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
    }, 1000);
    return true;
  } catch (finalErr) {
    console.error('All cloaking popout methods failed', finalErr);
    return false;
  }
};

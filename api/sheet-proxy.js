import https from 'node:https';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  let cleanPath = req.url.replace(/^\/api\/sheet-proxy/, '');
  if (!cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath;
  }

  const targetUrl = 'https://docs.google.com' + cleanPath;

  const fetchWithRedirects = (url, depth = 0) => {
    if (depth > 5) {
      res.status(500).send('Too many redirects');
      return;
    }

    https.get(url, (targetRes) => {
      if (targetRes.statusCode >= 300 && targetRes.statusCode < 400 && targetRes.headers.location) {
        let redirectUrl = targetRes.headers.location;
        if (redirectUrl.startsWith('/')) {
          redirectUrl = 'https://docs.google.com' + redirectUrl;
        }
        targetRes.resume();
        return fetchWithRedirects(redirectUrl, depth + 1);
      }

      const chunks = [];
      targetRes.on('data', (chunk) => chunks.push(chunk));
      targetRes.on('end', () => {
        const buffer = Buffer.concat(chunks);
        res.setHeader('Content-Type', targetRes.headers['content-type'] || 'text/csv; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=30, s-maxage=30');
        res.status(targetRes.statusCode || 200).send(buffer);
      });
    }).on('error', (err) => {
      res.status(502).send(err.message);
    });
  };

  fetchWithRedirects(targetUrl);
}

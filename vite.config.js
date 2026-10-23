import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import https from 'node:https'

function googleSheetsProxyPlugin() {
  const cache = new Map();

  return {
    name: 'google-sheets-proxy',
    configureServer(server) {
      server.middlewares.use('/api/sheet-proxy', (req, res) => {
        // Handle CORS preflight
        if (req.method === 'OPTIONS') {
          res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': '*'
          });
          res.end();
          return;
        }

        const cleanUrl = req.url.startsWith('/') ? req.url : '/' + req.url;
        const targetUrl = 'https://docs.google.com' + cleanUrl;

        // Serve from memory cache if fresh (< 30 seconds)
        const cached = cache.get(targetUrl);
        if (cached && Date.now() - cached.time < 30000) {
          res.writeHead(200, {
            'Content-Type': 'text/csv; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'X-Cache': 'HIT'
          });
          res.end(cached.data);
          return;
        }

        let isClientAborted = false;
        req.on('close', () => {
          isClientAborted = true;
        });

        const fetchWithRedirects = (url, depth = 0) => {
          if (isClientAborted) return;
          if (depth > 5) {
            if (!res.headersSent) {
              res.writeHead(500, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
              res.end('Too many redirects');
            }
            return;
          }

          const clientReq = https.get(url, (targetRes) => {
            if (isClientAborted) return;

            // Handle 3xx redirects
            if (targetRes.statusCode >= 300 && targetRes.statusCode < 400 && targetRes.headers.location) {
              let redirectUrl = targetRes.headers.location;
              if (redirectUrl.startsWith('/')) {
                redirectUrl = 'https://docs.google.com' + redirectUrl;
              }
              targetRes.resume();
              return fetchWithRedirects(redirectUrl, depth + 1);
            }

            let chunks = [];
            targetRes.on('data', (chunk) => {
              chunks.push(chunk);
            });

            targetRes.on('end', () => {
              if (isClientAborted || res.headersSent) return;
              const buffer = Buffer.concat(chunks);
              
              if (targetRes.statusCode === 200) {
                cache.set(targetUrl, { data: buffer, time: Date.now() });
              }

              res.writeHead(targetRes.statusCode || 200, {
                'Content-Type': 'text/csv; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': '*'
              });
              res.end(buffer);
            });
          });

          clientReq.on('error', (err) => {
            if (!res.headersSent && !isClientAborted) {
              res.writeHead(502, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
              res.end(err.message);
            }
          });
        };

        fetchWithRedirects(targetUrl);
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), googleSheetsProxyPlugin()],
})

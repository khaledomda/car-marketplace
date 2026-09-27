// Daleel — zero-dependency Node server for running on your own machine or VPS.
// Serves the app from /public and stores collected data in data/db.json.
// (On Vercel, api/index.js is used instead, with Upstash Redis storage.)

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { createApi, send } = require('./lib/core');
const { createFileStore } = require('./lib/file-store');

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'data', 'db.json');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

const handleApi = createApi(createFileStore(DB_FILE), { adminToken: process.env.ADMIN_TOKEN || '' });

function serveStatic(req, res, url) {
  let rel = decodeURIComponent(url.pathname);
  if (rel === '/') rel = '/index.html';
  if (rel === '/admin') rel = '/admin.html';
  const file = path.normalize(path.join(PUBLIC_DIR, rel));
  if (!file.startsWith(PUBLIC_DIR)) return send(res, 403, { error: 'forbidden' });
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found');
    }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': rel === '/sw.js' ? 'no-cache' : 'public, max-age=300',
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (url.pathname.startsWith('/api/')) return handleApi(req, res, url);
  serveStatic(req, res, url);
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Daleel running on http://localhost:${PORT}`);
    if (!process.env.ADMIN_TOKEN) console.log('ADMIN_TOKEN not set: the admin dashboard is disabled.');
  });
}

module.exports = { server };

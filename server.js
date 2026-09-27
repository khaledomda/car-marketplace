// Daleel — zero-dependency Node server.
// Serves the app from /public and stores collected data in data/db.json.
// Trial period: no payment endpoints exist on purpose.

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const PORT = Number(process.env.PORT) || 3000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';
const PUBLIC_DIR = path.join(__dirname, 'public');
const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'data', 'db.json');
const MAX_BODY = 32 * 1024;

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

// ---------- storage ----------
function emptyDb() {
  return { visits: [], requests: [], ratings: [], termsAcceptances: [] };
}

function loadDb() {
  try {
    return { ...emptyDb(), ...JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) };
  } catch {
    return emptyDb();
  }
}

let db = loadDb();
let saveTimer = null;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    const tmp = DB_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
    fs.renameSync(tmp, DB_FILE);
  }, 200);
}

// ---------- helpers ----------
const str = (v, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const num = (v, min, max) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : null;
};
const hashIp = (req) =>
  crypto
    .createHash('sha256')
    .update(String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '') + 'daleel')
    .digest('hex')
    .slice(0, 16);

function send(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) {
        reject(new Error('too_large'));
        req.destroy();
      } else chunks.push(c);
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
      } catch {
        reject(new Error('bad_json'));
      }
    });
  });
}

function stats() {
  const ratings = db.ratings.map((r) => r.stars);
  const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
  return {
    visits: db.visits.length,
    uniqueVisitors: new Set(db.visits.map((v) => v.visitorId)).size,
    requests: db.requests.length,
    ratingAvg: Math.round(avg * 10) / 10,
    ratingCount: ratings.length,
    recentReviews: db.ratings
      .filter((r) => r.comment)
      .slice(-6)
      .reverse()
      .map(({ stars, comment, name, at }) => ({ stars, comment, name, at })),
  };
}

function isAdmin(req, url) {
  if (!ADMIN_TOKEN) return false;
  const auth = req.headers.authorization || '';
  return auth === `Bearer ${ADMIN_TOKEN}` || url.searchParams.get('token') === ADMIN_TOKEN;
}

function toCsv(rows) {
  if (!rows.length) return '';
  const keys = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  const esc = (v) => {
    const s = v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [keys.join(','), ...rows.map((r) => keys.map((k) => esc(r[k])).join(','))].join('\n');
}

// ---------- API ----------
async function api(req, res, url) {
  const route = `${req.method} ${url.pathname}`;
  const meta = () => ({
    at: new Date().toISOString(),
    ipHash: hashIp(req),
    userAgent: str(req.headers['user-agent'], 300),
  });

  if (route === 'GET /api/stats') return send(res, 200, stats());

  if (route === 'POST /api/visit') {
    const b = await readJson(req);
    db.visits.push({
      ...meta(),
      visitorId: str(b.visitorId, 64),
      page: str(b.page, 100),
      lang: str(b.lang, 5),
      referrer: str(b.referrer, 300),
      utm: str(b.utm, 300),
      screen: str(b.screen, 20),
    });
    save();
    return send(res, 200, stats());
  }

  if (route === 'POST /api/requests') {
    const b = await readJson(req);
    const name = str(b.name, 80);
    const phone = str(b.phone, 20).replace(/[^\d+]/g, '');
    if (!name || phone.length < 9 || !b.consent) return send(res, 400, { error: 'missing_fields' });
    const item = {
      id: crypto.randomUUID(),
      ...meta(),
      visitorId: str(b.visitorId, 64),
      mode: b.mode === 'specific' ? 'specific' : 'budget',
      name,
      phone,
      city: str(b.city, 40),
      budget: num(b.budget, 0, 5_000_000),
      make: str(b.make, 40),
      model: str(b.model, 40),
      yearFrom: num(b.yearFrom, 1980, 2030),
      bodyType: str(b.bodyType, 30),
      usage: str(b.usage, 30),
      contact: str(b.contact, 20),
      femaleAdvisor: !!b.femaleAdvisor,
      firstCar: !!b.firstCar,
      notes: str(b.notes, 1000),
      lang: str(b.lang, 5),
      status: 'new',
    };
    db.requests.push(item);
    save();
    return send(res, 201, { id: item.id });
  }

  if (route === 'POST /api/terms') {
    const b = await readJson(req);
    db.termsAcceptances.push({
      ...meta(),
      visitorId: str(b.visitorId, 64),
      requestId: str(b.requestId, 64),
      version: str(b.version, 20),
    });
    save();
    return send(res, 201, { ok: true });
  }

  if (route === 'POST /api/ratings') {
    const b = await readJson(req);
    const stars = num(b.stars, 1, 5);
    if (!stars) return send(res, 400, { error: 'missing_stars' });
    db.ratings.push({
      ...meta(),
      visitorId: str(b.visitorId, 64),
      stars: Math.round(stars),
      name: str(b.name, 40),
      comment: str(b.comment, 500),
    });
    save();
    return send(res, 201, stats());
  }

  if (url.pathname.startsWith('/api/admin')) {
    if (!isAdmin(req, url)) return send(res, 401, { error: 'unauthorized' });
    if (route === 'GET /api/admin/data') return send(res, 200, { stats: stats(), ...db });
    const m = url.pathname.match(/^\/api\/admin\/export\/(visits|requests|ratings|termsAcceptances)\.csv$/);
    if (req.method === 'GET' && m) {
      res.writeHead(200, {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${m[1]}.csv"`,
      });
      return res.end('﻿' + toCsv(db[m[1]]));
    }
    const s = url.pathname.match(/^\/api\/admin\/requests\/([\w-]+)$/);
    if (req.method === 'PATCH' && s) {
      const b = await readJson(req);
      const item = db.requests.find((r) => r.id === s[1]);
      if (!item) return send(res, 404, { error: 'not_found' });
      if (['new', 'contacted', 'searching', 'matched', 'bought', 'closed'].includes(b.status)) item.status = b.status;
      if (typeof b.adminNote === 'string') item.adminNote = str(b.adminNote, 1000);
      save();
      return send(res, 200, item);
    }
  }

  return send(res, 404, { error: 'not_found' });
}

// ---------- static ----------
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

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  try {
    if (url.pathname.startsWith('/api/')) return await api(req, res, url);
    serveStatic(req, res, url);
  } catch (e) {
    send(res, e.message === 'too_large' ? 413 : 400, { error: e.message || 'bad_request' });
  }
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Daleel running on http://localhost:${PORT}`);
    if (!ADMIN_TOKEN) console.log('ADMIN_TOKEN not set: the admin dashboard is disabled.');
  });
}

module.exports = { server };

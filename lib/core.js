// Shared API logic used by the local server (server.js) and the Vercel function (api/index.js).
// Trial period: there are no payment endpoints on purpose.
const crypto = require('node:crypto');

const MAX_BODY = 32 * 1024;
const STATUSES = ['new', 'contacted', 'searching', 'matched', 'bought', 'closed'];
const EXPORTS = ['visits', 'searches', 'suggestions', 'requests', 'ratings', 'termsAcceptances'];

const str = (v, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const num = (v, min, max) => {
  if (v === '' || v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : null;
};

function clientIp(req) {
  return String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();
}
const hashIp = (req) => crypto.createHash('sha256').update(clientIp(req) + 'daleel').digest('hex').slice(0, 16);

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function readJson(req) {
  // Vercel's Node runtime parses the body for us; a plain Node server does not.
  if (process.env.VERCEL) {
    const b = req.body;
    if (typeof b === 'string') return Promise.resolve(JSON.parse(b || '{}'));
    return Promise.resolve(b && typeof b === 'object' ? b : {});
  }
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

function toCsv(rows) {
  if (!rows.length) return '';
  const keys = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  const esc = (v) => {
    const s = v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [keys.join(','), ...rows.map((r) => keys.map((k) => esc(r[k])).join(','))].join('\n');
}

// Builds the public stats object from raw lists (used by the file store).
function computeStats({ visits, searches = [], requests, ratings }) {
  const stars = ratings.map((r) => r.stars);
  const avg = stars.length ? stars.reduce((a, b) => a + b, 0) / stars.length : 0;
  return {
    visits: visits.length,
    uniqueVisitors: new Set(visits.map((v) => v.visitorId)).size,
    searches: searches.length,
    requests: requests.length,
    ratingAvg: Math.round(avg * 10) / 10,
    ratingCount: stars.length,
    recentReviews: publicReviews(ratings.slice().reverse()),
  };
}
// `newestFirst` must be ordered newest first.
function publicReviews(newestFirst) {
  return newestFirst
    .filter((r) => r.comment)
    .slice(0, 6)
    .map(({ stars, comment, name, at }) => ({ stars, comment, name, at }));
}

function createApi(store, { adminToken = '' } = {}) {
  const isAdmin = (req, url) =>
    !!adminToken && (req.headers.authorization === `Bearer ${adminToken}` || url.searchParams.get('token') === adminToken);

  return async function handle(req, res, url, pathname = url.pathname) {
    try {
      const route = `${req.method} ${pathname}`;
      const meta = () => ({
        at: new Date().toISOString(),
        ipHash: hashIp(req),
        userAgent: str(req.headers['user-agent'], 300),
      });

      if (route === 'GET /api/stats') return send(res, 200, await store.stats());

      if (route === 'POST /api/visit') {
        const b = await readJson(req);
        await store.addVisit({
          ...meta(),
          visitorId: str(b.visitorId, 64),
          page: str(b.page, 100),
          lang: str(b.lang, 5),
          referrer: str(b.referrer, 300),
          utm: str(b.utm, 300),
          screen: str(b.screen, 20),
          country: str(req.headers['x-vercel-ip-country'], 4),
          region: str(req.headers['x-vercel-ip-country-region'], 10),
          cityGeo: str(decodeURIComponent(req.headers['x-vercel-ip-city'] || ''), 60),
        });
        return send(res, 200, await store.stats());
      }

      if (route === 'POST /api/search') {
        const b = await readJson(req);
        await store.addSearch({
          ...meta(),
          visitorId: str(b.visitorId, 64),
          lang: str(b.lang, 5),
          budget: num(b.budget, 0, 5_000_000),
          make: str(b.make, 30),
          model: str(b.model, 30),
          yearFrom: num(b.yearFrom, 1980, 2030),
          yearTo: num(b.yearTo, 1980, 2030),
          city: str(b.city, 30),
          bodyType: str(b.bodyType, 20),
          features: str(b.features, 200),
          country: str(req.headers['x-vercel-ip-country'], 4),
        });
        return send(res, 201, await store.stats());
      }

      if (route === 'POST /api/suggestions') {
        const b = await readJson(req);
        const text = str(b.text, 1000);
        if (!text) return send(res, 400, { error: 'missing_text' });
        await store.addSuggestion({
          ...meta(),
          visitorId: str(b.visitorId, 64),
          lang: str(b.lang, 5),
          stars: num(b.stars, 1, 5),
          text,
        });
        return send(res, 201, { ok: true });
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
        await store.addRequest(item);
        return send(res, 201, { id: item.id });
      }

      if (route === 'POST /api/terms') {
        const b = await readJson(req);
        await store.addTerms({
          ...meta(),
          visitorId: str(b.visitorId, 64),
          requestId: str(b.requestId, 64),
          version: str(b.version, 20),
        });
        return send(res, 201, { ok: true });
      }

      if (route === 'POST /api/ratings') {
        const b = await readJson(req);
        const stars = num(b.stars, 1, 5);
        if (!stars) return send(res, 400, { error: 'missing_stars' });
        await store.addRating({
          ...meta(),
          visitorId: str(b.visitorId, 64),
          stars: Math.round(stars),
          name: str(b.name, 40),
          comment: str(b.comment, 500),
        });
        return send(res, 201, await store.stats());
      }

      if (pathname.startsWith('/api/admin')) {
        if (!isAdmin(req, url)) return send(res, 401, { error: 'unauthorized' });
        if (route === 'GET /api/admin/data') {
          const all = await store.dump();
          return send(res, 200, { stats: await store.stats(), ...all });
        }
        const m = pathname.match(/^\/api\/admin\/export\/(\w+)\.csv$/);
        if (req.method === 'GET' && m && EXPORTS.includes(m[1])) {
          const all = await store.dump();
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/csv; charset=utf-8');
          res.setHeader('Content-Disposition', `attachment; filename="${m[1]}.csv"`);
          return res.end('﻿' + toCsv(all[m[1]]));
        }
        const s = pathname.match(/^\/api\/admin\/requests\/([\w-]+)$/);
        if (req.method === 'PATCH' && s) {
          const b = await readJson(req);
          const patch = {};
          if (STATUSES.includes(b.status)) patch.status = b.status;
          if (typeof b.adminNote === 'string') patch.adminNote = str(b.adminNote, 1000);
          const item = await store.updateRequest(s[1], patch);
          return item ? send(res, 200, item) : send(res, 404, { error: 'not_found' });
        }
      }

      return send(res, 404, { error: 'not_found' });
    } catch (e) {
      if (e.message === 'too_large') return send(res, 413, { error: 'too_large' });
      if (e.message === 'bad_json') return send(res, 400, { error: 'bad_json' });
      console.error(e);
      return send(res, 500, { error: 'server_error' });
    }
  };
}

module.exports = { createApi, computeStats, publicReviews, send };

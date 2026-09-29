// Checks whether a platform's results page actually has listings for the wanted car.
// It reads only the listing count and lowest price the page itself publishes (title,
// schema.org data or a "no results" message). No ads are copied or stored.
// A site is reported "none" only when the page clearly shows zero results; anything
// unclear is "unknown", so a site is never hidden by mistake.

const ALLOWED_HOSTS = new Set([
  'haraj.com.sa', 'syarah.com', 'ksa.carswitch.com', 'sa.opensooq.com',
  'ksa.motory.com', 'ksa.yallamotor.com', 'www.mstaml.com', 'www.expatriates.com',
]);
const TIMEOUT_MS = 5000;
const MAX_BYTES = 1_500_000;
const CACHE_MS = 6 * 60 * 60 * 1000;
const memCache = new Map();

const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const toLatin = (s) => s.replace(/[٠-٩]/g, (d) => String(AR_DIGITS.indexOf(d))).replace(/[,٬،]/g, '');

const NO_RESULTS = [
  /لا\s*توجد\s*(نتائج|إعلانات|سيارات)/, /لم\s*(يتم|نجد)\s*(العثور|أي)/, /لا\s*يوجد\s*(نتائج|إعلانات|سيارات)/,
  /no\s+(results|cars|listings|ads)\s+(found|available)/i, /\b0\s+(results|cars|listings|ads)\b/i, /we\s+couldn'?t\s+find/i,
];

function isAllowed(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && ALLOWED_HOSTS.has(u.hostname);
  } catch {
    return false;
  }
}

async function fetchText(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AfdalAlmaaroudBot/1.0; availability check)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ar,en;q=0.8',
      },
    });
    let text = '';
    if (res.body && res.ok) {
      const reader = res.body.getReader();
      const chunks = [];
      let size = 0;
      while (size < MAX_BYTES) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        size += value.length;
      }
      reader.cancel().catch(() => {});
      text = Buffer.concat(chunks.map((c) => Buffer.from(c))).toString('utf8');
    }
    return { status: res.status, finalUrl: res.url, text };
  } finally {
    clearTimeout(timer);
  }
}

// Pure function so it can be tested without the network.
function analyse({ status, text }) {
  if (status === 404 || status === 410) return { state: 'none', reason: 'not_found' };
  if (status >= 400 || !text) return { state: 'unknown', reason: `http_${status}` };

  let count = null;
  const ld = text.match(/"(?:offerCount|numberOfItems)"\s*:\s*"?(\d+)/);
  if (ld) count = Number(ld[1]);
  if (count == null) {
    const title = (text.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '';
    const m = toLatin(title).match(/(?:^|\s|\|)(\d+)\s+(?:used|cars?|new|سيار|مستعمل|اعلان|إعلان)/i);
    if (m) count = Number(m[1]);
  }
  let lowPrice = null;
  const lp = text.match(/"lowPrice"\s*:\s*"?([\d.]+)/);
  if (lp) lowPrice = Math.round(Number(lp[1])) || null;
  if (lowPrice == null) {
    const title = toLatin((text.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '');
    const pm = title.match(/(?:from|من|ابتداء[اً]*\s*من)\s*(\d{3,7})\s*(?:SAR|ريال|ر\.س)/i);
    if (pm) lowPrice = Number(pm[1]);
  }

  if (count === 0) return { state: 'none', reason: 'zero' };
  if (count > 0) return { state: 'available', count, lowPrice };
  const visible = text.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, ' ');
  if (NO_RESULTS.some((r) => r.test(visible))) return { state: 'none', reason: 'no_results_text' };
  return { state: 'unknown', lowPrice };
}

async function checkOne(url, cache) {
  const hit = memCache.get(url);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.result;
  if (cache) {
    const stored = await cache.get(url).catch(() => null);
    if (stored) return stored;
  }
  let result;
  try {
    result = analyse(await fetchText(url));
  } catch (e) {
    result = { state: 'unknown', reason: e.name === 'AbortError' ? 'timeout' : 'fetch_failed' };
  }
  result.checkedAt = new Date().toISOString();
  memCache.set(url, { at: Date.now(), result });
  if (cache && result.state !== 'unknown') await cache.set(url, result, CACHE_MS / 1000).catch(() => {});
  return result;
}

// urls: { siteId: url }. Returns { siteId: result }.
async function checkAvailability(urls, cache) {
  const entries = Object.entries(urls || {}).filter(([, u]) => isAllowed(u)).slice(0, 12);
  const results = await Promise.all(entries.map(([id, u]) => checkOne(u, cache).then((r) => [id, r])));
  return Object.fromEntries(results);
}

module.exports = { checkAvailability, analyse, isAllowed };

// Upstash Redis storage over its REST API, for Vercel (serverless has no writable disk).
// Connect "Upstash for Redis" from the Vercel Marketplace; it sets the env vars below.
const { publicReviews, saudiDay } = require('./core');
const dayKey = () => 'daleel:visits:day:' + saudiDay();

const K = {
  visitCount: 'daleel:visits:count',
  visitors: 'daleel:visitors',
  visits: 'daleel:visits', // newest first, capped
  searches: 'daleel:searches', // newest first, capped
  suggestions: 'daleel:suggestions', // newest first
  requests: 'daleel:requests', // hash id -> json
  ratings: 'daleel:ratings', // newest first
  ratingSum: 'daleel:ratings:sum',
  terms: 'daleel:terms', // newest first
};
const MAX_VISIT_LOG = 20000;

// Finds the database settings whatever names Vercel gave them. Vercel's Upstash integration
// may add a custom prefix (e.g. STORAGE_KV_REST_API_URL) or provide only REDIS_URL / KV_URL.
function redisConfig(env = process.env) {
  const keys = Object.keys(env);
  const restUrlKey = keys.find((k) => /(^|_)(KV_REST_API_URL|UPSTASH_REDIS_REST_URL|REDIS_REST_URL)$/.test(k) && /^https:\/\//.test(env[k]));
  if (restUrlKey) {
    const tokenKey = [restUrlKey.replace(/URL$/, 'TOKEN'), ...keys.filter((k) => /(KV_REST_API_TOKEN|REDIS_REST_TOKEN)$/.test(k) && !/READ_ONLY/.test(k))]
      .find((k) => env[k]);
    if (tokenKey) return { kind: 'upstash-rest', url: env[restUrlKey].replace(/\/$/, ''), token: env[tokenKey], keys: [restUrlKey, tokenKey] };
  }
  const tcpKey = keys.find((k) => /(^|_)(REDIS_URL|KV_URL)$/.test(k) && /^rediss?:\/\//.test(env[k]));
  if (tcpKey) return { kind: 'redis-tcp', redisUrl: env[tcpKey], keys: [tcpKey] };
  return null;
}

function restPipeline({ url, token }) {
  return async function pipeline(cmds) {
    const res = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(cmds),
    });
    if (!res.ok) throw new Error(`redis_http_${res.status}`);
    const out = await res.json();
    const err = out.find((r) => r.error);
    if (err) throw new Error(`redis: ${err.error}`);
    return out.map((r) => r.result);
  };
}

function createRedisStore(cfg) {
  const pipeline = cfg.kind === 'redis-tcp' ? require('./redis-tcp').createTcpPipeline(cfg.redisUrl) : restPipeline(cfg);
  const parse = (list) => (list || []).map((s) => JSON.parse(s));

  return {
    async ping() {
      const [pong] = await pipeline([['PING']]);
      return pong === 'PONG';
    },
    // Small cache for availability checks.
    cache: {
      async get(key) {
        const [v] = await pipeline([['GET', 'daleel:chk:' + key]]);
        return v ? JSON.parse(v) : null;
      },
      async set(key, value, ttlSeconds) {
        await pipeline([['SET', 'daleel:chk:' + key, JSON.stringify(value), 'EX', Math.round(ttlSeconds)]]);
      },
    },
    async addVisit(v) {
      const cmds = [['INCR', K.visitCount], ['INCR', dayKey()], ['EXPIRE', dayKey(), 3 * 86400],
        ['LPUSH', K.visits, JSON.stringify(v)], ['LTRIM', K.visits, 0, MAX_VISIT_LOG - 1]];
      if (v.visitorId) cmds.push(['SADD', K.visitors, v.visitorId]);
      await pipeline(cmds);
    },
    async addSearch(s) {
      await pipeline([['LPUSH', K.searches, JSON.stringify(s)], ['LTRIM', K.searches, 0, MAX_VISIT_LOG - 1]]);
    },
    async addSuggestion(s) {
      await pipeline([['LPUSH', K.suggestions, JSON.stringify(s)]]);
    },
    async addRequest(r) {
      await pipeline([['HSET', K.requests, r.id, JSON.stringify(r)]]);
    },
    async addTerms(t) {
      await pipeline([['LPUSH', K.terms, JSON.stringify(t)]]);
    },
    async addRating(r) {
      await pipeline([['LPUSH', K.ratings, JSON.stringify(r)], ['INCRBY', K.ratingSum, r.stars]]);
    },
    async updateRequest(id, patch) {
      const [raw] = await pipeline([['HGET', K.requests, id]]);
      if (!raw) return null;
      const item = { ...JSON.parse(raw), ...patch };
      await pipeline([['HSET', K.requests, id, JSON.stringify(item)]]);
      return item;
    },
    async stats() {
      const [visits, visitors, requests, ratingCount, ratingSum, recent, searches, today] = await pipeline([
        ['GET', K.visitCount],
        ['SCARD', K.visitors],
        ['HLEN', K.requests],
        ['LLEN', K.ratings],
        ['GET', K.ratingSum],
        ['LRANGE', K.ratings, 0, 49],
        ['LLEN', K.searches],
        ['GET', dayKey()],
      ]);
      const count = Number(ratingCount) || 0;
      return {
        visits: Number(visits) || 0,
        visitsToday: Number(today) || 0,
        uniqueVisitors: Number(visitors) || 0,
        searches: Number(searches) || 0,
        requests: Number(requests) || 0,
        ratingAvg: count ? Math.round((Number(ratingSum) / count) * 10) / 10 : 0,
        ratingCount: count,
        recentReviews: publicReviews(parse(recent)),
      };
    },
    async dump() {
      const [visits, requests, ratings, terms, searches, suggestions] = await pipeline([
        ['LRANGE', K.visits, 0, -1],
        ['HVALS', K.requests],
        ['LRANGE', K.ratings, 0, -1],
        ['LRANGE', K.terms, 0, -1],
        ['LRANGE', K.searches, 0, -1],
        ['LRANGE', K.suggestions, 0, -1],
      ]);
      const byDate = (a, b) => a.at.localeCompare(b.at);
      return {
        visits: parse(visits).reverse(),
        searches: parse(searches).reverse(),
        suggestions: parse(suggestions).reverse(),
        requests: parse(requests).sort(byDate),
        ratings: parse(ratings).reverse(),
        termsAcceptances: parse(terms).reverse(),
      };
    },
  };
}

module.exports = { createRedisStore, redisConfig };

// Vercel serverless entry. vercel.json rewrites every /api/* call here.
const { createApi } = require('../lib/core');
const { createRedisStore, redisConfig } = require('../lib/redis-store');

const cfg = redisConfig();
// Without a database, storage calls answer 503 (the app falls back to demo mode)
// but the availability check still works.
const noStore = new Proxy({}, {
  get: (_, key) => (key === 'cache' ? null : () => Promise.reject(new Error('storage_not_configured'))),
});
const handle = createApi(cfg ? createRedisStore(cfg) : noStore, { adminToken: process.env.ADMIN_TOKEN || '' });

module.exports = async (req, res) => {
  const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
  const rewritten = url.searchParams.get('__path');
  const pathname = rewritten != null ? `/api/${rewritten}` : url.pathname;
  return handle(req, res, url, pathname);
};

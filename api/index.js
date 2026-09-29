// Vercel serverless entry. vercel.json rewrites every /api/* call here.
const { createApi } = require('../lib/core');
const { createRedisStore, redisConfig } = require('../lib/redis-store');

const cfg = redisConfig();
// Without a database, storage calls answer 503 (the app falls back to demo mode)
// but the availability check still works.
const noStore = new Proxy({}, {
  get: (_, key) => {
    if (key === 'cache') return null;
    if (key === 'kind') return 'none';
    if (key === 'envNames') return [];
    if (key === 'ping') return async () => false;
    return () => Promise.reject(new Error('storage_not_configured'));
  },
});
const store = cfg ? Object.assign(createRedisStore(cfg), { kind: cfg.kind, envNames: cfg.keys }) : noStore;
const handle = createApi(store, { adminToken: process.env.ADMIN_TOKEN || '' });

module.exports = async (req, res) => {
  const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
  const rewritten = url.searchParams.get('__path');
  const pathname = rewritten != null ? `/api/${rewritten}` : url.pathname;
  return handle(req, res, url, pathname);
};

// Vercel serverless entry. vercel.json rewrites every /api/* call here.
const { createApi, send } = require('../lib/core');
const { createRedisStore, redisConfig } = require('../lib/redis-store');

const cfg = redisConfig();
const handle = cfg ? createApi(createRedisStore(cfg), { adminToken: process.env.ADMIN_TOKEN || '' }) : null;

module.exports = async (req, res) => {
  const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
  const rewritten = url.searchParams.get('__path');
  const pathname = rewritten != null ? `/api/${rewritten}` : url.pathname;
  // Without a database the app still works in demo mode (data stays on each device).
  if (!handle) return send(res, 503, { error: 'storage_not_configured' });
  return handle(req, res, url, pathname);
};

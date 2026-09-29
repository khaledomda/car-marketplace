// Minimal Redis client over TCP/TLS (RESP protocol), used when only REDIS_URL
// (redis:// or rediss://) is available. Sends a pipeline of commands per connection.
const net = require('node:net');
const tls = require('node:tls');

function encode(cmd) {
  let out = `*${cmd.length}\r\n`;
  for (const part of cmd) {
    const s = String(part);
    out += `$${Buffer.byteLength(s)}\r\n${s}\r\n`;
  }
  return out;
}

// Parses one RESP reply from buf at offset; returns [value, nextOffset] or null if incomplete.
function parse(buf, i) {
  const end = buf.indexOf('\r\n', i);
  if (end === -1) return null;
  const type = String.fromCharCode(buf[i]);
  const line = buf.toString('utf8', i + 1, end);
  const next = end + 2;
  if (type === '+') return [line, next];
  if (type === '-') return [{ error: line }, next];
  if (type === ':') return [Number(line), next];
  if (type === '$') {
    const len = Number(line);
    if (len === -1) return [null, next];
    if (buf.length < next + len + 2) return null;
    return [buf.toString('utf8', next, next + len), next + len + 2];
  }
  if (type === '*') {
    const n = Number(line);
    if (n === -1) return [null, next];
    const arr = [];
    let pos = next;
    for (let k = 0; k < n; k++) {
      const r = parse(buf, pos);
      if (!r) return null;
      arr.push(r[0]);
      pos = r[1];
    }
    return [arr, pos];
  }
  throw new Error('redis: bad reply');
}

function createTcpPipeline(redisUrl) {
  const u = new URL(redisUrl);
  const secure = u.protocol === 'rediss:';
  const port = Number(u.port) || 6379;
  const auth = u.password ? [['AUTH', ...(u.username && u.username !== 'default' ? [decodeURIComponent(u.username)] : []), decodeURIComponent(u.password)]] : [];

  return function pipeline(cmds) {
    return new Promise((resolve, reject) => {
      const all = [...auth, ...cmds];
      const sock = secure ? tls.connect({ host: u.hostname, port, servername: u.hostname }) : net.connect({ host: u.hostname, port });
      let buf = Buffer.alloc(0);
      const replies = [];
      const timer = setTimeout(() => { sock.destroy(); reject(new Error('redis: timeout')); }, 5000);
      sock.on(secure ? 'secureConnect' : 'connect', () => sock.write(all.map(encode).join('')));
      sock.on('data', (chunk) => {
        buf = Buffer.concat([buf, chunk]);
        let pos = 0;
        let r;
        while (replies.length < all.length && (r = parse(buf, pos))) {
          replies.push(r[0]);
          pos = r[1];
        }
        buf = buf.subarray(pos);
        if (replies.length === all.length) {
          clearTimeout(timer);
          sock.end();
          const out = replies.slice(auth.length);
          const err = replies.find((x) => x && x.error);
          if (err) return reject(new Error(`redis: ${err.error}`));
          resolve(out);
        }
      });
      sock.on('error', (e) => { clearTimeout(timer); reject(e); });
    });
  };
}

module.exports = { createTcpPipeline, parse, encode };

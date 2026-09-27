// Builds a static, backend-free copy of the app in dist/demo for previews.
// Without the API the app runs in demo mode and keeps data on the device.
const fs = require('node:fs');
const path = require('node:path');

const src = path.join(__dirname, '..', 'public');
const out = path.join(__dirname, '..', 'dist', 'demo');
fs.mkdirSync(out, { recursive: true });

let html = fs.readFileSync(path.join(src, 'index.html'), 'utf8');
html = html
  .replace(/<!--APP-HEAD-START-->[\s\S]*?<!--APP-HEAD-END-->\n?/, '')
  .replace(/<!doctype html>\n?/i, '')
  .replace(/<\/?(html|head|body)[^>]*>\n?/g, '')
  .replace(/<meta (charset|name="viewport")[^>]*>\n?/g, '');
fs.writeFileSync(path.join(out, 'index.html'), html);
for (const f of ['styles.css', 'app.js', 'data.js']) fs.copyFileSync(path.join(src, f), path.join(out, f));
console.log('Demo written to', out);

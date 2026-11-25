import http from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = fileURLToPath(new URL('../', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webm': 'video/webm', '.gif': 'image/gif', '.json': 'application/json; charset=utf-8', '.md': 'text/plain; charset=utf-8' };

export async function createServer(port = 4173) {
  const base = await realpath(root);
  const server = http.createServer(async (req, res) => {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
    try {
      const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      if (name.split('/').some(part => part.startsWith('.') || part.includes('\\'))) throw new Error('Blocked path');
      const candidate = path.resolve(base, `.${name}`, name.endsWith('/') ? 'index.html' : '');
      const resolved = await realpath(candidate);
      const relative = path.relative(base, resolved);
      if (relative.startsWith('..') || path.isAbsolute(relative) || !(await stat(resolved)).isFile()) throw new Error('Blocked path');
      const data = await readFile(resolved);
      res.writeHead(200, { 'Content-Type': types[path.extname(resolved)] || 'application/octet-stream', 'Content-Length': data.length, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      res.end(req.method === 'HEAD' ? undefined : data);
    } catch { res.writeHead(404); res.end('Not found'); }
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); });
  return server;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 4173);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT inválida');
  const server = await createServer(port);
  console.log(`O BEKO: http://127.0.0.1:${server.address().port} — Ctrl+C para encerrar`);
}

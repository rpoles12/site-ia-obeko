import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { root, createServer } from './serve.mjs';

const html = await readFile(path.join(root, 'index.html'), 'utf8');
const manifest = JSON.parse(await readFile(path.join(root, 'docs/original-assets.json'), 'utf8'));
for (const item of manifest.assets) {
  const bytes = await readFile(path.join(root, item.path));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), item.sha256, `Artefato original alterado: ${item.path}`);
}
for (const [, file] of html.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g)) await access(path.join(root, file));
const bundle = manifest.assets.find(item => item.path.endsWith('.js')).path;
const syntax = spawnSync(process.execPath, ['--check', path.join(root, bundle)], { encoding: 'utf8' });
assert.equal(syntax.status, 0, syntax.stderr);
for (const name of ['README.md', 'docs/PROJECT.md', 'docs/ARCHITECTURE.md', 'docs/DEVELOPMENT.md', 'docs/VALIDATION.md', 'docs/MEDIA.md']) {
  const text = await readFile(path.join(root, name), 'utf8');
  for (const [, target] of text.matchAll(/\]\(([^)]+)\)/g)) {
    if (/^(?:https?:|#|mailto:)/.test(target)) continue;
    await access(path.resolve(root, path.dirname(name), target.split('#')[0]));
  }
}
const server = await createServer(0);
try {
  // Exercita o handler HTTP real sem depender de permissão de rede/loopback.
  const handler = server.listeners('request')[0];
  const request = async (url, method = 'GET') => {
    const response = {};
    await handler({ url, method }, {
      writeHead(status, headers = {}) { response.status = status; response.headers = headers; },
      end(body) { response.body = body; }
    });
    return response;
  };
  assert.equal((await request('/')).status, 200);
  assert.match((await request(`/${bundle}`)).headers['Content-Type'], /javascript/);
  assert.equal((await request('/.git/config')).status, 404);
  assert.equal((await request('/missing')).status, 404);
  assert.equal((await request('/', 'POST')).status, 405);
  assert.equal((await request('/', 'HEAD')).body, undefined);
  assert.equal((await request('/%2e%2e%5cindex.html')).status, 404);
} finally { await new Promise(resolve => server.close(resolve)); }
console.log(`OK: ${manifest.assets.length} artefatos originais íntegros; sintaxe JS, referências locais, documentação e handler HTTP verificados sem rede.`);

import assert from 'node:assert/strict';
import fs from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'artifacts/safe-public-works/dist');
const { default: worker } = await import(pathToFileURL(path.join(output, 'wix-server/entry.mjs')));
let count = 0;
for (const file of fs.readdirSync(path.join(output, 'public'), { recursive: true })) {
  if (!file.endsWith('.html') || file === '404.html') continue;
  const route = '/' + file.replaceAll('\\', '/').replace(/(?:^|\/)index\.html$/, '').replace(/\/$/, '');
  const response = await worker.fetch(new Request('https://example.test' + route));
  assert.equal(response.status, 200, route);
  const html = await response.text();
  assert.match(html, /<title>[^<]+<\/title>/, route);
  assert.match(html, /rel="canonical"/, route);
  count++;
}
assert.ok(count >= 30, 'Expected all website pages');
assert.equal((await worker.fetch(new Request('https://example.test/nonexistent-test-page'))).status, 404);
assert.equal((await worker.fetch(new Request('https://example.test/', { method: 'POST' }))).status, 405);
assert.equal(await (await worker.fetch(new Request('https://example.test/', { method: 'HEAD' }))).text(), '');
console.log(`Verified ${count} routes, metadata, custom 404, HEAD and method handling.`);

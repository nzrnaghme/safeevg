import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const root = fileURLToPath(new URL('../', import.meta.url));
const frontend = path.join(root, 'artifacts/safe-public-works');
const require = createRequire(path.join(frontend, 'package.json'));
const vite = path.join(path.dirname(require.resolve('vite/package.json')), 'bin/vite.js');
const result = spawnSync(process.execPath, [vite, 'build', '--config', 'vite.config.ts'], {
  cwd: frontend,
  env: { ...process.env, PORT: '3000', BASE_PATH: '/', NODE_ENV: 'production', VITE_STATIC_HOSTING: 'true' },
  stdio: 'inherit',
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
if (process.exitCode === 0) {
  const client = path.join(frontend, 'dist/public');
  const server = path.join(frontend, 'dist/wix-server');
  const pages = {};
  for (const file of fs.readdirSync(client, { recursive: true })) {
    if (!file.endsWith('.html')) continue;
    const route = '/' + file.replaceAll('\\', '/').replace(/(?:^|\/)index\.html$/, '').replace(/\/$/, '');
    pages[route] = fs.readFileSync(path.join(client, file), 'utf8');
  }
  fs.mkdirSync(server, { recursive: true });
  // Remove the obsolete generated entry from the initial deployment attempt.
  fs.rmSync(path.join(server, 'index.js'), { force: true });
  fs.writeFileSync(path.join(server, 'entry.mjs'), `const pages=${JSON.stringify(pages)};
export default { async fetch(request) {
 const url=new URL(request.url);
 const route=url.pathname.replace(/\\/$/, '') || '/';
 const html=pages[route];
 const headers={'Content-Type':'text/html; charset=utf-8','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'};
 if(!['GET','HEAD'].includes(request.method)) return new Response(null,{status:405,headers:{Allow:'GET, HEAD'}});
 if(!html) headers['X-Robots-Tag']='noindex, follow';
 return new Response(request.method==='HEAD'?null:(html || pages['/404.html']),{status:html?200:404,headers});
} };`);
}

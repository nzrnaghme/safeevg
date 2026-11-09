import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { validAdminCredentials } from '../lib/admin-credentials';
import { Router, type Request } from 'express';
import { pool } from '@workspace/db';

const router = Router();
const cookie = 'spw_admin_session';
const sessionSeconds = 8 * 60 * 60;
const loginWindow = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; expires: number }>();
const emptyContent = { text: {}, equipment: {} };
let tableReady: Promise<unknown> | undefined;

function ensureTable() {
  tableReady ??= pool.query(
    'CREATE TABLE IF NOT EXISTS spw_site_content (id integer PRIMARY KEY CHECK (id = 1), revision integer NOT NULL, content jsonb NOT NULL)',
  ).catch(error => {
    tableReady = undefined;
    throw error;
  });
  return tableReady;
}

function password() {
  const secret = process.env.SPW_ADMIN_PASSWORD;
  return secret && secret.length >= 16 ? secret : undefined;
}

function sign(value: string, secret: string) {
  return createHmac('sha256', secret).update('spw-admin-session:' + value).digest('hex');
}

function authenticated(request: Request) {
  const secret = password();
  const token = request.cookies?.[cookie];
  if (!secret || typeof token !== 'string') return false;
  const [expiry, nonce, signature, extra] = token.split('.');
  if (extra !== undefined || !/^\d{10}$/.test(expiry) || !/^[a-f0-9]{32}$/.test(nonce ?? '') || !/^[a-f0-9]{64}$/.test(signature ?? '')) return false;
  return Number(expiry) > Date.now() / 1000 && timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(sign(expiry + '.' + nonce, secret), 'hex'));
}

function limited(request: Request) {
  const now = Date.now();
  for (const [key, value] of attempts) if (value.expires <= now) attempts.delete(key);
  const key = request.ip ?? 'unknown';
  const current = attempts.get(key) ?? { count: 0, expires: now + loginWindow };
  if (current.count >= 8 || (!attempts.has(key) && attempts.size >= 10000)) return true;
  current.count += 1;
  attempts.set(key, current);
  return false;
}

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
function string(value: unknown, max: number): value is string {
  return typeof value === 'string' && value.length <= max;
}
function imagePath(value: unknown) {
  if (!string(value, 1500)) return false;
  if (/^\/(equipment-photos|charging-images)\/[a-z0-9-]+\.(webp|png|jpe?g)$/i.test(value)) return true;
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; } catch { return false; }
}
function validEquipment(value: unknown) {
  if (!record(value)) return false;
  const fields = ['brand', 'name', 'category', 'connector', 'power', 'uses', 'description', 'note', 'image', 'source', 'specs'];
  if (Object.keys(value).some(key => !fields.includes(key))) return false;
  for (const key of ['brand', 'name', 'category', 'connector', 'power', 'uses', 'description', 'note']) {
    if (key in value && (!string(value[key], 2000) || !value[key].trim())) return false;
  }
  if ('image' in value && !imagePath(value.image)) return false;
  if ('source' in value) {
    if (!string(value.source, 1500)) return false;
    try { const url = new URL(value.source); if (url.protocol !== 'https:' || url.username || url.password) return false; } catch { return false; }
  }
  return !('specs' in value) || (Array.isArray(value.specs) && value.specs.length <= 35 && value.specs.every(row => Array.isArray(row) && row.length === 2 && row.every(cell => string(cell, 600) && cell.trim())));
}
function validContent(value: unknown) {
  if (!record(value) || !record(value.text) || !record(value.equipment)) return false;
  const entries = Object.entries(value.text);
  const models = Object.entries(value.equipment);
  return Object.keys(value).length === 2 && entries.length <= 1500 && entries.every(([key, text]) => key.length <= 1400 && string(text, 3000)) &&
    models.length <= 100 && models.every(([key, model]) => /^[a-z0-9][a-z0-9-]{0,60}$/.test(key) && validEquipment(model));
}

router.get('/site-content', async (_request, response) => {
  response.set('Cache-Control', 'no-store');
  await ensureTable();
  const result = await pool.query('SELECT revision, content FROM spw_site_content WHERE id = 1');
  response.json(result.rows[0] ?? { revision: 0, content: emptyContent });
});

router.use('/admin', (_request, response, next) => {
  response.set('Cache-Control', 'no-store');
  next();
});
router.get('/admin/session', (request, response) => {
  response.json({ configured: Boolean(password()), authenticated: authenticated(request) });
});
router.post('/admin/session', (request, response) => {
  const secret = password();
  if (!secret) { response.status(503).json({ error: 'Admin sign-in is not configured. Contact the site administrator.' }); return; }
  if (!request.is('application/json') || !string(request.body?.password, 1024)) { response.sendStatus(400); return; }
  if (limited(request)) { response.status(429).json({ error: 'Too many attempts. Try again in 15 minutes.' }); return; }
  if (!validAdminCredentials(request.body?.email, request.body.password, secret)) { response.status(401).json({ error: 'Incorrect email or password.' }); return; }
  attempts.delete(request.ip ?? 'unknown');
  const token = Math.floor(Date.now() / 1000 + sessionSeconds) + '.' + randomBytes(16).toString('hex');
  response.cookie(cookie, token + '.' + sign(token, secret), { httpOnly: true, secure: true, sameSite: 'strict', maxAge: sessionSeconds * 1000, path: '/api/admin' });
  response.json({ authenticated: true });
});
router.delete('/admin/session', (_request, response) => {
  response.clearCookie(cookie, { httpOnly: true, secure: true, sameSite: 'strict', path: '/api/admin' });
  response.sendStatus(204);
});
router.put('/admin/content', async (request, response) => {
  if (!authenticated(request)) { response.status(401).json({ error: 'Sign in again to save changes.' }); return; }
  const { revision, content } = request.body ?? {};
  if (!request.is('application/json') || !Number.isSafeInteger(revision) || revision < 0 || revision > 2147483646 || !validContent(content)) {
    response.status(400).json({ error: 'Check the content fields and use HTTPS links for photos and sources.' }); return;
  }
  await ensureTable();
  const result = revision === 0
    ? await pool.query('INSERT INTO spw_site_content (id, revision, content) VALUES (1, 1, $1) ON CONFLICT DO NOTHING RETURNING revision', [JSON.stringify(content)])
    : await pool.query('UPDATE spw_site_content SET content = $1, revision = revision + 1 WHERE id = 1 AND revision = $2 RETURNING revision', [JSON.stringify(content), revision]);
  if (!result.rowCount) { response.status(409).json({ error: 'Another editor saved changes. Reload before editing again.' }); return; }
  response.json({ revision: result.rows[0].revision });
});

export default router;


import { createHash, timingSafeEqual } from 'node:crypto';

const adminEmail = 'info@safeevg.com';
const digest = (value: string) => createHash('sha256').update(value).digest();

export function validAdminCredentials(email: unknown, password: string, secret: string) {
  const passwordMatches = timingSafeEqual(digest(password), digest(secret));
  return typeof email === 'string' && email.length <= 254 &&
    email.trim().toLowerCase() === adminEmail && passwordMatches;
}

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validAdminCredentials } from './admin-credentials.ts';

const secret = 'test-only-password-not-for-production';
test('authorized email is case insensitive and trims whitespace', () => {
  for (const email of ['info@safeevg.com', 'Info@safeevg.com', ' INFO@SAFEEVG.COM ']) {
    assert.equal(validAdminCredentials(email, secret, secret), true);
  }
});
test('rejects other, missing and malformed email values even with correct password', () => {
  for (const email of ['other@safeevg.com', 'info@safeevg.com.attacker.test', '', undefined, null, {}, ['info@safeevg.com']]) {
    assert.equal(validAdminCredentials(email, secret, secret), false);
  }
});
test('authorized email still requires the correct password', () => {
  for (const password of ['', 'incorrect', secret.toUpperCase()]) {
    assert.equal(validAdminCredentials('info@safeevg.com', password, secret), false);
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {receiveWithdrawal} from '../tools/withdrawal/receive.mjs';

test('withdrawal preserves first receipt time through mail failure and retry', async () => {
  const input = {requestId: '12345678-1234-1234-1234-123456789abc', customer: 'Test Name', contract: 'Demo 123', email: 'test@example.invalid'};
  let saved, message;
  const store = {getOrCreate: async value => saved ??= value};
  const now = () => new Date('2026-11-03T12:00:00Z');
  assert.equal((await receiveWithdrawal(input, {store, now, deliver: async () => {throw Error('offline');}})).status, 503);
  const deps = {store, deliver: async value => {message = value;}};
  assert.deepEqual(await receiveWithdrawal(input, deps), {status: 200, body: {receivedAt: now().toISOString()}});
  assert.equal(message.idempotencyKey, input.requestId);
  assert.match(message.text, /Demo 123/);
  assert.match(message.text, /2026-11-03T12:00:00.000Z/);
  assert.equal((await receiveWithdrawal({...input, contract: 'Other'}, deps)).status, 409);
  assert.equal((await receiveWithdrawal({...input, email: 'bad'}, deps)).status, 400);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyUser, updateField, filterUsers, nextUserId, validateUser } from '../src/users.mjs';

test('search finds name and username without regard to case; blank shows all', () => {
  const users = [
    { id: 1, name: 'Leanne Graham', username: 'Bret' },
    { id: 3, name: 'Ervin Howell', username: 'Antonette' }
  ];
  assert.deepEqual(filterUsers(users, 'lEANne').map(u => u.id), [1]);
  assert.deepEqual(filterUsers(users, 'ANTON').map(u => u.id), [3]);
  assert.deepEqual(filterUsers(users, '  ').map(u => u.id), [1, 3]);
  assert.deepEqual(filterUsers(users, 'absent'), []);
});

test('editing street preserves city/suite and leaves the original nested object unchanged', () => {
  const before = { ...emptyUser(), name: 'An', address: { street: 'Old', suite: 'A', city: 'Hanoi' } };
  const after = updateField(before, 'street', 'New');
  assert.deepEqual(after.address, { street: 'New', suite: 'A', city: 'Hanoi' });
  assert.equal(before.address.street, 'Old');
  assert.notEqual(after.address, before.address);
  assert.equal(updateField(after, 'name', 'Binh').name, 'Binh');
  assert.equal(after.name, 'An');
});

test('new numeric ID is unique after removing a middle row', () => {
  assert.equal(nextUserId([{ id: 1 }, { id: 3 }]), 4);
  assert.equal(nextUserId([]), 1);
});

test('required names reject whitespace and optional email is validated', () => {
  assert.notEqual(validateUser({ ...emptyUser(), name: ' ', username: 'user' }), '');
  assert.notEqual(validateUser({ ...emptyUser(), name: 'An', username: ' ' }), '');
  assert.notEqual(validateUser({ ...emptyUser(), name: 'An', username: 'user', email: 'bad' }), '');
  assert.equal(validateUser({ ...emptyUser(), name: 'An', username: 'user' }), '');
  assert.equal(validateUser({ ...emptyUser(), name: 'An', username: 'user', email: 'an@example.com' }), '');
});

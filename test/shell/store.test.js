import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createStore } from '../../src/shell/store.js';

const add = (n, action) => n + action.by;

test('dispatch runs the update and tells the listener the new state and action', () => {
  const heard = [];
  const store = createStore(1, add, (state, action) => heard.push([state, action.by]));
  store.dispatch({ by: 2 });
  store.dispatch({ by: 3 });
  assert.deepEqual(heard, [[3, 2], [6, 3]]);
  assert.equal(store.state(), 6);
});

import test from 'node:test';
import assert from 'assert/strict';
import { gatherBundle } from '../scripts/generate-intent-bundle.mjs';

test('gatherBundle returns expected category headings and arrays', async () => {
  const bundle = await gatherBundle();

  // Expected headings (match headings used in generator)
  const expectedHeadings = [
    '### Devcontainer & Tasks',
    '### CI & ALN checks',
    '### Examples & Scripts',
    '### Identity & DID',
    '### ALN primitives & tests'
  ];

  for (const h of expectedHeadings) {
    assert.ok(Object.prototype.hasOwnProperty.call(bundle, h), `Missing heading: ${h}`);
    const entry = bundle[h];
    assert.ok(entry && Array.isArray(entry.files), `Entry for ${h} must have a files array`);
  }
});
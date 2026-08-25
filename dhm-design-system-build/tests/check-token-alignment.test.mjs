import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fixture = resolve(root, 'tests/fixtures/aligned');
const result = spawnSync(process.execPath, [
  resolve(root, 'scripts/check-token-alignment.mjs'),
  resolve(fixture, 'typography.css'),
  resolve(fixture, 'manifest.json'),
  resolve(fixture, 'src'),
  resolve(fixture, 'component-contract.json'),
], { encoding: 'utf8' });

assert.equal(result.status, 0, result.stderr);

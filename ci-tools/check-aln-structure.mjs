#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';

const ROOT = path.resolve(process.cwd());
const SEARCH_DIRS = [path.join(ROOT, '..', 'core'), path.join(ROOT, '..', 'adapters')];

async function findAlnFiles(dir) {
  const res = [];
  async function walk(d) {
    const entries = await fs.readdir(d, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) {
        await walk(p);
      } else if (e.isFile() && p.endsWith('.aln')) {
        res.push(p);
      }
    }
  }
  for (const d of SEARCH_DIRS) {
    try { await walk(d); } catch (e) { /* ignore missing dirs */ }
  }
  return res;
}

function firstNonBlankLine(content) {
  const lines = content.split(/\r?\n/);
  for (const l of lines) {
    if (l.trim() !== '') return l.trim();
  }
  return '';
}

async function main() {
  const files = await findAlnFiles(process.cwd());
  let failed = 0;
  const failures = [];

  for (const f of files) {
    const stat = await fs.stat(f);
    if (stat.size === 0) {
      failures.push({ file: f, reason: 'empty file' });
      failed++;
      continue;
    }
    const content = await fs.readFile(f, 'utf8');
    const first = firstNonBlankLine(content);
    // Require header containing 'aln' and a semantic version (e.g., 1.0.0)
    const hasAln = /\baln\b/i.test(first);
    const hasVersion = /\d+\.\d+\.\d+/.test(first);
    if (!hasAln || !hasVersion) {
      failures.push({ file: f, reason: 'missing aln header with semver in first non-blank line', line: first });
      failed++;
      continue;
    }

    // forbidden patterns
    const forbidden = ['os.system', 'subprocess.', 'curl ', 'wget ', 'Invoke-WebRequest'];
    for (const p of forbidden) {
      if (content.includes(p)) {
        failures.push({ file: f, reason: `forbidden pattern found: ${p}` });
        failed++;
        break;
      }
    }
  }

  // Also run routing consistency test
  let routingFailed = 0;
  try {
    const { main: routingMain } = await import('../tests/idechat-routing-consistency.mjs');
    await routingMain();
  } catch (e) {
    routingFailed = 1;
    failures.push({ file: 'tests/idechat-routing-consistency.mjs', reason: 'routing test failed', error: String(e) });
  }

  // Validate DID document structure if present
  try {
    const didPath = path.join(process.cwd(), 'identity', 'idechat.did.json');
    const didRaw = await fs.readFile(didPath, 'utf8');
    const did = JSON.parse(didRaw);
    if (!did.id || !did.verificationMethod || !did.authentication) {
      failures.push({ file: didPath, reason: 'DID document missing required fields (id, verificationMethod, authentication)' });
      failed++;
    } else {
      console.log(`DID identity validated: ${did.id}`);
    }
  } catch (e) {
    // If file missing, treat as failure
    failures.push({ file: 'identity/idechat.did.json', reason: `DID validation failed: ${e.message}` });
    failed++;
  }

  console.log(`Scanned ${files.length} .aln files.`);
  if (failed === 0 && routingFailed === 0) {
    console.log('All ALN structure checks passed.');
    process.exit(0);
  }

  console.error('Failures:');
  for (const f of failures) {
    console.error(` - ${f.file}: ${f.reason}${f.line ? ` (first line: ${f.line})` : ''}${f.error ? `\n   error: ${f.error}` : ''}`);
  }
  process.exit(2);
}

main().catch(e => { console.error(e); process.exit(3); });
#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';

const root = path.resolve(process.cwd());
const argv = process.argv.slice(2);
const logPath = argv[0] || null;
const apply = argv.includes('--apply');

function suggestPatchesFromLog(log) {
  const suggestions = [];
  if (/Missing ALN header/.test(log) || /missing aln header/i.test(log)) {
    suggestions.push({ id: 'add-aln-header', desc: 'Insert `// aln 1.0.0` into ALN files missing header' });
  }
  if (/DID document missing required fields/i.test(log) || /DID validation failed/i.test(log)) {
    suggestions.push({ id: 'fix-did', desc: 'Ensure `identity/idechat.did.json` includes id, verificationMethod, authentication' });
  }
  if (/npm ERR!/i.test(log) || /could not resolve/i.test(log)) {
    suggestions.push({ id: 'install-deps', desc: 'Run `npm --prefix ci-tools install` or inspect package.json in ci-tools' });
  }
  return suggestions;
}

async function applyPatch(patchId) {
  if (patchId === 'add-aln-header') {
    // Find .aln files missing header and add header
    const walk = async (d) => {
      const entries = await fs.readdir(d, { withFileTypes: true });
      for (const e of entries) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) await walk(p);
        else if (e.isFile() && p.endsWith('.aln')) {
          const content = await fs.readFile(p, 'utf8');
          const first = content.split(/\r?\n/).find(l => l.trim() !== '') || '';
          if (!/\baln\b/i.test(first)) {
            await fs.writeFile(p, `// aln 1.0.0\n${content}`);
            console.log(`Patched header into ${p}`);
          }
        }
      }
    };
    await walk(path.join(root, 'core'));
    await walk(path.join(root, 'adapters'));
  }
  if (patchId === 'fix-did') {
    const didPath = path.join(root, 'identity', 'idechat.did.json');
    try {
      const raw = await fs.readFile(didPath, 'utf8');
      const doc = JSON.parse(raw);
      let changed = false;
      if (!doc.id) { doc.id = 'did:ion:EiD8J2b3K8k9Q8x9L7m2n4p1q5r6s7t8u9v0w1x2y3z4A5B6C7D8E9F0'; changed = true; }
      if (!doc.verificationMethod) { doc.verificationMethod = []; changed = true; }
      if (!doc.authentication) { doc.authentication = []; changed = true; }
      if (changed) {
        await fs.writeFile(didPath, JSON.stringify(doc, null, 2));
        console.log(`Patched DID fields in ${didPath}`);
      }
    } catch (e) {
      console.error('Failed to patch DID:', e.message);
    }
  }
}

async function main() {
  if (!logPath) {
    console.log('Usage: node pr-auto-repair.mjs <path-to-log> [--apply]');
    process.exit(2);
  }

  try {
    const log = await fs.readFile(path.resolve(logPath), 'utf8');
    const suggestions = suggestPatchesFromLog(log);
    if (suggestions.length === 0) {
      console.log('No automatic suggestions found for given log.');
      process.exit(0);
    }

    console.log('Suggested patches:');
    suggestions.forEach(s => console.log(` - ${s.id}: ${s.desc}`));

    if (apply) {
      for (const s of suggestions) {
        console.log(`Applying patch ${s.id}...`);
        await applyPatch(s.id);
      }
      console.log('Applied patches. Re-run `make ci` to verify.');
    } else {
      console.log('Run with --apply to apply suggested patches (use with caution).');
    }

  } catch (e) {
    console.error('Failed to read log file:', e.message);
    process.exit(3);
  }
}

main().catch(e => { console.error(e); process.exit(4); });
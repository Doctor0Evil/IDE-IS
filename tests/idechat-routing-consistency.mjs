#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';

export async function main() {
  const root = path.resolve(process.cwd());
  const coreFiles = [path.join(root, 'core', 'orchestrator.aln'), path.join(root, 'core', 'routing.aln')];
  const adapterDir = path.join(root, 'adapters');

  let referenced = new Set();
  let declared = new Set();

  for (const cf of coreFiles) {
    try {
      const content = await fs.readFile(cf, 'utf8');
      // crude regex to find '"github.clone"' or 'github.createPR' or 'shell.run'
      const re = /"([a-zA-Z0-9_.-]+)"/g;
      let m;
      while ((m = re.exec(content)) !== null) {
        const token = m[1];
        if (token.startsWith('github.') || token.startsWith('shell.')) {
          referenced.add(token);
        }
      }
    } catch (e) {
      throw new Error(`Failed to read core file ${cf}: ${e}`);
    }
  }

  // scan adapters directory for files like github-cli.aln -> github-cli
  try {
    const entries = await fs.readdir(adapterDir, { withFileTypes: true });
    for (const e of entries) {
      if (e.isFile() && e.name.endsWith('.aln')) {
        const name = e.name.replace(/\.aln$/, '');
        declared.add(name);
      }
    }
  } catch (e) {
    throw new Error(`Failed to read adapters dir: ${e}`);
  }

  // Map referenced tokens to adapter names
  const missing = [];
  for (const r of referenced) {
    if (r.startsWith('github.')) {
      if (!declared.has('github-cli')) missing.push(r + ' -> github-cli');
    }
    if (r.startsWith('shell.')) {
      if (!declared.has('local-shell')) missing.push(r + ' -> local-shell');
    }
  }

  console.log(`Referenced tool tokens: ${Array.from(referenced).join(', ')}`);
  console.log(`Declared adapters: ${Array.from(declared).join(', ')}`);

  if (missing.length > 0) {
    console.error('Missing adapter implementations for:');
    for (const m of missing) console.error(' - ' + m);
    process.exit(2);
  }

  // warn if declared but not referenced
  const unused = [];
  for (const d of declared) {
    if (!Array.from(referenced).some(r => r.includes(d.split('-')[0]))) unused.push(d);
  }
  if (unused.length > 0) {
    console.warn('Warning: adapters declared but not referenced: ' + unused.join(', '));
  }

  console.log('Routing consistency checks passed.');
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('idechat-routing-consistency.mjs')) {
  main().catch(e => { console.error(e); process.exit(3); });
}
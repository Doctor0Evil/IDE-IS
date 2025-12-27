#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';

const ROOT = path.resolve(process.cwd());

const categories = [
  {
    id: 'devcontainer',
    heading: '### Devcontainer & Tasks',
    description: 'Standardize development environment and common tasks for reproducible runs.',
    paths: ['.devcontainer', '.vscode/tasks.json', 'Makefile']
  },
  {
    id: 'ci',
    heading: '### CI & ALN checks',
    description: 'Ensure PRs run deterministic static checks and DID validation.',
    paths: ['.github/workflows/idechat-ci.yml', 'ci-tools/check-aln-structure.mjs']
  },
  {
    id: 'examples',
    heading: '### Examples & Scripts',
    description: 'Provide runnable, privacy-safe examples and validation wrappers.',
    paths: ['examples/minimal-config/idechat.config.json', 'examples/scripts/run-config-validation.sh', 'examples/run-config-validation.sh']
  },
  {
    id: 'identity',
    heading: '### Identity & DID',
    description: 'Supply a public DID document template and schema for local identity references.',
    paths: ['identity/idechat.did.json', 'identity/config.schema.json']
  },
  {
    id: 'aln',
    heading: '### ALN primitives & tests',
    description: 'Define high-level ALN orchestration primitives and ensure presence via sanity tests.',
    paths: ['core/orchestrator_primitives.aln', 'tests/aln_functions_sanity.mjs']
  }
];

async function checkPath(p) {
  const target = path.join(ROOT, p);
  try {
    const st = await fs.stat(target);
    if (st.isDirectory()) {
      // list files in directory (non-recursive)
      const names = await fs.readdir(target);
      return names.map(n => path.join(p, n));
    }
    return [p];
  } catch (e) {
    return [];
  }
}

export async function gatherBundle() {
  const result = {};
  for (const cat of categories) {
    result[cat.heading] = { files: [], description: cat.description };
    for (const p of cat.paths) {
      const found = await checkPath(p);
      for (const f of found) result[cat.heading].files.push(f);
    }
  }
  return result;
}

export function makeMarkdown(bundle) {
  const lines = [];
  lines.push('## Intent bundle');
  lines.push('This intent bundle summarizes what changed, why, and the impact scope for this PR.');
  lines.push('');

  for (const [heading, data] of Object.entries(bundle)) {
    lines.push(heading);
    if (!data.files || data.files.length === 0) {
      lines.push('- No files detected');
    } else {
      lines.push('- Files:');
      for (const f of data.files) {
        lines.push(`  - \\`${f}\\``);
      }
    }
    lines.push('- ' + data.description);
    lines.push('');
  }

  return lines.join('\n');
}

export async function main() {
  const b = await gatherBundle();
  const md = makeMarkdown(b);
  console.log(md);
}

const invokedAsScript = process.argv[1] && (process.argv[1].endsWith('generate-intent-bundle.mjs') || process.argv[1].endsWith('generate-intent-bundle'));
if (invokedAsScript) {
  main().catch(e => { console.error(e); process.exit(1); });
}

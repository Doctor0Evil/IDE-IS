#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';

async function main() {
  const file = path.join(process.cwd(), 'core', 'orchestrator_primitives.aln');
  try {
    const content = await fs.readFile(file, 'utf8');
    const required = ['declarativeToolchain', 'unifiedResolve', 'reproducibleInstallPlan', 'remoteTaskRunner', 'immutableDevContainerProfile', 'languageBridge', 'policyBoundPipeline', 'secureBundle', 'toolUsageLedger', 'dependencyFreeVerification'];
    // Also ensure orchestrator_primitives.aln has a module header
    if (!content.includes('// aln')) {
      console.error('Missing ALN header in orchestrator_primitives.aln');
      process.exit(2);
    }
    const missing = required.filter(fn => !content.includes(fn));
    if (missing.length > 0) {
      console.error('Missing expected functions in orchestrator_primitives.aln:', missing.join(', '));
      process.exit(2);
    }
    console.log('ALN functions sanity check passed.');
  } catch (e) {
    console.error('Failed to read orchestrator_primitives.aln:', e);
    process.exit(3);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(e => { console.error(e); process.exit(4); });
}

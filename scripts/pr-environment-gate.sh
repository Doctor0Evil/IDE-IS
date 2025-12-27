#!/usr/bin/env sh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CI_TOOLS="$ROOT_DIR/ci-tools"

echo "Running PR environment gate..."

# Ensure ci-tools deps installed
if [ ! -d "$CI_TOOLS/node_modules" ]; then
  echo "Installing ci-tools dependencies..."
  npm --prefix "$CI_TOOLS" install
fi

# Run main CI
echo "Running make ci"
if ! make ci; then
  echo "ERROR: make ci failed. Check output above for details."
  exit 2
fi

# Run ALN primitives sanity explicitly
echo "Running ALN primitives sanity"
if ! node tests/aln_functions_sanity.mjs; then
  echo "ERROR: ALN primitives sanity failed. Check tests/aln_functions_sanity.mjs output."
  exit 3
fi

echo "PR environment gate PASSED. You can open or update a PR from this branch."
exit 0
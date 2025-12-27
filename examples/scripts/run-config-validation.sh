#!/usr/bin/env sh
# POSIX-compatible config validation script
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

if ! command -v ajv >/dev/null 2>&1; then
  echo "ajv-cli is required. Install: npm i -g ajv-cli (or use ci-tools)
"
  exit 2
fi

ajv validate -s "$ROOT_DIR/idechat.config.schema.json" -d "$ROOT_DIR/idechat.config.json"

echo "Config validation passed."
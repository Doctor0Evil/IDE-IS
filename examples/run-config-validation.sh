#!/usr/bin/env sh
set -euo pipefail

# wrapper to call examples/scripts/run-config-validation.sh
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
sh "$SCRIPT_DIR/scripts/run-config-validation.sh"
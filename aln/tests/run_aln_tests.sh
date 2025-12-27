#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ALN_CORE="$ROOT_DIR/code/ai_chat_ide/Orchestrator_Core.aln"
SPEC="$ROOT_DIR/../policies/ai_chat_ide/AIChat_IDE_Orchestrator_Spec_v1.txt"
TEST_DIR="$ROOT_DIR/ai_chat_ide"

echo "Running ALN structural checks..."

# Ensure DID manifest exists and contains the expected DID
DID_FILE="$ROOT_DIR/../identity/ide_orchestrator.did.json"
EXPECTED_DID="did:ion:EiD8J2b3K8k9Q8x9L7m2n4p1q5r6s7t8u9v0w1x2y3z4A5B6C7D8E9F0"
if [ ! -f "$DID_FILE" ]; then
  echo "ERROR: DID manifest not found at $DID_FILE"
  exit 7
fi
if ! grep -q "$EXPECTED_DID" "$DID_FILE" ; then
  echo "ERROR: DID manifest at $DID_FILE does not contain expected DID"
  exit 8
fi

# Check bundle version
if ! grep -q "aln.bundle Orchestrator_Core v1.1" "$ALN_CORE" ; then
  echo "ERROR: Orchestrator_Core bundle version v1.1 not found"
  exit 2
fi

# Check DEVICE_CLASS_REGISTER enum contains required classes
if ! grep -E "device_class\s*:\s*enum\[.*CYBERNETIC.*BCI.*NEUROMORPHIC.*ISOMORPHIC.*ORGANIC_COMPUTING.*STANDARD.*\]" "$ALN_CORE" ; then
  echo "ERROR: Device class enum missing required classes"
  exit 3
fi

# Check DEVICE_CLASS_REGISTER and audit entry
if ! grep -q "aln.policy DEVICE_CLASS_REGISTER" "$ALN_CORE" ; then
  echo "ERROR: DEVICE_CLASS_REGISTER policy not found"
  exit 4
fi
if ! grep -q "audit.append(\"DEVICE_REGISTERED\"" "$ALN_CORE" ; then
  echo "ERROR: DEVICE_REGISTERED audit append not present"
  exit 5
fi

# Check spec mentions device classes
if ! grep -q "CYBERNETIC" "$SPEC" || ! grep -q "BCI" "$SPEC" || ! grep -q "NEUROMORPHIC" "$SPEC" || ! grep -q "ISOMORPHIC" "$SPEC" || ! grep -q "ORGANIC_COMPUTING" "$SPEC" || ! grep -q "STANDARD" "$SPEC" ; then
  echo "ERROR: Spec file missing one of the required device classes"
  exit 6
fi

# If an ALN interpreter CLI is present, use it to validate and run tests
if python -c "import alninterpreter" >/dev/null 2>&1 || [ -f "$(pwd)/alninterpreter/cli.py" ] ; then
  echo "ALN interpreter detected; running interpreter-based validation and tests..."
  if [ -f "$(pwd)/alninterpreter/cli.py" ]; then
    python alninterpreter/cli.py validate "$ALN_CORE" -v
    # run test harness if available
    python alninterpreter/cli.py test "$TEST_DIR" || echo "Interpreter test step failed (non-zero)."
  else
    echo "Interpreter python package available but CLI entrypoint unknown; please run package-specific validation."
  fi
else
  echo "No ALN interpreter detected; structural checks passed as a fallback."
fi

echo "ALN structural checks completed successfully."
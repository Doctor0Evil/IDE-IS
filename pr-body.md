This PR adds a production-ready IDE‑Chat baseline and CI harness focused on safe, vendor‑neutral AI chat orchestration.

What’s included
- ALN core modules:
  - `core/orchestrator.aln`, `core/safety.aln`, `core/routing.aln`, `core/neuro_safety.aln`
- Adapters:
  - `adapters/github-cli.aln`, `adapters/local-shell.aln`
- Config:
  - `idechat.config.schema.json`, `idechat.config.example.json`
- Examples:
  - `examples/minimal-config/idechat.config.json`, `examples/scripts/run-config-validation.sh`
- Identity & DID:
  - `identity/idechat.did.json`, `identity/config.schema.json`, `identity/README.md`
- Docs:
  - `README.md`, `docs/SECURITY.md`, `docs/ARCHITECTURE.md`
- CI & test harness:
  - `.github/workflows/idechat-ci.yml`, `ci-tools/check-aln-structure.mjs`, `ci-tools/package.json`, `tests/idechat-routing-consistency.mjs`

Safety posture
- No embedded secrets or API keys in the repo.
- Neuro / BCI / implant targets denied by default, gated by `core/neuro_safety.aln`.
- ALN static checks forbid obvious unsafe patterns and require a standard ALN header.

Manual verification steps for reviewers
1. Install Node 18+.
2. npm --prefix ci-tools install
3. npm test
4. npm --prefix ci-tools run validate-config

Notes
- All checks and tests are static text-only analyses (no ALN interpreter required).
- CI is self-contained aside from installing `ajv-cli` as a dev dependency in `ci-tools/`.

## Intent bundle
This intent bundle summarizes what changed, why, and the impact scope for this PR.

### Devcontainer & Tasks
- Files:
  - `.devcontainer/*`
  - `.vscode/tasks.json`
  - `Makefile`
- Why: standardize development environment and common tasks for reproducible runs.
- Impact: Local development env + Codespaces; affects all contributors.

### CI & ALN checks
- Files:
  - `.github/workflows/idechat-ci.yml`
  - `ci-tools/check-aln-structure.mjs`
- Why: ensure PRs run deterministic static checks and DID validation.
- Impact: Affects PR validation and merge gating (ALN/CI checks).

### Examples & Scripts
- Files:
  - `examples/minimal-config/idechat.config.json`
  - `examples/scripts/run-config-validation.sh`
  - `examples/run-config-validation.sh`
- Why: provide runnable, privacy-safe examples and validation wrappers.
- Impact: Consumers and reviewers can validate configs locally.

### Identity & DID
- Files:
  - `identity/idechat.did.json`
  - `identity/config.schema.json`
- Why: supply a public DID document template and schema for local identity references.
- Impact: All PRs touching identity / DID will be subject to additional checks.

### ALN primitives & tests
- Files:
  - `core/orchestrator_primitives.aln`
  - `tests/aln_functions_sanity.mjs`
- Why: define high-level ALN orchestration primitives and ensure presence via sanity tests.
- Impact: Affects any code that relies on ALN primitives; ensures forward compatibility.

---

### DID / Web5 auth model (roadmap)
We include a sample DID document at `identity/idechat.did.json` and a schema for local key references. Future iterations will migrate authentication and short‑lived capabilities from PATs/GitHub Secrets to a DID/Web5 model, implementing features such as:

- `didSession.autoAuthForPR` — short-lived, DID-backed PR delegation tokens bound to repo, scope, and environment.
- `didSecrets.serviceCapability` & `didSecrets.zeroTrustRunner` — use verifiable capabilities and ephemeral runner auth instead of stored secrets.
- `didPolicy.neuroAndDataGuard` — policy evaluation based on verifiable credentials for neuro/BCI and sensitive data paths.

These changes are planned and documented; this PR seeds the DID files and validation hooks (DID structural checks in CI) but does not yet replace any GitHub authentication flows.

# ALN High-level Primitives for IDE-Chat

This document summarizes the 10 high-level ALN primitives implemented as skeletons in `core/orchestrator_primitives.aln`.
They are deliberately declarative and backend-implemented; these functions let agent chats request complex operations without needing local tooling (npm/git/python) while preserving auditability and policy enforcement.

1. env.declarativeToolchain(manifest)
- Input: ALN/JSON manifest describing languages, compilers, and CLI versions.
- Output: a `ToolchainSpec` used by remote runners or immutable profiles.

2. pkg.unifiedResolve(deps)
- Resolves cross-language dependencies to a locked set with integrity and license metadata.

3. pkg.reproducibleInstallPlan(lockedSet)
- Produces an install plan with exact artifact URLs, expected layout, and safety checks.

4. runtime.remoteTaskRunner(envProfile, taskSpec)
- Executes tasks (build/test) in remote, policy-compliant environments and returns `TaskResult`.

5. workspace.immutableDevContainerProfile(profileSpec)
- Emits an immutable environment profile that any host can realize (container, cloud runner).

6. codegen.languageBridge(intent, lang)
- Maps high-level intents into language-specific commands (build/test/lint) using a registry.

7. ci.policyBoundPipeline(pipelineSpec)
- Defines CI pipelines as policy-bound ALN workflows (SCA, SBOM, secrets scan stages included).

8. artifact.secureBundle(artifacts, meta)
- Produces a portable artifact capsule including source hashes, lockfiles, and test evidence.

9. audit.toolUsageLedger(event)
- Emits structured ledger entries for resolution, build, test, and deploy actions.

10. orchestrator.dependencyFreeVerification(projectSpec)
- Orchestrates end-to-end verification: resolves toolchain, installs reproducibly, runs checks, and returns a verification report.

Usage notes
- These primitives are *backend contracts* — they are intentionally abstract and unbound from any single executor.
- Implementations should enforce robust logging, policy evaluation, and cryptographic integrity of artifacts and plans.

Validation & CI
- The ALN primitives are validated by `tests/aln_functions_sanity.mjs` which checks for the presence of each declared function in `core/orchestrator_primitives.aln`.
- The CI workflow (`.github/workflows/idechat-ci.yml`) runs this sanity script on every PR to ensure consistency across changes.

Design rationale
- Reduce reliance on local toolchains by shifting to declarative specs executed in controlled runners.
- Provide richer auditability (who, why, what policies applied) than raw CLI histories or ad-hoc developer workflows.

Mapping to workflows
- `env.declarativeToolchain` → maps to immutable devcontainer profiles or remote toolchain provisioning.
- `pkg.unifiedResolve` / `pkg.reproducibleInstallPlan` → maps to dependency resolution and reproducible installs for any backend.
- `runtime.remoteTaskRunner` → maps to remote build/test execution in isolated runners and streaming logs back to chat.
- `orchestrator.dependencyFreeVerification` → end-to-end verification entrypoint that composes the above primitives.

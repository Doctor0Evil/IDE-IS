# IDE-Chat
IDE-Chat is a cross-system orchestrator that lets **any** AI chat front-end (or multi-agent stack) coordinate GitHub, local build tools, and cloud CI from a single, declarative configuration – no proprietary connectors or closed secrets baked into the repo.

> Rule #1: IDE-Chat is a functional, AI-assisted codespace with more advanced features than any other platform – but all power is exposed through *user-owned* tools and configs, never hard-coded keys or privileged internal functions.

## Goals

- Cross-chat orchestration for any LLM / agent that can read a repo and run tools.
- GitHub-first workflows (clone, branch, PR, CI) via the user’s own credentials and CLI.
- “Repo-for-dummies” UX: AI agents follow a simple ALN command contract.
- Strict ethical & safety layer for code, data, and neuro/cyber-physical systems.

## How it works

- A JSON config (`idechat.config.json`) defines project root, git defaults, and safety switches.
- An ALN core maps high-level prompts into `ToolInvocation` objects.
- Adapters call user-installed tools (`git`, `gh`, shell) instead of embedding any secrets.
- Safety modules block dangerous, kernel-level, or BCI/implant interactions by default.

### ALN high-level primitives

IDE-Chat exposes a collection of declarative ALN primitives that let chats request complex operations without requiring local toolchains. See `docs/ALN_FUNCTIONS.md` for details. Examples include:

- `env.declarativeToolchain(manifest)` — declare needed compilers/tools as a manifest.
- `pkg.unifiedResolve(deps)` / `pkg.reproducibleInstallPlan` — language-agnostic dependency resolution and install plans.
- `runtime.remoteTaskRunner(envProfile, taskSpec)` — run builds/tests in a policy-compliant remote runner.
- `orchestrator.dependencyFreeVerification(projectSpec)` — end-to-end verification without local installs.

These primitives make IDE-Chat usable in low-trust environments and enable reproducible, auditable operations.

## Devcontainer

- Open this repository in VS Code and choose **Remote-Containers: Reopen in Container** to use the standardized dev environment.
- The devcontainer installs Node 18 and runs `npm install` and `npm --prefix ci-tools install` on creation so `npm test` and `make ci` work inside the container.

## Local CI (one-command)

- Run `make test` or `make ci` to execute the static checks (ALN structure, routing consistency, config validation, and ALN function sanity).

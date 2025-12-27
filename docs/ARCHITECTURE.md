# IDE-Chat Architecture

IDE-Chat is intentionally minimal and modular:

- core/: ALN-modules implementing the orchestrator, safety gate, routing, and neuro-safety policy.
- adapters/: Reference adapters showing how to call user-installed tools (`gh`, `git`, shell).
- docs/: Security and architecture notes.
- Configuration: `idechat.config.schema.json` and `idechat.config.example.json` describe the public configuration contract.

Design principles:
- No embedded secrets or provider-specific services in core modules.
- Safety-first defaults (neuro/cybernetic access denied by default).
- User-owned adapters are the only code that interacts with external CLIs and credentials.

Suggested next steps:
- Add example integrations and CI validations for the ALN modules.
- Add an examples/ directory with a sample `idechat.config.json` and an example runtime that wires the ALN functions to real shell invocations.
# Security Policy

## Supported versions

Security updates apply to the latest `main` branch of IDE-Chat.

## Runtime posture

- All network and telecom actions must:
  - Flow through OS-level firewalls and TLS-only endpoints.
  - Be initiated via user-controlled CLIs (`curl`, `gh`, `ssh`, etc.).
  - Log commands and exit codes to a local audit log (for example `logs/idechat-audit.log`).

- IDE-Chat core:
  - MUST NOT open raw sockets, inject packets, or install kernel drivers.
  - MUST NOT embed API keys, OAuth tokens, or user IDs in source or examples.
  - MUST treat BCI / biomedical / telecom device control as **disabled by default** and gate any future support behind `NeuroSafetyPolicy`.

Identity & DID

- Use the `identity/` directory to publish a public DID document and schema for local key references.
- Example DID documents (public only) may be stored in `identity/` but **private keys must never be checked in**; refer to them via OS keychain labels or HSM slots configured per environment.
- CI and automation tools should resolve the DID and use environment-specific key stores; do not bake secrets into repo files.

## Reporting a vulnerability

Please open a private issue or contact the maintainer via GitHub security channels with:

- Description of the vulnerability.
- Steps to reproduce.
- Potential impact.
- Proposed or attempted mitigations.

You will receive:

- Initial acknowledgement within 72 hours.
- A coordinated disclosure timeline once impact is confirmed.

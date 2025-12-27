# Identity & DID for IDE-Chat

This directory holds a public DID document and the schema for local identity configuration used by runtime components.

Key points
- Use a Web5/DID (example: `did:ion:EiD8J2b3K8k9Q8x9L7m2n4p1q5r6s7t8u9v0w1x2y3z4A5B6C7D8E9F0`) as a public identifier for automation and CI bots.
- Do **not** store private keys or tokens in this repository. Local key stores or OS keychains should hold secrets and raw keys.
- `identity/local-keys.json` MUST be git-ignored and used only for runtime references to OS keychain labels or hardware token slots.

Runtime guidance
- CI and runtime components should resolve the DID document and use environment-specific key providers (e.g., OS keychain, managed HSM) rather than static secrets.
- The DID document in this directory is a public-facing sample and contains no private material.
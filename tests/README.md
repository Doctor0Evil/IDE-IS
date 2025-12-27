# IDE-Chat Tests (Static Checks Only)

These tests are static and do not execute ALN modules. They check consistency and structural expectations, such as:

- Adapters referenced by `core/orchestrator.aln` or `core/routing.aln` exist in `adapters/`.
- ALN files have required header lines and do not contain forbidden substrings.

Run locally:

```
node tests/idechat-routing-consistency.mjs
```

CI runs these as part of the `idechat-ci.yml` workflow.
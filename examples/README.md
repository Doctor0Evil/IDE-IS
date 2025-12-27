# IDE-Chat Examples

This directory contains minimal example configurations and scripts to help you get started.

## minimal-config

- `idechat.config.json` — a privacy-safe example that enables only the `local-shell` adapter and a strict shell command allowlist.
- `scripts/run-config-validation.sh` — POSIX-compatible script that validates `idechat.config.json` against the schema using `ajv`.

## Usage

1. Copy `examples/minimal-config/idechat.config.json` to your workspace and adapt `projectRoot` and `shellAllowList`.
2. Run `examples/scripts/run-config-validation.sh` to validate the config (requires `ajv-cli` installed globally or in `ci-tools`).

This example is intended to demonstrate how to wire IDE-Chat safely into a local workspace: it disables arbitrary network access and limits shell operations to a tight allowlist.
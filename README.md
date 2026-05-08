# software-factory

A lean, composable software factory CLI.

## Install

Prerequisites:
- Bun
- Git

Install the CLI globally from a package tarball or published package path:

```bash
npm install -g software-factory
```

The operator-facing binary is:

```bash
sf
```

## First-time setup in a repo

```bash
sf init
sf doctor
```

`sf doctor` verifies readiness and explains what to fix if something is missing.

## Core workflow

```bash
sf shape "build an idea"
sf plan <shape-run-id>
sf prototype <plan-run-id> --variants 3
sf review <prototype-run-id>
sf qa <prototype-run-id> --candidate candidate-1
sf retro <prototype-run-id>
```

## V1 model

- one orchestrator
- many isolated workers
- many isolated reviewers
- worktree-first local isolation
- artifact-first handoff
- human winner selection

## Local development

```bash
bun install
./scripts/init
./scripts/doctor
./scripts/check
```

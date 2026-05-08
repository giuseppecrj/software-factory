# Software Factory Agent Guide

Start here when operating in this repo.

## What this repo is

`software-factory` is a lean, composable software factory for shaping ideas, generating parallel prototype variants, reviewing them independently, and selecting a winner through explicit artifacts.

## Command model

### Bootstrap commands
- `sf init` — scaffold repo-local factory state
- `sf doctor` — validate readiness and explain recovery steps

### Workflow commands
- `sf shape`
- `sf plan`
- `sf prototype`
- `sf review`
- `sf qa`
- `sf retro`

## Read order

1. `AGENTS.md` — operator map
2. `ETHOS.md` — core product and engineering principles
3. `ROUTING.md` — which files each command loads
4. `DESIGN.md` — UX/output taste
5. `docs/architecture/overview.md` — system shape
6. `docs/architecture/operator-flow.md` — first-time and day-to-day usage flow

## Repo map

- `factory/workflows/` — stage-by-stage workflow files
- `factory/skills/` — reusable process instructions
- `factory/templates/` — output contracts
- `scripts/` — deterministic checks and helpers
- `runs/` — run-scoped artifacts and receipts
- `docs/architecture/` — architecture and operator flow
- `docs/runbooks/` — failure recovery and merge procedures
- `src/` — thin CLI/harness implementation

## V1 guardrails

- One orchestrator, many isolated workers, many isolated reviewers.
- Prefer git worktrees for V1 local isolation.
- Do not implement peer-to-peer swarm coordination.
- Keep workflow opinion in files, not in a fat runtime core.
- Every stage must leave durable artifacts.

## Verification

Use:
- `./scripts/check`
- `./scripts/test`
- `./scripts/qa`
- `sf doctor`

If those are broken, fix the substrate before building more orchestration.

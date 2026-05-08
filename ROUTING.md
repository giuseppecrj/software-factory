# Routing

## Bootstrap

### `sf init`
Load:
- `AGENTS.md`
- `ETHOS.md`
- `docs/architecture/overview.md`
- `docs/architecture/operator-flow.md`

Output:
- repo-local factory directories and config stubs

### `sf doctor`
Load:
- `AGENTS.md`
- `ETHOS.md`
- `docs/runbooks/recover-stuck-run.md`

Output:
- readiness report
- missing prerequisites
- recovery guidance

## Workflow

### `sf shape`
Load:
- `ETHOS.md`
- `DESIGN.md`
- `factory/workflows/shape.md`
- `factory/templates/shape.md`

### `sf plan`
Load:
- `ETHOS.md`
- `factory/workflows/plan.md`
- `factory/templates/implementation-plan.md`

### `sf prototype`
Load:
- `ETHOS.md`
- `factory/workflows/prototype.md`
- `factory/templates/prototype-brief.md`

### `sf review`
Load:
- `ETHOS.md`
- `factory/workflows/review.md`
- `factory/templates/review-report.md`
- `factory/templates/scorecard.md`

### `sf qa`
Load:
- `DESIGN.md`
- `factory/workflows/qa.md`
- `factory/templates/qa-report.md`

### `sf retro`
Load:
- `ETHOS.md`
- `factory/workflows/retro.md`
- `factory/templates/retro.md`

## Rule

Keep runtime logic minimal. Prefer adding or changing workflow/template files before expanding core code.

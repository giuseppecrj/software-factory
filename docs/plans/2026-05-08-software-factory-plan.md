# Lean Composable Software Factory Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Build a lean, extension-first software factory that can shape work, spawn multiple isolated implementation agents for the same task, run parallel reviewers, and converge on the best result through explicit artifacts and verification.

**Architecture:** Use **incur** as the thin CLI/harness layer, keep the core runtime small and composable in the spirit of **Pi**, and treat multi-agent execution as **one orchestrator above isolated workers and isolated reviewers**, not as a peer swarm. Put most of the product intelligence in workflow files, skills, templates, and deterministic verification scripts. Use isolated worktrees first; add stronger sandbox backends later.

**Tech Stack:** Bun, TypeScript, incur, markdown workflow/skill files, git worktrees, bun test, Playwright, structured JSON/Markdown artifacts.

---

## Research summary distilled into design rules

### Load-bearing rules from the wiki
1. A real software factory is a **repo and workflow design problem** more than a model problem.
2. The repo must be **runnable, accessible, and verifiable** by the agent.
3. The safe multi-agent shape is **one orchestrator / dispatch layer above many isolated workers**.
4. The harness should stay thin; workflow opinion should live in **extensions, skills, templates, and repo law**.
5. Rules should **emerge from recurring failures**, not from giant static rule packs.
6. Review and QA must be independent stages, not just optional polish.
7. The right primitive for “3 agents try the same idea” is **parallel isolated branches/worktrees with shared spec but different strategy briefs**.
8. The right primitive for review is **parallel independent reviewer passes**, funneled back to one lead/orchestrator.

### Explicit non-goals for V1
- No peer-to-peer swarm protocols
- No giant baked-in role catalog
- No hosted control plane
- No heavyweight sandbox platform on day one
- No opaque memory layer hidden inside the harness
- No giant `CLAUDE.md` trying to encode the entire system

---

## Target repo shape

Create the following structure inside this repo:

```text
software-factory/
  AGENTS.md
  SOUL.md
  ETHOS.md
  ROUTING.md
  DESIGN.md

  docs/
    architecture/
      overview.md
      worktree-model.md
      review-model.md
    runbooks/
      recover-stuck-run.md
      merge-winning-branch.md
    plans/
      2026-05-08-software-factory-plan.md

  factory/
    workflows/
      shape.md
      plan.md
      prototype.md
      review.md
      qa.md
      retro.md
    skills/
      product/
        shape.md
        plan.md
      implementation/
        prototype-builder.md
        refactor-builder.md
      review/
        code-review.md
        architecture-review.md
        qa-review.md
      learning/
        retro.md
        extract-rule.md
    templates/
      shape.md
      implementation-plan.md
      prototype-brief.md
      review-report.md
      qa-report.md
      retro.md
      scorecard.md

  scripts/
    check
    test
    qa
    worktree-create
    worktree-clean
    merge-winner

  runs/
    requests/
    active/
    completed/
    reviews/
    receipts/

  src/
    cli.ts
    commands/
      shape.ts
      plan.ts
      prototype.ts
      review.ts
      qa.ts
      retro.ts
    core/
      router.ts
      artifacts.ts
      run-store.ts
      worktree.ts
      scoring.ts
      types.ts
      orchestration/
        prototype-fanout.ts
        review-fanout.ts

  tests/
    core/
    commands/
    fixtures/
```

---

## Operating model

### Command surface for V1
Only implement these first:
- `/shape`
- `/plan`
- `/prototype`
- `/review`
- `/qa`
- `/retro`

### The critical V1 flow
```text
idea
  -> /shape
  -> /plan
  -> /prototype --variants 3
      -> 3 isolated implementation runs
      -> each writes artifact + branch/worktree output
  -> /review --branches <three outputs>
      -> parallel independent reviewers
  -> /qa --winner <selected branch>
  -> /retro
      -> extract rules / checks / workflow improvements
```

### Multi-agent model
For the user’s main requirement — “3 agents work on the same prototype and I choose the best one” — the V1 pattern is:

1. One orchestrator command creates a **run request**.
2. The orchestrator generates **N strategy briefs** from the same plan.
3. Each brief is executed in its **own git worktree**.
4. Each worker writes:
   - `summary.md`
   - `result.json`
   - diff/branch info
   - verification outputs
5. Reviewers run independently over each candidate.
6. A lead synthesis step produces a scorecard.
7. Human selects winner or requests another round.

This preserves parallelism without requiring worker-to-worker coordination.

---

## Artifact contracts

Every run must leave durable artifacts.

### Shape artifact
`runs/completed/<run-id>/shape.md`

Must contain:
- problem statement
- user goal
- constraints
- what not to build
- success criteria

### Plan artifact
`runs/completed/<run-id>/plan.md`

Must contain:
- architecture
- tasks
- acceptance criteria
- risks
- verification plan

### Prototype variant artifact
`runs/completed/<run-id>/variants/<variant-id>/result.json`

Must contain:
- branch/worktree path
- strategy used
- files changed
- checks run
- outcome summary
- unresolved issues

### Review artifact
`runs/reviews/<run-id>/<reviewer-id>.md`

Must contain:
- candidate reviewed
- strengths
- blocking issues
- non-blocking issues
- score
- recommendation

### QA artifact
`runs/completed/<run-id>/qa.md`

Must contain:
- environment tested
- steps executed
- screenshots
- failures
- pass/fail summary

### Retro artifact
`runs/completed/<run-id>/retro.md`

Must contain:
- what worked
- what failed repeatedly
- what to encode as a new rule
- what check/script/template to add

---

## Architecture decisions for V1

### Decision 1: incur is the harness, not the product
Use incur for:
- command definition
- agent/human-friendly CLI output
- manifest/discovery ergonomics
- thin command dispatch

Do **not** put business workflow complexity into incur itself.

### Decision 2: Pi is the model for core shape
Copy from Pi:
- thin stable core
- workflow opinion outside the core
- extensibility via files and packages
- shared runtime semantics across CLI and future SDK/RPC

Do **not** copy:
- broad feature surface in V1
- multiple controller modes before the core loop is stable

### Decision 3: Worktrees are the first isolation substrate
V1 isolation = git worktrees.

Why:
- lightweight
- inspectable
- local
- fast to implement
- ideal for “3 prototype variants”

Defer heavier sandboxing until worktrees prove insufficient.

### Decision 4: One orchestrator, many isolated workers
The orchestrator may spawn many workers and reviewers, but workers do not coordinate directly.

All coordination goes through:
- request files
- result files
- review artifacts
- scorecards

### Decision 5: Verification is a first-class stage
Every candidate branch should be able to run:
- `scripts/test`
- `scripts/check`
- optional `scripts/qa`

No “looks good” branch should advance without explicit checks.

### Decision 6: Rules come from retros
Do not overbuild the doctrine files initially.

Instead:
- start small
- run real prototype jobs
- promote repeated failures into:
  - script checks
  - workflow edits
  - skill updates
  - architecture rules

---

## Phase plan

## Phase 1 — Harness-ready repo skeleton
**Objective:** Make the repo legible, runnable, and enforceable before multi-agent work starts.

### Task 1: Create repo doctrine files
**Files:**
- Create: `AGENTS.md`
- Create: `SOUL.md`
- Create: `ETHOS.md`
- Create: `ROUTING.md`
- Create: `DESIGN.md`

**Requirements:**
- `AGENTS.md` = concise map, not giant manual
- `ROUTING.md` = which files each command loads
- `ETHOS.md` = high-level operating rules
- `DESIGN.md` = output/taste constraints for generated product artifacts

**Verification:**
- A new agent can read `AGENTS.md` and know where to look next.

### Task 2: Create deterministic entrypoints
**Files:**
- Create: `scripts/check`
- Create: `scripts/test`
- Create: `scripts/qa`

**Requirements:**
- one command for checks
- one command for tests
- one command for QA entry

**Verification:**
- `./scripts/check` runs without ambiguity
- `./scripts/test` is fast enough for iterative use

### Task 3: Create docs map
**Files:**
- Create: `docs/architecture/overview.md`
- Create: `docs/architecture/worktree-model.md`
- Create: `docs/architecture/review-model.md`
- Create: `docs/runbooks/recover-stuck-run.md`
- Create: `docs/runbooks/merge-winning-branch.md`

**Verification:**
- Agent can locate worktree lifecycle and review flow without grep-heavy wandering.

---

## Phase 2 — File-based factory operating system
**Objective:** Build the workflow/skill/template layer before the orchestration logic.

### Task 4: Create workflow files
**Files:**
- Create: `factory/workflows/shape.md`
- Create: `factory/workflows/plan.md`
- Create: `factory/workflows/prototype.md`
- Create: `factory/workflows/review.md`
- Create: `factory/workflows/qa.md`
- Create: `factory/workflows/retro.md`

**Requirements:**
Each workflow defines:
- required inputs
- exact files to load
- exact artifact path to produce
- stop condition

### Task 5: Create first skill files
**Files:**
- Create: `factory/skills/product/shape.md`
- Create: `factory/skills/product/plan.md`
- Create: `factory/skills/implementation/prototype-builder.md`
- Create: `factory/skills/review/code-review.md`
- Create: `factory/skills/review/architecture-review.md`
- Create: `factory/skills/review/qa-review.md`
- Create: `factory/skills/learning/retro.md`
- Create: `factory/skills/learning/extract-rule.md`

**Requirements:**
Skills define process, not persona.

### Task 6: Create artifact templates
**Files:**
- Create: `factory/templates/shape.md`
- Create: `factory/templates/implementation-plan.md`
- Create: `factory/templates/prototype-brief.md`
- Create: `factory/templates/review-report.md`
- Create: `factory/templates/qa-report.md`
- Create: `factory/templates/retro.md`
- Create: `factory/templates/scorecard.md`

**Verification:**
- Every workflow can render a first-pass artifact without ad hoc formatting.

---

## Phase 3 — Thin incur command layer
**Objective:** Expose the software factory through a thin incur-native command surface.

### Task 7: Add dependencies
**Files:**
- Modify: `package.json`

**Dependencies:**
- `incur`
- any minimal helper packages actually required

**Verification:**
- CLI boots locally with Bun.

### Task 8: Implement command registration
**Files:**
- Create: `src/cli.ts`
- Create: `src/core/types.ts`
- Create: `src/core/router.ts`

**Commands:**
- `shape`
- `plan`
- `prototype`
- `review`
- `qa`
- `retro`

**Requirements:**
- incur defines the command tree
- command handlers are thin
- command handlers load workflows + templates + skills rather than containing giant inline logic

### Task 9: Add artifact store helpers
**Files:**
- Create: `src/core/artifacts.ts`
- Create: `src/core/run-store.ts`

**Requirements:**
- create run IDs
- persist requests/results/reviews/receipts
- never hide state in transient process memory only

---

## Phase 4 — Single-run flows first
**Objective:** Make one-agent workflows real before parallelizing.

### Task 10: Implement `/shape`
**Files:**
- Create: `src/commands/shape.ts`
- Test: `tests/commands/shape.test.ts`

**Output:**
- shape artifact
- run receipt

### Task 11: Implement `/plan`
**Files:**
- Create: `src/commands/plan.ts`
- Test: `tests/commands/plan.test.ts`

**Output:**
- plan artifact
- acceptance criteria
- verification plan

### Task 12: Implement `/review`
**Files:**
- Create: `src/commands/review.ts`
- Test: `tests/commands/review.test.ts`

**Output:**
- independent structured review report

### Task 13: Implement `/qa`
**Files:**
- Create: `src/commands/qa.ts`
- Test: `tests/commands/qa.test.ts`

**Output:**
- QA report
- screenshot paths if applicable

### Task 14: Implement `/retro`
**Files:**
- Create: `src/commands/retro.ts`
- Test: `tests/commands/retro.test.ts`

**Output:**
- retro artifact
- promote-to-system section

---

## Phase 5 — Parallel prototype fanout
**Objective:** Support the user’s main use case: multiple agents do the same prototype task in parallel.

### Task 15: Create worktree lifecycle scripts
**Files:**
- Create: `scripts/worktree-create`
- Create: `scripts/worktree-clean`
- Create: `scripts/merge-winner`
- Create: `src/core/worktree.ts`

**Requirements:**
- create N isolated worktrees for one run
- derive deterministic names
- clean up safely
- merge chosen winner later

### Task 16: Implement `/prototype --variants N`
**Files:**
- Create: `src/commands/prototype.ts`
- Create: `src/core/orchestration/prototype-fanout.ts`
- Test: `tests/commands/prototype.test.ts`

**Behavior:**
- read shape + plan
- create N strategy variants
- create N worktrees
- emit one request per variant
- run implementation agent in each worktree
- collect result artifacts

**Variant strategy examples:**
- conservative / polished / experimental
- simple / fast / high-design
- minimal-change / rewrite / architecture-first

The point is differentiated hypotheses, not redundant clones.

### Task 17: Add result scorecard synthesis
**Files:**
- Create: `src/core/scoring.ts`
- Test: `tests/core/scoring.test.ts`

**Output:**
- compare candidates on:
  - spec fit
  - test status
  - complexity
  - design quality
  - risk

---

## Phase 6 — Parallel reviewers
**Objective:** Let review be parallel and independent.

### Task 18: Implement review fanout
**Files:**
- Create: `src/core/orchestration/review-fanout.ts`
- Modify: `src/commands/review.ts`
- Test: `tests/commands/review.test.ts`

**Behavior:**
For each candidate branch, optionally run:
- code reviewer
- architecture reviewer
- QA reviewer

Each reviewer writes a separate artifact. No reviewer talks to another reviewer directly.

### Task 19: Add winner-selection report
**Files:**
- Create: `factory/templates/scorecard.md`
- Modify: `src/core/scoring.ts`

**Output:**
A final scorecard with:
- branch per candidate
- reviewer summaries
- blocking issues
- recommendation
- suggested winner

---

## Phase 7 — Real dogfood loop
**Objective:** Validate the factory on actual work before adding more complexity.

### Task 20: Run 3 real prototype tasks
Use the system on three genuine small ideas.

For each:
1. `/shape`
2. `/plan`
3. `/prototype --variants 3`
4. `/review`
5. `/qa`
6. `/retro`

**Capture:**
- where agents collided
- where worktree setup broke
- what instructions repeated
- what verification was missing
- what should become repo law

### Task 21: Promote repeated failures into the system
**Files likely modified:**
- `factory/skills/...`
- `factory/workflows/...`
- `scripts/check`
- `AGENTS.md`
- `docs/runbooks/...`

This is the compounding loop. Nothing else matters if this loop is weak.

---

## Acceptance criteria for V1

V1 is done when:

1. `bun run src/cli.ts shape ...` produces a shape artifact.
2. `bun run src/cli.ts plan ...` produces a plan artifact.
3. `bun run src/cli.ts prototype --variants 3 ...` creates 3 isolated worktrees and 3 candidate result artifacts.
4. `bun run src/cli.ts review ...` can run parallel reviewer passes over those results.
5. `bun run src/cli.ts qa ...` produces a QA artifact.
6. `bun run src/cli.ts retro ...` produces a retro artifact with concrete system promotions.
7. The repo remains runnable with one command for checks/tests.
8. The system uses one orchestrator above isolated workers, not a peer swarm.
9. At least 3 real prototype tasks have been run through the full loop.

---

## Explicit deferred work

Do not build these in V1:
- cloud worker fleet
- container/VM orchestration dashboard
- automatic issue ingestion from external systems
- giant memory subsystem
- dozens of specialist roles
- worker-to-worker protocol
- hosted web UI
- broad marketplace/install system

If worktrees become the bottleneck, the next step is a stronger sandbox/runtime layer. But only after the worktree model proves its limits.

---

## Recommended first build order

1. Harness-ready repo skeleton
2. Workflow/skill/template layer
3. Thin incur CLI shell
4. Single-agent commands
5. Worktree fanout for prototypes
6. Parallel reviewer fanout
7. Real dogfood loop
8. Promote failures into rules

---

## Bottom-line architecture

This project should become:

- **Pi-like** in core shape: thin, extension-first, composable
- **incur-based** at the CLI boundary: agent-native discovery/output, minimal friction
- **Cursor/software-factory-inspired** in workflow ambition: many isolated runs, manager-mode human
- **evo-like** in parallel execution shape: one orchestrator, multiple isolated same-task workers
- **otter-like** in repo discipline: machine-checkable repo law
- **anti-swarm** in coordination model: parallel workers and reviewers, but no peer swarm theater

The core primitive is not “an army of agents.”

It is:
**one orchestrator coordinating many isolated experiments and many isolated reviews through explicit artifacts and verification.**

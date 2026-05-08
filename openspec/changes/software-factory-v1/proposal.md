## Why

The `software-factory` repo exists, but today it is only a Bun starter plus a standalone planning document. The product goal is sharper than “build another coding agent”: create a **lean, composable software factory** where one operator can shape work, fan the same prototype task out to multiple isolated workers, run parallel reviewer agents, and choose a winning result without relying on swarm-style peer coordination.

The strongest references in the research cluster converge on the same pattern:

- the repo must be **runnable, accessible, and verifiable** by agents
- the safe execution shape is **one orchestrator above isolated workers**, not peer swarms
- the harness should stay thin, while workflow opinion lives in files, extensions, and deterministic scripts
- parallelism is most valuable when applied to **alternative implementations and independent reviews**, not collaborative co-editing in one mutable workspace

Without an OpenSpec change, the repo has no agreed V1 boundary, no named capabilities, and no reviewable statement of what “lean but real software factory” means. This proposal establishes that boundary before implementation starts.

## What Changes

- Define a V1 software-factory architecture centered on:
  - a thin CLI/harness layer
  - explicit workflow/skill/template files
  - isolated prototype workers for same-task fanout
  - parallel independent reviewer fanout
  - durable artifact contracts and receipts
- Establish the minimum command surface for V1: `shape`, `plan`, `prototype`, `review`, `qa`, and `retro`.
- Require the repo to be harness-ready before worker fanout: deterministic check/test entrypoints, repo map docs, and machine-checkable workflow outputs.
- Define worktree-first isolation for local parallel execution, while keeping the runtime boundary abstract enough to support stronger sandbox backends later.
- Capture what V1 deliberately excludes: peer-to-peer swarms, hosted control plane, giant built-in role packs, and opaque memory systems.

## Capabilities

### New Capabilities

- `software-factory-core`: CLI-driven software-factory loop with explicit workflows, artifact contracts, and run receipts.
- `parallel-prototype-fanout`: spawn multiple isolated prototype workers against the same shaped-and-planned task.
- `parallel-review-fanout`: run independent reviewer passes against candidate outputs and aggregate the results into a scorecard.

### Modified Capabilities

None.

## Impact

- Affected files will live in the new `software-factory` repo under `openspec/`, `docs/`, `factory/`, `scripts/`, and `src/`.
- This change is architecture- and workflow-shaping; it does not yet require a hosted runtime, external queueing system, or remote sandbox vendor.
- V1 implementation is expected to use Bun + TypeScript, a thin CLI/harness layer, git worktrees for isolation, and deterministic verification scripts.
- The proposal is intentionally reviewable before implementation begins so the repo can stay lean and avoid overbuilding swarm or platform complexity too early.

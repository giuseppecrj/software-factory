## 1. Repo law and harness-ready substrate

- [ ] 1.1 Create root repo map files: `AGENTS.md`, `SOUL.md`, `ETHOS.md`, `ROUTING.md`, and `DESIGN.md`.
- [ ] 1.2 Create deterministic entrypoints: `scripts/check`, `scripts/test`, and `scripts/qa`.
- [ ] 1.3 Add architecture docs under `docs/architecture/` covering overview, worktree model, and review model.
- [ ] 1.4 Add runbooks under `docs/runbooks/` for stuck-run recovery and winner-merge flow.
- [ ] 1.5 Verify the repo is runnable, accessible, and verifiable by an agent using only the documented entrypoints.

## 2. File-driven workflow layer

- [ ] 2.1 Create workflow files for `shape`, `plan`, `prototype`, `review`, `qa`, and `retro` under `factory/workflows/`.
- [ ] 2.2 Create first skill files under `factory/skills/` for product shaping/planning, prototype implementation, review, and learning.
- [ ] 2.3 Create artifact templates under `factory/templates/` for shape, implementation plan, prototype brief, review report, QA report, retro, and scorecard outputs.
- [ ] 2.4 Make workflow inputs, outputs, and stop conditions explicit in file form rather than leaving them implicit in runtime code.

## 3. Thin CLI / run-store core

- [ ] 3.1 Add the chosen CLI/harness dependency and wire a thin command surface for `shape`, `plan`, `prototype`, `review`, `qa`, and `retro`.
- [ ] 3.2 Implement core types for task spec, run state, candidate result, reviewer result, and receipts.
- [ ] 3.3 Implement run/artifact persistence so every command writes durable state under a run-scoped directory.
- [ ] 3.4 Ensure command handlers load workflow/skill/template files rather than embedding large workflow logic directly in code.

## 4. Single-run command behavior

- [ ] 4.1 Implement `/shape` to create a durable shape artifact and receipt.
- [ ] 4.2 Implement `/plan` to create a durable implementation plan artifact with acceptance criteria and verification plan.
- [ ] 4.3 Implement `/review` in single-candidate mode to create a structured review artifact.
- [ ] 4.4 Implement `/qa` to create a structured QA artifact.
- [ ] 4.5 Implement `/retro` to create a retro artifact with explicit “promote to system” outputs.

## 5. Parallel prototype fanout

- [ ] 5.1 Implement worktree lifecycle helpers for create, inspect, clean, and merge-winner flows.
- [ ] 5.2 Implement `prototype --variants <n>` to create isolated candidate runs for the same shaped-and-planned task.
- [ ] 5.3 Ensure each prototype worker receives the shared task packet plus a differentiated strategy brief.
- [ ] 5.4 Persist one result artifact bundle per candidate, including branch/worktree identity, summary, and verification outputs.
- [ ] 5.5 Cap V1 fanout to a small safe range (for example 1–5 variants) and document the reason.

## 6. Parallel review fanout

- [ ] 6.1 Implement independent reviewer passes for at least code/spec fit, architecture fit, and QA/test signal.
- [ ] 6.2 Keep reviewers read-only by default so candidate comparability is preserved.
- [ ] 6.3 Aggregate reviewer outputs into a final scorecard artifact with strengths, blockers, and recommendation per candidate.
- [ ] 6.4 Preserve all reviewer artifacts so disagreements are inspectable by the human operator.

## 7. Verification and dogfood

- [ ] 7.1 Add tests for run-store, artifact pathing, worktree lifecycle helpers, and core command behavior.
- [ ] 7.2 Run the full factory loop on at least one real small prototype task using multiple variants and reviewer fanout.
- [ ] 7.3 Capture repeated failures in a retro and promote at least one concrete new rule/check/workflow edit from that run.
- [ ] 7.4 Run `openspec validate software-factory-v1` and report the result before implementation starts in earnest.

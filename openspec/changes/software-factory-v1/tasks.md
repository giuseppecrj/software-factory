     1|## 1. Repo law, harness-ready substrate, install path, and operator flow
     2|
     3|- [x] 1.1 Create root repo map files: `AGENTS.md`, `SOUL.md`, `ETHOS.md`, `ROUTING.md`, and `DESIGN.md`.
     4|- [x] 1.2 Create deterministic entrypoints: `scripts/check`, `scripts/test`, `scripts/qa`, and a first-time setup/`doctor` path.
     5|- [x] 1.3 Define packaging and install flow for an operator-facing global CLI (`npm install -g` or equivalent published install path).
     6|- [x] 1.4 Add architecture docs under `docs/architecture/` covering overview, worktree model, review model, and the end-to-end operator flow.
     7|- [x] 1.5 Add runbooks under `docs/runbooks/` for stuck-run recovery and winner-merge flow.
     8|- [x] 1.6 Verify the repo is runnable, accessible, and verifiable by an agent using only the documented entrypoints.
     9|- [x] 1.7 Add first-time-user flow docs showing install/setup → idea → shape → plan → prototype fanout → review → QA → winner selection → retro.
    10|
    11|## 2. File-driven workflow layer
    12|
    13|- [x] 2.1 Create workflow files for `shape`, `plan`, `prototype`, `review`, `qa`, and `retro` under `factory/workflows/`.
    14|- [x] 2.2 Create first skill files under `factory/skills/` for product shaping/planning, prototype implementation, review, and learning.
    15|- [x] 2.3 Create artifact templates under `factory/templates/` for shape, implementation plan, prototype brief, review report, QA report, retro, and scorecard outputs.
    16|- [x] 2.4 Make workflow inputs, outputs, and stop conditions explicit in file form rather than leaving them implicit in runtime code.
    17|
    18|## 3. Thin CLI / run-store core
    19|
    20|- [x] 3.1 Add the chosen CLI/harness dependency and wire a thin command surface for bootstrap commands `init`, `doctor` and workflow commands `shape`, `plan`, `prototype`, `review`, `qa`, and `retro`.
    21|- [x] 3.2 Implement core types for task spec, run state, candidate result, reviewer result, and receipts.
    22|- [x] 3.3 Implement run/artifact persistence so every command writes durable state under a run-scoped directory.
    23|- [x] 3.4 Ensure command handlers load workflow/skill/template files rather than embedding large workflow logic directly in code.
    24|- [x] 3.5 Design command help, errors, and status output so a human operator can recover without reading source code.
    25|- [x] 3.6 Define the package binary name as `sf` and make global-install behavior, docs, and runtime output use that consistently.
    26|
    27|## 4. Bootstrap and single-run command behavior
    28|
    29|- [x] 4.1 Implement `init` to scaffold repo-local factory state, folders, and config stubs.
    30|- [x] 4.2 Implement `doctor` to validate readiness, detect missing prerequisites, and explain recovery steps.
    31|- [x] 4.3 Implement `/shape` to create a durable shape artifact and receipt.
    32|- [x] 4.4 Implement `/plan` to create a durable implementation plan artifact with acceptance criteria and verification plan.
    33|- [x] 4.5 Implement `/review` in single-candidate mode to create a structured review artifact.
    34|- [x] 4.6 Implement `/qa` to create a structured QA artifact.
    35|- [x] 4.7 Implement `/retro` to create a retro artifact with explicit “promote to system” outputs.
    36|
    37|## 5. Parallel prototype fanout
    38|
    39|- [x] 5.1 Implement worktree lifecycle helpers for create, inspect, clean, and merge-winner flows.
    40|- [x] 5.2 Implement `prototype --variants <n>` to create isolated candidate runs for the same shaped-and-planned task.
    41|- [x] 5.3 Auto-generate differentiated strategy briefs by default, starting with conservative / balanced / ambitious.
    42|- [x] 5.4 Persist one result artifact bundle per candidate, including branch/worktree identity, summary, and verification outputs.
    43|- [x] 5.5 Cap V1 fanout to a small safe range (for example 1–5 variants) and document the reason.
    44|
    45|## 6. Parallel review fanout
    46|
    47|- [x] 6.1 Implement three default reviewer passes: spec-fit, architecture/code-quality, and QA/test-signal.
    48|- [x] 6.2 Keep reviewers read-only by default so candidate comparability is preserved.
    49|- [x] 6.3 Aggregate reviewer outputs into a final scorecard artifact with strengths, blockers, and recommendation per candidate.
    50|- [x] 6.4 Preserve all reviewer artifacts so disagreements are inspectable by the human operator.
    51|
    52|## 7. Verification and dogfood
    53|
    54|- [x] 7.1 Add tests for run-store, artifact pathing, worktree lifecycle helpers, and core command behavior.
    55|- [x] 7.2 Run the full factory loop on at least one real small prototype task using multiple variants and reviewer fanout.
    56|- [x] 7.3 Capture repeated failures in a retro and promote at least one concrete new rule/check/workflow edit from that run.
    57|- [x] 7.4 Run `openspec validate software-factory-v1` and report the result before implementation starts in earnest.
    58|
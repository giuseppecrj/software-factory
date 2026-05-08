## Context

Research across the local wiki and adjacent public-reference cluster points to a consistent software-factory architecture:

- **Sandcastle**: a TypeScript library for orchestrating coding agents in isolated sandboxes with a configurable branch strategy and merge-back flow. It is especially relevant because it sits close to our target shape: one `run()` entrypoint, sandbox-provider abstraction (Docker, Podman, Vercel, or custom), and explicit support for parallel AFK agents and review pipelines. The intended use here is as a **design reference**, not as a direct V1 dependency.
- **Cursor / software factory**: the human becomes manager of asynchronous execution rather than the primary implementer; repo design and verification matter more than mystical prompting.
- **Harness-Ready Repo**: a repo becomes agent-productive only when it is legible, enforceable, observable, and capable of passing durable learning forward.
- **Pi / extension-first harness**: keep the runtime core intentionally small and stable; push workflow ideology into extensions, files, and resource bundles.
- **in-cur / agent-native CLI framing**: the CLI/harness boundary should be cheap for agents to discover and script; output and manifest ergonomics matter.
- **evo / worktree fanout**: the strongest same-task parallelism pattern is many isolated branches/worktrees under one orchestrator, not a shared mutable checkout.
- **anti-swarm consensus / folder-as-agent / dispatch layer**: workers should not coordinate peer-to-peer by default; coordination should happen through the orchestrator and explicit artifacts.
- **otter / repo law**: architecture, docs freshness, and completion gates should be machine-checkable so quality is not left to review comments alone.
- **Daytona / Flue / sandbox-runtime layer**: strong runtime isolation is valuable, but V1 should avoid forcing a heavy platform choice before worktree-local execution proves insufficient.

The user’s main requirement sharpens the design target:

> When I want to test an idea, I should be able to go through the software-factory flow, spin up 3 agents to work on the prototype, compare them, and optionally run reviewer agents in parallel too.

That requirement makes the load-bearing V1 question explicit: what is the smallest architecture that supports **same-task implementation fanout + independent review fanout** while staying lean, composable, and debuggable?

## Goals / Non-Goals

**Goals:**

- Establish a **thin CLI/harness layer** that exposes the factory loop without baking most workflow logic into the runtime core.
- Make the repo **harness-ready** before chasing advanced orchestration: deterministic scripts, clear docs map, explicit output contracts.
- Support **same-task parallel prototype generation** through isolated worktrees or equivalent local execution boundaries.
- Support **parallel independent review passes** over candidate outputs.
- Produce durable artifacts for every stage: shape, plan, candidate result, review report, QA report, retro, receipt.
- Make **DevEx a first-class success metric**: the factory should feel obvious to run, easy to inspect, and safe to recover when something fails.
- Document the **operator flow step-by-step** so a first-time user knows exactly how to move from install through init/doctor to a winning branch without tribal knowledge.
- Keep runtime/execution isolation abstract enough that the repo can grow into stronger sandbox backends later without changing the workflow model.
- Keep V1 composable and Pi-like: a small stable core with most domain behavior living in files and modular handlers.
- Make the operator-facing product feel like a **global CLI tool**, while still keeping repo-local workflow state and artifacts explicit.

**Non-Goals:**

- No peer-to-peer agent swarm protocol.
- No hosted control plane, scheduler fleet, or web dashboard in V1.
- No giant built-in specialist library or marketplace.
- No opaque hidden memory layer that becomes a second source of truth.
- No automatic merge-to-main without an explicit human decision boundary.
- No requirement to choose a single long-term remote runtime vendor during V1.

## Decisions

### Decision 1: The factory is orchestrator-first, not swarm-first

V1 will use **one orchestrator above many isolated workers and isolated reviewers**.

Rationale:
- This matches the anti-swarm consensus from the wiki cluster.
- It keeps parallelism where it is useful — alternative implementations and independent critiques — while avoiding worker-to-worker coupling and merge chaos.
- It keeps debugging simple: all coordination flows through files, run state, and the orchestrator.

Alternative considered: peer swarm / autonomous multi-agent conversation. Rejected because the research cluster consistently shows that uncontrolled agent coordination adds complexity faster than it adds throughput.

### Decision 2: Worktrees are the primary V1 isolation primitive

Local parallel execution will use **git worktrees** as the first isolation substrate.

Rationale:
- They are cheap, inspectable, and native to the development workflow.
- They are the clearest local answer to “3 agents prototype the same task in parallel.”
- They defer heavier runtime/platform complexity until the factory proves its core loop.

Alternative considered: require container/VM sandboxing for every run. Rejected for V1 because it adds startup and platform complexity before the workflow and artifact model are proven.

### Decision 2b: Borrow Sandcastle's model, do not use it directly in V1

V1 should **borrow Sandcastle's execution shape** — thin orchestrator, sandbox-provider seam, branch/merge discipline, and isolated runs — without taking a direct dependency on Sandcastle itself.

Rationale:
- This keeps V1's execution layer understandable and tailored to the software-factory workflow model.
- It avoids coupling the product surface to a third-party orchestration library before we have validated our own repo law, workflow contracts, and DevEx.
- It still preserves a future path to stronger sandbox providers if worktree-local execution stops being sufficient.

Alternative considered: adopt Sandcastle directly as the V1 execution layer. Rejected for now because the current goal is to keep V1 lean, explicit, and easy to evolve around our own workflow and artifact model.

### Decision 3: The CLI/harness stays thin; workflow opinion lives in files

The runtime core should own only:
- command dispatch
- context loading/routing
- run IDs and receipts
- artifact persistence
- worktree/runtime lifecycle calls
- orchestration/fanout coordination

Workflow ideology should live in:
- workflow files
- skill files
- templates
- deterministic scripts
- architecture docs and runbooks

Rationale:
- This preserves a Pi-like extension-first shape.
- It makes the system easier to inspect and evolve without rewriting core runtime code.

Alternative considered: embed workflows directly into code with a larger permanent core. Rejected because it front-loads too much opinion and reduces composability.

### Decision 4: Reviewers are independent and mostly read-only

Reviewer fanout will produce **independent review artifacts** and a final scorecard.

V1 reviewers should focus on:
- spec/acceptance-criteria fit
- code quality / architecture fit
- test/verification signal
- QA findings

They should not mutate candidate branches by default.

Rationale:
- This preserves comparability between candidates.
- It prevents reviewers from becoming second-wave implementers that blur responsibility.

Alternative considered: self-healing reviewers that rewrite candidate branches. Deferred; useful later, but it complicates scoring and attribution in V1.

### Decision 5: Artifact contracts are first-class and mandatory

Every stage must write durable outputs under a run-scoped directory, including machine-readable status and human-readable summaries.

Minimum artifacts:
- shape
- plan
- candidate result
- review report(s)
- QA report
- retro
- run receipt(s)

Rationale:
- The factory should be inspectable and replayable.
- Artifacts become the safe boundary between workers, reviewers, and humans.

Alternative considered: implicit state inside session memory or logs only. Rejected because it is hard to audit, replay, or debug.

### Decision 6: Rules should emerge from real failures

V1 will avoid giant upfront doctrine packs. Instead, repeated failures found during real runs should be promoted into:
- script checks
- workflow edits
- review rubrics
- runbooks
- architecture rules

Rationale:
- This follows the strongest lesson from the Cursor/software-factory cluster.
- It keeps the system lean and grounded in real failure modes.

Alternative considered: preload a huge set of generic rules. Rejected because it creates noise and false precision before the system has earned its complexity.

### Decision 7: DevEx is a product requirement, not an afterthought

V1 will optimize for a **clear operator experience** as aggressively as it optimizes for orchestration correctness.

That means:
- commands should be easy to discover and memorize
- outputs should be readable to a human and machine-parseable for agents
- failure states should explain how to recover
- user flow steps should be documented explicitly in the repo and reflected in the command surface
- installation should result in a recognizable global CLI plus explicit repo-local initialization

Rationale:
- A software factory with strong internals but weak operator experience will not get used enough to compound.
- The human is still the manager, reviewer, and escalation path; making their flow awkward weakens the whole system.

Alternative considered: defer DevEx until after runtime/orchestration work. Rejected because first-use clarity is part of the architecture, not a polish pass.

### Decision 8: Split bootstrap commands from workflow commands

V1 command design will distinguish between:
- **bootstrap commands**: `init`, `doctor`
- **workflow commands**: `shape`, `plan`, `prototype`, `review`, `qa`, `retro`

`init` prepares repo-local factory state, while `doctor` validates readiness and explains recovery steps. The workflow commands operate on actual software-factory runs.

Rationale:
- This keeps installation/setup concerns separate from day-to-day factory usage.
- It makes first-time-user docs and command help much easier to understand.
- It aligns the global CLI install model with the repo-local state model.

Alternative considered: hide setup inside the first workflow command. Rejected because it creates surprising side effects and weakens failure diagnosis.

### Decision 9: Use `sf` as the operator-facing binary name in V1

The global CLI should install an operator-facing binary named `sf`.

Rationale:
- It is short, memorable, and ergonomic for repeated daily use.
- It keeps examples compact and readable.
- The package can retain a longer npm package name while exposing `sf` as the primary executable.

Alternative considered: use `software-factory` as the primary binary. Rejected because it is too long for high-frequency use.

### Decision 10: Auto-generate differentiated prototype strategies by default

`prototype --variants <n>` should generate differentiated strategy briefs automatically by default in V1.

The default strategy family should bias toward:
- conservative / low-risk
- balanced / pragmatic
- ambitious / high-upside

Rationale:
- It reduces first-use friction in the most important multi-candidate flow.
- It makes the value of fanout visible without requiring extra operator setup.
- Manual strategy overrides can still be added later.

Alternative considered: require explicit strategy labels from the operator. Rejected for V1 because it adds friction to the core loop.

### Decision 11: Start with three reviewer profiles in V1

V1 reviewer fanout should include three default reviewer profiles:
- spec-fit reviewer
- architecture/code-quality reviewer
- QA/test-signal reviewer

Rationale:
- This gives enough diversity of critique without creating a role zoo.
- The profiles map cleanly to the operator's mental model: did it solve the task, is the implementation sound, and did verification hold up?

Alternative considered: a single generic reviewer. Rejected because it weakens the point of independent reviewer fanout.

### Decision 12: Start implementation worktree-first

The first implementation slice should use worktree-local execution only, while preserving a future runtime seam for stronger isolation backends.

Rationale:
- It is the simplest path to proving the factory loop.
- It keeps the first slice local, inspectable, and fast to debug.
- It avoids premature complexity from container-first or remote runtime integrations.

Alternative considered: ship an optional stronger runtime adapter immediately. Deferred until the worktree-based loop proves its limits.

## Architecture Overview

### Layer 1: Repo law / harness-ready substrate

The repo must provide:
- root operator map (`AGENTS.md`)
- architecture docs and runbooks
- deterministic `check`, `test`, and `qa` entrypoints
- predictable folders for workflows, skills, templates, scripts, and runs

This is the load-bearing substrate. Without it, multi-agent fanout just scales confusion.

### Layer 2: Workflow/skill/template layer

This layer defines the actual software-factory behavior through files:
- `shape`
- `plan`
- `prototype`
- `review`
- `qa`
- `retro`

Each workflow loads specific files and writes a specific artifact shape.

### Layer 3: Thin CLI/harness layer

This layer exposes commands and coordinates runs. It should remain intentionally small and scriptable.

The CLI surface is split into:
- **bootstrap**: `init`, `doctor`
- **workflow**: `shape`, `plan`, `prototype`, `review`, `qa`, `retro`

This keeps first-time setup and day-to-day factory operation distinct.

### Layer 4: Execution isolation layer

V1 isolation uses git worktrees. The architecture should retain a runtime interface so heavier sandbox providers can be introduced later.

### Layer 5: Fanout / aggregation layer

This is where the factory becomes more than a single-agent tool:
- same-task implementation fanout
- reviewer fanout
- scorecard synthesis
- human winner selection

## Operator Flow (V1)

The V1 user flow should be explicit and teachable:

0. **Install the global CLI**
   - operator runs the published global install command
1. **Initialize the repo-local factory state**
   - operator invokes `init`
   - system scaffolds local factory files, folders, and config stubs as needed
2. **Verify readiness**
   - operator invokes `doctor`
   - system validates setup, surfaces missing prerequisites, and explains next recovery steps
3. **Start with an idea**
   - operator invokes `shape`
   - system produces a shape artifact with goal, constraints, and success criteria
4. **Turn the idea into a buildable plan**
   - operator invokes `plan`
   - system produces implementation tasks, acceptance criteria, and verification plan
5. **Generate multiple candidate prototypes**
   - operator invokes `prototype --variants 3` (or another small count)
   - system creates isolated candidates with differentiated strategy briefs
6. **Inspect and compare candidates**
   - operator reads candidate summaries and verification outputs
7. **Run independent reviewers**
   - operator invokes `review` against one or more candidates
   - system emits separate reviewer artifacts and an aggregated scorecard
8. **Run QA on the likely winner**
   - operator invokes `qa`
   - system validates the candidate through the documented verification path
9. **Choose the winner**
   - human remains the decision boundary for promotion/merge in V1
10. **Capture the learning**
   - operator invokes `retro`
   - system records what should become a new rule, check, rubric, or runbook

This flow is not just documentation; the command surface, artifact contracts, and run directories should make these steps obvious in practice.

## DevEx Requirements

The software factory should feel usable by a first-time operator, not only architecturally correct.

V1 DevEx expectations:
- one obvious install path for a first-time operator
- that install path should prefer a **global npm CLI install** for the operator-facing command when practical
- one obvious command path per stage
- predictable output locations
- receipts/status visible without spelunking
- errors that explain the next recovery step
- examples in docs and templates that match the real command surface
- command names and flags that map cleanly to the operator’s mental model
- an install/setup flow that ends with a runnable `doctor` check, not just dependency installation

A factory that is technically powerful but awkward to operate fails the product goal.

## Risks / Trade-offs

- **Worktree-only isolation may be insufficient** for runs that need stronger dependency or secret separation.
  - Mitigation: keep a runtime adapter seam from day one.
- **Parallel candidate generation increases review load.**
  - Mitigation: cap candidate count, keep reviewers structured, require scorecards.
- **A thin core can become underpowered if the file contracts are vague.**
  - Mitigation: make workflows and artifacts highly explicit.
- **Too many early abstractions could recreate platform complexity before the loop is validated.**
  - Mitigation: defer hosted control plane, remote scheduling, and advanced memory systems.
- **Reviewers may disagree or overfit their own rubrics.**
  - Mitigation: preserve all reviewer artifacts and keep human selection at the promotion boundary.

## Open Questions

These are intentionally left for review before implementation, not silently decided in code:

1. Which Sandcastle ideas do we want to copy first in V1 beyond the already-agreed thin orchestrator + sandbox seam + branch discipline?
2. What is the right candidate scorecard weighting between correctness, design quality, and implementation simplicity?
3. What is the first real dogfood workload we will use to validate the system before broadening the command surface?

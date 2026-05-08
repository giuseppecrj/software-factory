## Context

Research across the local wiki and adjacent public-reference cluster points to a consistent software-factory architecture:

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
- Keep runtime/execution isolation abstract enough that the repo can grow into stronger sandbox backends later without changing the workflow model.
- Keep V1 composable and Pi-like: a small stable core with most domain behavior living in files and modular handlers.

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

### Layer 4: Execution isolation layer

V1 isolation uses git worktrees. The architecture should retain a runtime interface so heavier sandbox providers can be introduced later.

### Layer 5: Fanout / aggregation layer

This is where the factory becomes more than a single-agent tool:
- same-task implementation fanout
- reviewer fanout
- scorecard synthesis
- human winner selection

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

1. Should V1 use only worktrees, or should it ship with an optional stronger runtime adapter immediately?
2. How many built-in reviewer profiles are enough for V1 without becoming a role zoo?
3. Should `prototype --variants N` generate differentiated strategy briefs automatically, or should the user provide strategy labels explicitly?
4. What is the right candidate scorecard weighting between correctness, design quality, and implementation simplicity?
5. What is the first real dogfood workload we will use to validate the system before broadening the command surface?

## ADDED Requirements

### Requirement: Software-factory command loop
The repo SHALL provide a CLI-driven software-factory surface that separates bootstrap commands from workflow commands.

#### Scenario: Operator installs and uses the factory
- **WHEN** an operator wants to install, initialize, validate, and then use the factory
- **THEN** the repo exposes bootstrap commands for `init` and `doctor`
- **AND** the repo exposes workflow commands for `shape`, `plan`, `prototype`, `review`, `qa`, and `retro`
- **AND** each workflow stage writes a durable artifact or receipt rather than relying only on ephemeral chat state
- **AND** the command surface is scriptable and inspectable from the terminal

### Requirement: First-time operator flow is explicit
The repo SHALL document and reflect a step-by-step operator flow from installation and initialization through winner selection and retro.

#### Scenario: First-time user wants to test an idea
- **WHEN** a first-time operator wants to use the factory to explore an idea
- **THEN** the repo explains the order of steps from install to `retro`
- **AND** the documented flow matches the actual command surface and artifact outputs
- **AND** the operator does not need tribal knowledge to understand how to initialize the repo, validate readiness, create candidates, review them, and choose a winner

### Requirement: Harness-ready repo substrate
The repo SHALL be runnable, accessible, and verifiable by an agent using documented entrypoints and file maps.

#### Scenario: Agent enters the repo cold
- **WHEN** an agent starts from repo root without prior conversational context
- **THEN** it can discover the repo map, architecture docs, and workflow files from documented root files
- **AND** it can run deterministic check/test entrypoints without guessing the commands
- **AND** it can locate the files needed to execute a factory stage without grep-heavy wandering

### Requirement: Durable run artifacts
The repo SHALL persist run-scoped artifacts and receipts for each factory stage.

#### Scenario: Factory run completes or fails
- **WHEN** any stage of the factory loop runs
- **THEN** the system writes a run-scoped artifact or receipt describing the outcome
- **AND** the artifacts remain available for later inspection, replay, or review
- **AND** the result does not depend on hidden in-memory state alone

### Requirement: Strong operator DevEx
The repo SHALL prioritize a clear operator experience for installing the system, discovering commands, understanding outputs, and recovering from failures.

#### Scenario: Operator installs the software factory for the first time
- **WHEN** a first-time operator follows the documented install/setup path
- **THEN** the repo provides one obvious sequence for installing dependencies, bootstrapping required local files, and running a `doctor` check
- **AND** the preferred operator-facing install path is a global npm CLI install when practical for the package shape
- **AND** the operator can confirm the factory is ready before attempting a real prototype run
- **AND** setup does not require reading internal source files to discover missing steps

#### Scenario: Operator runs a factory command incorrectly or encounters failure
- **WHEN** an operator invokes a factory command with missing inputs or a run fails mid-flow
- **THEN** the system surfaces an error that explains what went wrong and what recovery step to take next
- **AND** output locations, status artifacts, and next actions are easy to discover
- **AND** the human-facing UX remains legible without sacrificing machine-readability for agents

## ADDED Requirements

### Requirement: Software-factory command loop
The repo SHALL provide a CLI-driven software-factory loop that supports the stages `shape`, `plan`, `prototype`, `review`, `qa`, and `retro` as explicit commands or equivalent subcommands.

#### Scenario: Operator runs the factory loop for a new idea
- **WHEN** an operator wants to turn a new idea into a prototype through the factory
- **THEN** the repo exposes one explicit command path for each stage `shape`, `plan`, `prototype`, `review`, `qa`, and `retro`
- **AND** each stage writes a durable artifact or receipt rather than relying only on ephemeral chat state
- **AND** the command surface is scriptable and inspectable from the terminal

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

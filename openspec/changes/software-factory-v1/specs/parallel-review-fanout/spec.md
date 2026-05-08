## ADDED Requirements

### Requirement: Parallel independent reviewer fanout
The repo SHALL support running independent reviewer passes over candidate prototype outputs.

#### Scenario: Operator wants multiple reviewer perspectives on candidate branches
- **WHEN** one or more prototype candidates are available for evaluation
- **THEN** the system can run multiple reviewer passes independently against those candidates
- **AND** reviewer outputs are recorded separately rather than merged into one opaque verdict
- **AND** reviewers do not need to coordinate peer-to-peer to produce a useful result

### Requirement: Reviewer outputs are read-only by default
V1 reviewer fanout SHALL preserve candidate comparability by keeping reviewers read-only unless an explicit future mode says otherwise.

#### Scenario: Reviewer inspects a candidate branch
- **WHEN** a reviewer evaluates a candidate in V1
- **THEN** the default reviewer behavior produces comments, findings, scores, or recommendations
- **AND** it does not silently rewrite the candidate as part of the review pass
- **AND** any future mutating review mode would need to be explicitly requested and documented separately

### Requirement: Scorecard aggregation
The repo SHALL aggregate reviewer outputs into a scorecard suitable for human selection of a winning candidate.

#### Scenario: Human chooses the best prototype branch
- **WHEN** reviewer passes complete for one or more candidates
- **THEN** the system emits a scorecard or equivalent summary that surfaces strengths, blockers, and recommendation per candidate
- **AND** the human can inspect the underlying reviewer artifacts before choosing a winner
- **AND** promotion or merge remains a distinct decision boundary rather than an implicit side effect of review

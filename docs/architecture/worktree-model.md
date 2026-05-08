# Worktree Model

## V1 isolation

Use one git worktree per candidate or reviewer run.

Benefits:
- isolated filesystem state
- easy inspection and discard
- local-first debugging
- branch/worktree identity for each result artifact

## Rule

Do not allow multiple implementation workers to share a mutable checkout.

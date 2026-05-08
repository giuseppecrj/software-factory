# Recover a Stuck Run

1. Inspect the latest run receipt and logs.
2. Re-run `sf doctor`.
3. Identify whether the failure is:
   - missing prerequisite
   - bad worktree state
   - missing artifact
   - failed verification
4. Repair the substrate before retrying the run.

Never continue the factory loop if the substrate itself is broken.

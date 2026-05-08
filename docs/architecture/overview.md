# Architecture Overview

`software-factory` is a lean software factory with five layers:

1. **Repo law / harness-ready substrate**
   - docs, scripts, layout, runbooks
2. **Workflow / skill / template layer**
   - file-driven behavior
3. **Thin CLI / harness layer**
   - `sf` bootstrap + workflow commands
4. **Execution isolation layer**
   - V1 uses git worktrees
5. **Fanout / aggregation layer**
   - candidate generation, review fanout, scorecard, winner selection

## V1 stance

- Borrow Sandcastle's model, do not depend on it directly.
- Be Pi-like in core shape: thin, composable, extension-first.
- Keep DevEx first-class.

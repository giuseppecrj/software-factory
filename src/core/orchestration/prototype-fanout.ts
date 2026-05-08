import { join } from 'node:path'
import { createWorktree } from '../worktree'
import { writeJson, writeText } from '../artifacts'
import type { CandidateResult, PlanArtifact, StrategyLabel } from '../types'

const strategies: StrategyLabel[] = ['conservative', 'balanced', 'ambitious']

export function generateStrategies(variants: number): StrategyLabel[] {
  const out: StrategyLabel[] = []
  for (let i = 0; i < variants; i++) out.push(strategies[i % strategies.length])
  return out
}

export async function createCandidates(root: string, runId: string, plan: PlanArtifact, variants: number) {
  const chosen = generateStrategies(variants)
  const results: CandidateResult[] = []
  const variantsDir = join(root, 'runs', 'completed', runId, 'variants')
  for (let i = 0; i < chosen.length; i++) {
    const candidateId = `candidate-${i + 1}`
    const strategy = chosen[i]
    const branch = `sf/${runId}/${candidateId}`
    const worktreePath = await createWorktree(root, branch, `${runId}-${candidateId}`)
    const summary = `${strategy} strategy for goal: ${plan.goal}`
    const result: CandidateResult = {
      runId,
      candidateId,
      strategy,
      branch,
      worktreePath,
      summary,
      verification: {
        checksRun: ['planned-only'],
        status: 'pending',
      },
    }
    writeJson(join(variantsDir, `${candidateId}.json`), result)
    writeText(join(variantsDir, `${candidateId}.md`), `# ${candidateId}

Strategy: ${strategy}

Summary: ${summary}
`)
    results.push(result)
  }
  return results
}

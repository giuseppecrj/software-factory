import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { createRunId, initRun, saveReceipt, loadJson } from '../core/run-store'
import { writeJson, writeText } from '../core/artifacts'
import type { CandidateResult, RunReceipt } from '../core/types'
import { reviewCandidate, saveReviews } from '../core/orchestration/review-fanout'

export async function runReview(root: string, from: string) {
  const variantsDir = join(root, 'runs', 'completed', from, 'variants')
  if (!existsSync(variantsDir)) throw new Error(`Could not find variants for run '${from}'`)
  const runId = createRunId('review')
  const dir = initRun(root, runId)
  const candidateFiles = readdirSync(variantsDir).filter((x) => x.endsWith('.json'))
  const scorecards: Record<string, unknown> = {}
  for (const file of candidateFiles) {
    const candidate = loadJson<CandidateResult>(join(variantsDir, file))
    const findings = reviewCandidate(candidate)
    scorecards[candidate.candidateId] = saveReviews(root, runId, candidate, findings)
  }
  writeJson(join(dir, 'scorecard.json'), scorecards)
  writeText(join(dir, 'review.md'), `# Review

Reviewed ${candidateFiles.length} candidates.
`)
  const receipt: RunReceipt = {
    runId,
    stage: 'review',
    status: 'success',
    createdAt: new Date().toISOString(),
    summary: `Reviewed ${candidateFiles.length} candidates`,
    artifacts: [join(dir, 'scorecard.json'), join(dir, 'review.md')],
    next: [`sf qa --from ${from} --candidate candidate-1`],
  }
  saveReceipt(root, receipt)
  return { scorecards, receipt }
}

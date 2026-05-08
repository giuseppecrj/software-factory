import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { createRunId, initRun, saveFailureReceipt, saveReceipt, loadJson } from '../core/run-store'
import { writeJson, writeText } from '../core/artifacts'
import { readFactoryText } from '../core/factory-files'
import type { CandidateResult, CandidateScorecard, RunReceipt } from '../core/types'
import { reviewCandidate, saveReviews } from '../core/orchestration/review-fanout'

export async function runReview(root: string, from: string) {
  const variantsDir = join(root, 'runs', 'completed', from, 'variants')
  if (!existsSync(variantsDir)) {
    saveFailureReceipt(root, 'review', `Could not find variants for run '${from}'`, [`sf prototype ${from} --variants 3`])
    throw new Error(`Could not find variants for run '${from}'`)
  }

  let workflow
  try {
    workflow = readFactoryText(root, 'workflows', 'review.md')
    readFactoryText(root, 'templates', 'review-report.md')
    readFactoryText(root, 'templates', 'scorecard.md')
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    saveFailureReceipt(root, 'review', message, ['Restore factory/workflows/review.md, factory/templates/review-report.md, and factory/templates/scorecard.md'])
    throw error
  }

  const runId = createRunId('review')
  const dir = initRun(root, runId)
  const candidateFiles = readdirSync(variantsDir).filter((x) => x.endsWith('.json'))
  const scorecards: Record<string, CandidateScorecard> = {}
  try {
    for (const file of candidateFiles) {
      const candidate = loadJson<CandidateResult>(join(variantsDir, file))
      const findings = reviewCandidate(root, candidate)
      scorecards[candidate.candidateId] = saveReviews(root, runId, candidate, findings)
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    saveFailureReceipt(root, 'review', message, ['Inspect candidate bundle artifacts and review templates'])
    throw error
  }
  writeJson(join(dir, 'scorecard.json'), scorecards)
  writeText(join(dir, 'review.md'), `# Review\n\nWorkflow: ${workflow.path}\n\nReviewed ${candidateFiles.length} candidates.\n`)
  const receipt: RunReceipt = {
    runId,
    stage: 'review',
    status: 'success',
    createdAt: new Date().toISOString(),
    summary: `Reviewed ${candidateFiles.length} candidates`,
    artifacts: [join(dir, 'scorecard.json'), join(dir, 'review.md')],
    next: [`sf qa ${from} --candidate candidate-1`],
  }
  saveReceipt(root, receipt)
  return { scorecards, receipt }
}

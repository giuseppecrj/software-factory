import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { createRunId, initRun, saveFailureReceipt, saveReceipt, loadJson } from '../core/run-store'
import { writeText } from '../core/artifacts'
import { readFactoryText } from '../core/factory-files'
import type { PlanArtifact, RunReceipt } from '../core/types'
import { createCandidates } from '../core/orchestration/prototype-fanout'

export async function runPrototype(root: string, from: string, variants: number) {
  if (variants < 1 || variants > 5) {
    saveFailureReceipt(root, 'prototype', `Variant count must be between 1 and 5; received ${variants}`, ['Retry with --variants 1-5'])
    throw new Error(`Variant count must be between 1 and 5; received ${variants}`)
  }

  const sourcePath = existsSync(join(root, 'runs', 'completed', from, 'plan.json')) ? join(root, 'runs', 'completed', from, 'plan.json') : null
  if (!sourcePath) {
    saveFailureReceipt(root, 'prototype', `Could not find plan.json for run '${from}'`, [`sf plan ${from}`])
    throw new Error(`Could not find plan.json for run '${from}'`)
  }

  const plan = loadJson<PlanArtifact>(sourcePath)
  const runId = createRunId('prototype')
  const dir = initRun(root, runId)

  try {
    readFactoryText(root, 'workflows', 'prototype.md')
    readFactoryText(root, 'templates', 'prototype-brief.md')
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    saveFailureReceipt(root, 'prototype', message, ['Restore factory/workflows/prototype.md and factory/templates/prototype-brief.md'])
    throw error
  }

  let candidates
  try {
    candidates = await createCandidates(root, runId, plan, variants)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    saveFailureReceipt(root, 'prototype', message, ['Inspect factory/workflows/prototype.md, factory/templates/prototype-brief.md, and git worktree state'])
    throw error
  }

  writeText(join(dir, 'prototype.md'), `# Prototype Fanout\n\nGenerated ${candidates.length} candidates from plan ${from}.\n`)
  const receipt: RunReceipt = {
    runId,
    stage: 'prototype',
    status: 'success',
    createdAt: new Date().toISOString(),
    summary: `Generated ${candidates.length} candidates`,
    artifacts: [join(dir, 'prototype.md'), ...candidates.flatMap((candidate) => candidate.artifacts)],
    next: [`sf review ${runId}`],
  }
  saveReceipt(root, receipt)
  return { candidates, receipt }
}

import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { createRunId, initRun, saveReceipt, loadJson } from '../core/run-store'
import { writeText } from '../core/artifacts'
import type { PlanArtifact, RunReceipt } from '../core/types'
import { createCandidates } from '../core/orchestration/prototype-fanout'

export async function runPrototype(root: string, from: string, variants: number) {
  const sourcePath = existsSync(join(root, 'runs', 'completed', from, 'plan.json')) ? join(root, 'runs', 'completed', from, 'plan.json') : null
  if (!sourcePath) throw new Error(`Could not find plan.json for run '${from}'`)
  const plan = loadJson<PlanArtifact>(sourcePath)
  const runId = createRunId('prototype')
  const dir = initRun(root, runId)
  const candidates = await createCandidates(root, runId, plan, variants)
  writeText(join(dir, 'prototype.md'), `# Prototype Fanout

Generated ${candidates.length} candidates from plan ${from}.
`)
  const receipt: RunReceipt = {
    runId,
    stage: 'prototype',
    status: 'success',
    createdAt: new Date().toISOString(),
    summary: `Generated ${candidates.length} candidates`,
    artifacts: [join(dir, 'prototype.md')],
    next: [`sf review --from ${runId}`],
  }
  saveReceipt(root, receipt)
  return { candidates, receipt }
}

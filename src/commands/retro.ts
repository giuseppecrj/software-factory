import { join } from 'node:path'
import { createRunId, initRun, saveReceipt } from '../core/run-store'
import { writeJson, writeText } from '../core/artifacts'
import type { RunReceipt } from '../core/types'

export async function runRetro(root: string, from: string) {
  const runId = createRunId('retro')
  const dir = initRun(root, runId)
  const retro = {
    sourceRunId: from,
    worked: ['artifact-first flow', 'candidate fanout'],
    failed: ['review and QA remain heuristic in early V1'],
    promoteToSystem: {
      rule: 'Add deterministic verification as soon as domain hooks exist',
      check: 'expand sf doctor over time',
      rubric: 'preserve reviewer disagreement explicitly',
      runbook: 'document merge and rollback clearly',
    },
  }
  writeJson(join(dir, 'retro.json'), retro)
  writeText(join(dir, 'retro.md'), `# Retro

## Worked
- artifact-first flow
- candidate fanout

## Promote to system
- rule: Add deterministic verification as soon as domain hooks exist
`)
  const receipt: RunReceipt = {
    runId,
    stage: 'retro',
    status: 'success',
    createdAt: new Date().toISOString(),
    summary: `Captured retro for ${from}`,
    artifacts: [join(dir, 'retro.md'), join(dir, 'retro.json')],
  }
  saveReceipt(root, receipt)
  return { retro, receipt }
}

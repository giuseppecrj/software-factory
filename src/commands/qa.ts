import { join } from 'node:path'
import { createRunId, initRun, saveReceipt } from '../core/run-store'
import { writeJson, writeText } from '../core/artifacts'
import type { RunReceipt } from '../core/types'

export async function runQa(root: string, from: string, candidate: string) {
  const runId = createRunId('qa')
  const dir = initRun(root, runId)
  const report = {
    sourceRunId: from,
    candidate,
    steps: ['verify candidate artifacts exist', 'manual QA hook placeholder'],
    status: 'pending',
    notes: ['QA implementation is scaffolded; domain-specific QA checks can be added later.'],
  }
  writeJson(join(dir, 'qa.json'), report)
  writeText(join(dir, 'qa.md'), `# QA

Candidate: ${candidate}

Status: pending
`)
  const receipt: RunReceipt = {
    runId,
    stage: 'qa',
    status: 'success',
    createdAt: new Date().toISOString(),
    summary: `Created QA report for ${candidate}`,
    artifacts: [join(dir, 'qa.md'), join(dir, 'qa.json')],
    next: [`sf retro --from ${from}`],
  }
  saveReceipt(root, receipt)
  return { report, receipt }
}

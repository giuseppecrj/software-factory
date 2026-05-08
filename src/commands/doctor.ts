import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { createRunId, saveReceipt } from '../core/run-store'
import type { RunReceipt } from '../core/types'

export async function runDoctor(root: string) {
  const checks = ['AGENTS.md', 'ETHOS.md', 'ROUTING.md', 'DESIGN.md', 'docs/architecture/overview.md', 'docs/architecture/operator-flow.md']
  const missing = checks.filter((p) => !existsSync(join(root, p)))
  const ok = missing.length === 0
  const runId = createRunId('doctor')
  const receipt: RunReceipt = {
    runId,
    stage: 'doctor',
    status: ok ? 'success' : 'failure',
    createdAt: new Date().toISOString(),
    summary: ok ? 'Factory ready for initial implementation slice' : `Missing files: ${missing.join(', ')}`,
    artifacts: [],
    next: ok ? ['sf shape "your idea"'] : ['Fix missing files and rerun sf doctor'],
  }
  saveReceipt(root, receipt)
  return { ok, missing, receipt }
}

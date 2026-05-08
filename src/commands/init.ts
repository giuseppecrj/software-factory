import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { createRunId, saveReceipt } from '../core/run-store'
import type { RunReceipt } from '../core/types'

export async function runInit(root: string) {
  for (const part of [
    '.sf/worktrees',
    'factory/workflows',
    'factory/skills/product',
    'factory/skills/implementation',
    'factory/skills/review',
    'factory/skills/learning',
    'factory/templates',
    'runs/requests', 'runs/active', 'runs/completed', 'runs/reviews', 'runs/receipts',
    'src/commands', 'src/core', 'src/core/orchestration',
    'tests/core', 'tests/commands', 'tests/fixtures',
  ]) mkdirSync(join(root, part), { recursive: true })
  const runId = createRunId('init')
  const receipt: RunReceipt = {
    runId,
    stage: 'init',
    status: 'success',
    createdAt: new Date().toISOString(),
    summary: 'Initialized repo-local factory state',
    artifacts: [],
    next: ['sf doctor'],
  }
  saveReceipt(root, receipt)
  return receipt
}

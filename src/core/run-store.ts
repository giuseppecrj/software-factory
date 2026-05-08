import { existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { receiptPath, runDir, writeJson } from './artifacts'
import type { RunReceipt, Stage } from './types'

export function createRunId(prefix: string) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19)
  const rand = Math.random().toString(36).slice(2, 8)
  return `${prefix}-${stamp}-${rand}`
}

export function ensureRunRoots(root: string) {
  for (const part of [
    'runs/requests',
    'runs/active',
    'runs/completed',
    'runs/reviews',
    'runs/receipts',
  ]) mkdirSync(join(root, part), { recursive: true })
}

export function initRun(root: string, runId: string) {
  ensureRunRoots(root)
  mkdirSync(runDir(root, runId), { recursive: true })
  return runDir(root, runId)
}

export function saveReceipt(root: string, receipt: RunReceipt) {
  ensureRunRoots(root)
  writeJson(receiptPath(root, receipt.runId, receipt.stage), receipt)
}

export function saveFailureReceipt(root: string, stage: Stage, summary: string, next: string[] = []) {
  const receipt: RunReceipt = {
    runId: createRunId(stage),
    stage,
    status: 'failure',
    createdAt: new Date().toISOString(),
    summary,
    artifacts: [],
    next,
  }
  saveReceipt(root, receipt)
  return receipt
}

export function latestRunIds(root: string) {
  const dir = join(root, 'runs', 'completed')
  if (!existsSync(dir)) return []
  return readdirSync(dir).sort().reverse()
}

export function loadJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf8')) as T
}

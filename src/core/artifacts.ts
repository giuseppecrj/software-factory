import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

export function ensureDir(path: string) {
  mkdirSync(path, { recursive: true })
}

export function writeText(path: string, content: string) {
  ensureDir(dirname(path))
  writeFileSync(path, content, 'utf8')
}

export function writeJson(path: string, value: unknown) {
  writeText(path, JSON.stringify(value, null, 2) + '\n')
}

export function runDir(root: string, runId: string) {
  return join(root, 'runs', 'completed', runId)
}

export function receiptPath(root: string, runId: string, stage: string) {
  return join(root, 'runs', 'receipts', `${runId}-${stage}.json`)
}

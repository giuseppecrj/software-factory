import { expect, test } from 'bun:test'
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, readdirSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { runShape } from '../../src/commands/shape'
import { runPlan } from '../../src/commands/plan'

function seed(root: string) {
  writeFileSync(join(root, 'AGENTS.md'), '')
  writeFileSync(join(root, 'ETHOS.md'), '')
  writeFileSync(join(root, 'ROUTING.md'), '')
  writeFileSync(join(root, 'DESIGN.md'), '')
  mkdirSync(join(root, 'docs/architecture'), { recursive: true })
  writeFileSync(join(root, 'docs/architecture/overview.md'), '')
  writeFileSync(join(root, 'docs/architecture/operator-flow.md'), '')
  mkdirSync(join(root, 'factory/workflows'), { recursive: true })
  mkdirSync(join(root, 'factory/templates'), { recursive: true })
  writeFileSync(join(root, 'factory/workflows/shape.md'), '# shape\n')
  writeFileSync(join(root, 'factory/workflows/plan.md'), '# plan\n')
  writeFileSync(join(root, 'factory/templates/shape.md'), '# Shape\n\nIdea: {{idea}}\n')
  writeFileSync(join(root, 'factory/templates/implementation-plan.md'), '# Implementation Plan\n\nGoal: {{goal}}\n')
}

test('shape followed by plan writes durable artifacts and positional next steps', async () => {
  const root = mkdtempSync(join(tmpdir(), 'sf-shape-plan-'))
  seed(root)
  const shape = await runShape(root, 'test idea')
  const plan = await runPlan(root, shape.artifact.runId)
  expect(existsSync(join(root, 'runs/completed', shape.artifact.runId, 'shape.json'))).toBe(true)
  expect(existsSync(join(root, 'runs/completed', plan.artifact.runId, 'plan.json'))).toBe(true)
  expect(shape.receipt.next).toEqual([`sf plan ${shape.artifact.runId}`])
  expect(plan.receipt.next).toEqual([`sf prototype ${plan.artifact.runId} --variants 3`])
})

test('shape persists a failure receipt when required factory files are missing', async () => {
  const root = mkdtempSync(join(tmpdir(), 'sf-shape-missing-assets-'))
  writeFileSync(join(root, 'AGENTS.md'), '')
  writeFileSync(join(root, 'ETHOS.md'), '')
  writeFileSync(join(root, 'ROUTING.md'), '')
  writeFileSync(join(root, 'DESIGN.md'), '')
  mkdirSync(join(root, 'docs/architecture'), { recursive: true })
  writeFileSync(join(root, 'docs/architecture/overview.md'), '')
  writeFileSync(join(root, 'docs/architecture/operator-flow.md'), '')

  await expect(runShape(root, 'test idea')).rejects.toThrow('Missing factory')

  const receipts = readdirSync(join(root, 'runs/receipts'))
  const failureReceipt = receipts
    .map((name) => readFileSync(join(root, 'runs/receipts', name), 'utf8'))
    .find((content) => content.includes('"stage": "shape"') && content.includes('"status": "failure"'))

  expect(failureReceipt).toBeDefined()
})

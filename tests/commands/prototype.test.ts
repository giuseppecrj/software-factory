import { expect, test } from 'bun:test'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { runShape } from '../../src/commands/shape'
import { runPlan } from '../../src/commands/plan'
import { runPrototype } from '../../src/commands/prototype'
import { createSeedRepo } from '../fixtures/repo'

test('prototype persists a failure receipt when the source plan is missing', async () => {
  const root = await createSeedRepo('sf-prototype-missing-')

  await expect(runPrototype(root, 'missing-run', 2)).rejects.toThrow("Could not find plan.json")

  const receipts = readdirSync(join(root, 'runs/receipts'))
  const failureReceipt = receipts
    .map((name) => readFileSync(join(root, 'runs/receipts', name), 'utf8'))
    .find((content) => content.includes('"stage": "prototype"') && content.includes('"status": "failure"'))

  expect(failureReceipt).toBeDefined()
  expect(failureReceipt).toContain('missing-run')
})

test('prototype creates candidate bundles with explicit artifacts and positional next steps', async () => {
  const root = await createSeedRepo('sf-prototype-bundle-')
  const shape = await runShape(root, 'test idea')
  const plan = await runPlan(root, shape.artifact.runId)
  const result = await runPrototype(root, plan.artifact.runId, 2)

  expect(result.receipt.next).toEqual([`sf review ${result.receipt.runId}`])
  expect(result.candidates).toHaveLength(2)

  const candidate = result.candidates[0]
  expect(candidate.sourcePlanRunId).toBe(plan.artifact.runId)
  expect(candidate.workflowPath).toContain('factory/workflows/prototype.md')
  expect(candidate.templatePath).toContain('factory/templates/prototype-brief.md')
  expect(existsSync(candidate.strategyBriefPath)).toBe(true)
  expect(existsSync(candidate.verification.reportPath)).toBe(true)
  expect(existsSync(candidate.verification.detailsPath)).toBe(true)
})

test('prototype persists a failure receipt when workflow assets are missing', async () => {
  const root = await createSeedRepo('sf-prototype-missing-assets-')
  const shape = await runShape(root, 'test idea')
  const plan = await runPlan(root, shape.artifact.runId)

  Bun.write(join(root, 'factory/workflows/prototype.md'), '')
  await Bun.file(join(root, 'factory/workflows/prototype.md')).delete()

  await expect(runPrototype(root, plan.artifact.runId, 2)).rejects.toThrow('Missing factory')

  const receipts = readdirSync(join(root, 'runs/receipts'))
  const failureReceipt = receipts
    .map((name) => readFileSync(join(root, 'runs/receipts', name), 'utf8'))
    .find((content) => content.includes('"stage": "prototype"') && content.includes('"status": "failure"'))

  expect(failureReceipt).toBeDefined()
})

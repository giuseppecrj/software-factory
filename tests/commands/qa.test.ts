import { expect, test } from 'bun:test'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { runShape } from '../../src/commands/shape'
import { runPlan } from '../../src/commands/plan'
import { runPrototype } from '../../src/commands/prototype'
import { runQa } from '../../src/commands/qa'
import { createSeedRepo } from '../fixtures/repo'

test('qa fails with a failure receipt when the candidate bundle is missing', async () => {
  const root = await createSeedRepo('sf-qa-missing-candidate-')
  const shape = await runShape(root, 'test idea')
  const plan = await runPlan(root, shape.artifact.runId)
  const prototype = await runPrototype(root, plan.artifact.runId, 2)

  await expect(runQa(root, prototype.receipt.runId, 'candidate-99')).rejects.toThrow("Could not find candidate bundle")

  const receipts = readdirSync(join(root, 'runs/receipts'))
  const failureReceipt = receipts
    .map((name) => readFileSync(join(root, 'runs/receipts', name), 'utf8'))
    .find((content) => content.includes('"stage": "qa"') && content.includes('"status": "failure"'))

  expect(failureReceipt).toBeDefined()
})

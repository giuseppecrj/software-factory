import { expect, test } from 'bun:test'
import { readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { runShape } from '../../src/commands/shape'
import { runPlan } from '../../src/commands/plan'
import { runPrototype } from '../../src/commands/prototype'
import { runReview } from '../../src/commands/review'
import { createSeedRepo } from '../fixtures/repo'

test('review persists a failure receipt when prototype variants are missing', async () => {
  const root = await createSeedRepo('sf-review-missing-')

  await expect(runReview(root, 'missing-run')).rejects.toThrow("Could not find variants")

  const receipts = readdirSync(join(root, 'runs/receipts'))
  const failureReceipt = receipts
    .map((name) => readFileSync(join(root, 'runs/receipts', name), 'utf8'))
    .find((content) => content.includes('"stage": "review"') && content.includes('"status": "failure"'))

  expect(failureReceipt).toBeDefined()
  expect(failureReceipt).toContain('missing-run')
})

test('review aggregates strengths and preserves reviewer artifacts per candidate', async () => {
  const root = await createSeedRepo('sf-review-scorecard-')
  const shape = await runShape(root, 'test idea')
  const plan = await runPlan(root, shape.artifact.runId)
  const prototype = await runPrototype(root, plan.artifact.runId, 2)
  const review = await runReview(root, prototype.receipt.runId)

  expect(review.receipt.next).toEqual([`sf qa ${prototype.receipt.runId} --candidate candidate-1`])
  const candidateScorecard = review.scorecards['candidate-1'] as { strengths: string[]; reviewerArtifacts: string[] }
  expect(candidateScorecard.strengths.length).toBeGreaterThan(0)
  expect(candidateScorecard.reviewerArtifacts.length).toBe(6)
})

test('review degrades gracefully for older candidate bundles without new artifact fields', async () => {
  const root = await createSeedRepo('sf-review-legacy-bundle-')
  mkdirSync(join(root, 'runs/completed/prototype-legacy/variants'), { recursive: true })
  writeFileSync(
    join(root, 'runs/completed/prototype-legacy/variants/candidate-1.json'),
    JSON.stringify({
      runId: 'prototype-legacy',
      candidateId: 'candidate-1',
      strategy: 'balanced',
      branch: 'sf/prototype-legacy/candidate-1',
      worktreePath: '/tmp/legacy',
      summary: 'legacy candidate',
      verification: { checksRun: ['planned-only'], status: 'pending' },
    }),
  )

  const review = await runReview(root, 'prototype-legacy')
  const candidateScorecard = review.scorecards['candidate-1'] as { blockers: string[] }
  expect(candidateScorecard.blockers).toContain('missing strategy brief')
})

test('review persists a failure receipt when review workflow assets are missing', async () => {
  const root = await createSeedRepo('sf-review-missing-assets-')
  const shape = await runShape(root, 'test idea')
  const plan = await runPlan(root, shape.artifact.runId)
  const prototype = await runPrototype(root, plan.artifact.runId, 2)

  await Bun.file(join(root, 'factory/templates/review-report.md')).delete()
  await expect(runReview(root, prototype.receipt.runId)).rejects.toThrow('Missing factory')

  const receipts = readdirSync(join(root, 'runs/receipts'))
  const failureReceipt = receipts
    .map((name) => readFileSync(join(root, 'runs/receipts', name), 'utf8'))
    .find((content) => content.includes('"stage": "review"') && content.includes('"status": "failure"'))

  expect(failureReceipt).toBeDefined()
})

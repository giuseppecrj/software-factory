import { expect, test } from 'bun:test'
import { mkdtempSync, mkdirSync, writeFileSync, existsSync } from 'node:fs'
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
}

test('shape followed by plan writes durable artifacts', async () => {
  const root = mkdtempSync(join(tmpdir(), 'sf-shape-plan-'))
  seed(root)
  const shape = await runShape(root, 'test idea')
  const plan = await runPlan(root, shape.artifact.runId)
  expect(existsSync(join(root, 'runs/completed', shape.artifact.runId, 'shape.json'))).toBe(true)
  expect(existsSync(join(root, 'runs/completed', plan.artifact.runId, 'plan.json'))).toBe(true)
})

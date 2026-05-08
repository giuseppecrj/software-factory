import { expect, test } from 'bun:test'
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { runDoctor } from '../../src/commands/doctor'

test('doctor fails when required files are missing', async () => {
  const root = mkdtempSync(join(tmpdir(), 'sf-doctor-'))
  const result = await runDoctor(root)
  expect(result.ok).toBe(false)
})

test('doctor passes when required files exist', async () => {
  const root = mkdtempSync(join(tmpdir(), 'sf-doctor-ok-'))
  writeFileSync(join(root, 'AGENTS.md'), '')
  writeFileSync(join(root, 'ETHOS.md'), '')
  writeFileSync(join(root, 'ROUTING.md'), '')
  writeFileSync(join(root, 'DESIGN.md'), '')
  mkdirSync(join(root, 'docs/architecture'), { recursive: true })
  writeFileSync(join(root, 'docs/architecture/overview.md'), '')
  writeFileSync(join(root, 'docs/architecture/operator-flow.md'), '')
  const result = await runDoctor(root)
  expect(result.ok).toBe(true)
})

import { expect, test } from 'bun:test'
import { mkdtempSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { runInit } from '../../src/commands/init'

test('init creates local factory structure', async () => {
  const root = mkdtempSync(join(tmpdir(), 'sf-init-'))
  const result = await runInit(root)
  expect(result.stage).toBe('init')
  expect(existsSync(join(root, 'factory/workflows'))).toBe(true)
  expect(existsSync(join(root, 'runs/completed'))).toBe(true)
})

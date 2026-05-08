import { expect, test } from 'bun:test'
import { createRunId } from '../../src/core/run-store'

test('createRunId uses prefix', () => {
  const id = createRunId('shape')
  expect(id.startsWith('shape-')).toBe(true)
})

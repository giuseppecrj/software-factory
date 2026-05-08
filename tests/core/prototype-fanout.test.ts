import { expect, test } from 'bun:test'
import { generateStrategies } from '../../src/core/orchestration/prototype-fanout'

test('generateStrategies cycles through default set', () => {
  expect(generateStrategies(3)).toEqual(['conservative', 'balanced', 'ambitious'])
  expect(generateStrategies(5)).toEqual(['conservative', 'balanced', 'ambitious', 'conservative', 'balanced'])
})

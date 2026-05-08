import { expect, test } from 'bun:test'
import { scoreCandidate } from '../../src/core/scoring'

test('scoreCandidate aggregates blockers and score', () => {
  const result = scoreCandidate([
    { reviewer: 'spec-fit', score: 8, strengths: [], blockers: [], recommendation: 'ok' },
    { reviewer: 'architecture', score: 6, strengths: [], blockers: ['x'], recommendation: 'fix' },
    { reviewer: 'qa-signal', score: 7, strengths: [], blockers: [], recommendation: 'ok' },
  ])
  expect(result.blockers.length).toBe(1)
  expect(result.averageScore).toBeGreaterThan(0)
})

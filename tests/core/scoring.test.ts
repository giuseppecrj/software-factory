import { expect, test } from 'bun:test'
import { scoreCandidate } from '../../src/core/scoring'

test('scoreCandidate aggregates blockers, strengths, and score', () => {
  const result = scoreCandidate([
    { reviewer: 'spec-fit', score: 8, strengths: ['clear scope'], blockers: [], recommendation: 'ok' },
    { reviewer: 'architecture', score: 6, strengths: ['small surface'], blockers: ['x'], recommendation: 'fix' },
    { reviewer: 'qa-signal', score: 7, strengths: ['visible verification'], blockers: [], recommendation: 'ok' },
  ])
  expect(result.blockers.length).toBe(1)
  expect(result.strengths).toEqual(['clear scope', 'small surface', 'visible verification'])
  expect(result.averageScore).toBeGreaterThan(0)
})

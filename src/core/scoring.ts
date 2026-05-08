import type { ReviewFinding } from './types'

export function average(nums: number[]) {
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0
}

export function scoreCandidate(findings: ReviewFinding[]) {
  const avg = average(findings.map((x) => x.score))
  const blockers = findings.flatMap((x) => x.blockers)
  return {
    averageScore: Number(avg.toFixed(2)),
    blockers,
    recommendation: blockers.length ? 'needs work' : avg >= 8 ? 'recommended' : 'consider',
  }
}

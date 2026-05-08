import { join } from 'node:path'
import { writeJson, writeText } from '../artifacts'
import { scoreCandidate } from '../scoring'
import type { CandidateResult, ReviewFinding } from '../types'

const reviewerProfiles = ['spec-fit', 'architecture', 'qa-signal'] as const

export function reviewCandidate(candidate: CandidateResult): ReviewFinding[] {
  const base = candidate.strategy === 'balanced' ? 8 : candidate.strategy === 'conservative' ? 7 : 6
  return reviewerProfiles.map((reviewer, index) => ({
    reviewer,
    score: Math.max(1, Math.min(10, base - (reviewer === 'qa-signal' && candidate.verification.status === 'failed' ? 3 : 0) + (index === 1 ? 0.5 : 0))),
    strengths: [`${reviewer} sees ${candidate.strategy} strategy as readable`],
    blockers: candidate.verification.status === 'failed' ? ['verification failed'] : [],
    recommendation: candidate.verification.status === 'failed' ? 'fix verification' : 'acceptable',
  }))
}

export function saveReviews(root: string, runId: string, candidate: CandidateResult, findings: ReviewFinding[]) {
  const dir = join(root, 'runs', 'reviews', runId, candidate.candidateId)
  for (const finding of findings) {
    writeJson(join(dir, `${finding.reviewer}.json`), finding)
    writeText(join(dir, `${finding.reviewer}.md`), `# ${finding.reviewer}

Score: ${finding.score}

Recommendation: ${finding.recommendation}
`)
  }
  const scorecard = scoreCandidate(findings)
  writeJson(join(root, 'runs', 'reviews', runId, `${candidate.candidateId}-scorecard.json`), scorecard)
  return scorecard
}

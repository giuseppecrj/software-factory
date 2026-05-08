import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { writeJson, writeText } from '../artifacts'
import { readFactoryText, renderTemplate } from '../factory-files'
import { scoreCandidate } from '../scoring'
import type { CandidateResult, CandidateScorecard, ReviewFinding } from '../types'

const reviewerProfiles = ['spec-fit', 'architecture', 'qa-signal'] as const

export function reviewCandidate(root: string, candidate: CandidateResult): ReviewFinding[] {
  const brief = existsSync(candidate.strategyBriefPath) ? readFileSync(candidate.strategyBriefPath, 'utf8') : ''
  const verificationExists = existsSync(candidate.verification.detailsPath)
  const verification = verificationExists ? readFileSync(candidate.verification.detailsPath, 'utf8') : ''
  const base = candidate.strategy === 'balanced' ? 8 : candidate.strategy === 'conservative' ? 7 : 6
  const missingBundlePenalty = brief ? 0 : 2
  const verificationPenalty = candidate.verification.status === 'failed' ? 3 : candidate.verification.status === 'pending' ? 1 : 0

  return reviewerProfiles.map((reviewer, index) => {
    const blockers = [] as string[]
    if (!brief) blockers.push('missing strategy brief')
    if (!verificationExists) blockers.push('missing verification details')
    if (candidate.verification.status === 'failed') blockers.push('verification failed')

    return {
      reviewer,
      score: Math.max(1, Math.min(10, base - missingBundlePenalty - verificationPenalty + (index === 1 ? 0.5 : 0))),
      strengths: [
        `${reviewer} reviewed candidate bundle artifacts`,
        brief ? `brief captured for ${candidate.strategy} strategy` : 'bundle missing brief content',
        verification ? candidate.verification.summary : 'verification details not available',
      ],
      blockers,
      recommendation: blockers.length ? 'fix bundle gaps' : 'acceptable',
    }
  })
}

export function saveReviews(root: string, runId: string, candidate: CandidateResult, findings: ReviewFinding[]): CandidateScorecard {
  const dir = join(root, 'runs', 'reviews', runId, candidate.candidateId)
  const reviewTemplate = readFactoryText(root, 'templates', 'review-report.md')
  const scorecardTemplate = readFactoryText(root, 'templates', 'scorecard.md')
  const reviewerArtifacts: string[] = []

  for (const finding of findings) {
    const jsonPath = join(dir, `${finding.reviewer}.json`)
    const mdPath = join(dir, `${finding.reviewer}.md`)
    writeJson(jsonPath, finding)
    writeText(
      mdPath,
      `${renderTemplate(reviewTemplate.content, { candidate: candidate.candidateId, reviewer: finding.reviewer })}\n\nScore: ${finding.score}\nRecommendation: ${finding.recommendation}\n\nStrengths:\n${finding.strengths.map((x) => `- ${x}`).join('\n')}\n\nBlockers:\n${finding.blockers.length ? finding.blockers.map((x) => `- ${x}`).join('\n') : '- none'}\n`,
    )
    reviewerArtifacts.push(jsonPath, mdPath)
  }

  const aggregate = scoreCandidate(findings)
  const scorecard: CandidateScorecard = {
    candidateId: candidate.candidateId,
    averageScore: aggregate.averageScore,
    strengths: aggregate.strengths,
    blockers: aggregate.blockers,
    recommendation: aggregate.recommendation,
    reviewerArtifacts,
  }

  writeJson(join(root, 'runs', 'reviews', runId, `${candidate.candidateId}-scorecard.json`), scorecard)
  writeText(
    join(dir, 'scorecard.md'),
    `${renderTemplate(scorecardTemplate.content, { candidate: candidate.candidateId })}\n\nAverage Score: ${scorecard.averageScore}\nRecommendation: ${scorecard.recommendation}\n\nStrengths:\n${scorecard.strengths.map((x) => `- ${x}`).join('\n')}\n\nBlockers:\n${scorecard.blockers.length ? scorecard.blockers.map((x) => `- ${x}`).join('\n') : '- none'}\n`,
  )

  return scorecard
}

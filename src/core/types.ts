export type Stage =
  | 'init'
  | 'doctor'
  | 'shape'
  | 'plan'
  | 'prototype'
  | 'review'
  | 'qa'
  | 'retro'

export type RunStatus = 'success' | 'failure'

export type RunReceipt = {
  runId: string
  stage: Stage
  status: RunStatus
  createdAt: string
  summary: string
  artifacts: string[]
  next?: string[]
}

export type ShapeArtifact = {
  runId: string
  idea: string
  goal: string
  constraints: string[]
  successCriteria: string[]
}

export type PlanArtifact = {
  runId: string
  sourceRunId?: string
  goal: string
  acceptanceCriteria: string[]
  verificationPlan: string[]
  tasks: string[]
}

export type StrategyLabel = 'conservative' | 'balanced' | 'ambitious'

export type CandidateResult = {
  runId: string
  sourcePlanRunId: string
  candidateId: string
  strategy: StrategyLabel
  branch: string
  worktreePath: string
  bundleDir: string
  workflowPath: string
  templatePath: string
  strategyBriefPath: string
  artifacts: string[]
  summary: string
  verification: {
    checksRun: string[]
    status: 'pending' | 'passed' | 'failed'
    summary: string
    reportPath: string
    detailsPath: string
  }
}

export type ReviewFinding = {
  reviewer: 'spec-fit' | 'architecture' | 'qa-signal'
  score: number
  strengths: string[]
  blockers: string[]
  recommendation: string
}

export type CandidateScorecard = {
  candidateId: string
  averageScore: number
  strengths: string[]
  blockers: string[]
  recommendation: string
  reviewerArtifacts: string[]
}

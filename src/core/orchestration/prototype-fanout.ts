import { join } from 'node:path'
import { createWorktree } from '../worktree'
import { writeJson, writeText } from '../artifacts'
import { readFactoryText, renderTemplate } from '../factory-files'
import type { CandidateResult, PlanArtifact, StrategyLabel } from '../types'

const strategies: StrategyLabel[] = ['conservative', 'balanced', 'ambitious']

export function generateStrategies(variants: number): StrategyLabel[] {
  const out: StrategyLabel[] = []
  for (let i = 0; i < variants; i++) out.push(strategies[i % strategies.length])
  return out
}

export async function createCandidates(root: string, runId: string, plan: PlanArtifact, variants: number) {
  const chosen = generateStrategies(variants)
  const results: CandidateResult[] = []
  const variantsDir = join(root, 'runs', 'completed', runId, 'variants')
  const workflow = readFactoryText(root, 'workflows', 'prototype.md')
  const template = readFactoryText(root, 'templates', 'prototype-brief.md')

  for (let i = 0; i < chosen.length; i++) {
    const candidateId = `candidate-${i + 1}`
    const strategy = chosen[i]
    const branch = `sf/${runId}/${candidateId}`
    const worktreePath = await createWorktree(root, branch, `${runId}-${candidateId}`)
    const bundleDir = join(variantsDir, candidateId)
    const strategyBriefPath = join(bundleDir, 'brief.md')
    const verificationDetailsPath = join(bundleDir, 'verification.json')
    const verificationReportPath = join(bundleDir, 'verification.md')
    const summary = `${strategy} strategy for goal: ${plan.goal}`
    const verificationSummary = 'Verification not yet run; candidate bundle captured for later review.'

    writeText(
      strategyBriefPath,
      `${renderTemplate(template.content, { strategy, goal: plan.goal })}\n\nWorkflow: ${workflow.path}\nSource Plan: ${plan.runId}\n`,
    )
    writeJson(verificationDetailsPath, {
      candidateId,
      checksRun: ['bundle-captured'],
      status: 'pending',
      summary: verificationSummary,
    })
    writeText(
      verificationReportPath,
      `# Verification\n\nCandidate: ${candidateId}\nStatus: pending\nSummary: ${verificationSummary}\n`,
    )

    const result: CandidateResult = {
      runId,
      sourcePlanRunId: plan.runId,
      candidateId,
      strategy,
      branch,
      worktreePath,
      bundleDir,
      workflowPath: workflow.path,
      templatePath: template.path,
      strategyBriefPath,
      artifacts: [strategyBriefPath, verificationReportPath, verificationDetailsPath],
      summary,
      verification: {
        checksRun: ['bundle-captured'],
        status: 'pending',
        summary: verificationSummary,
        reportPath: verificationReportPath,
        detailsPath: verificationDetailsPath,
      },
    }
    writeJson(join(variantsDir, `${candidateId}.json`), result)
    writeText(join(variantsDir, `${candidateId}.md`), `# ${candidateId}\n\nStrategy: ${strategy}\n\nSummary: ${summary}\n\nBundle: ${bundleDir}\n`)
    results.push(result)
  }
  return results
}

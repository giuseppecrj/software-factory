import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { initRun, createRunId, saveReceipt, loadJson } from '../core/run-store'
import { writeJson, writeText } from '../core/artifacts'
import type { PlanArtifact, RunReceipt, ShapeArtifact } from '../core/types'

export async function runPlan(root: string, from: string) {
  const sourcePath = existsSync(join(root, 'runs', 'completed', from, 'shape.json')) ? join(root, 'runs', 'completed', from, 'shape.json') : null
  const shape = sourcePath ? loadJson<ShapeArtifact>(sourcePath) : { runId: from, idea: from, goal: from, constraints: [], successCriteria: [] }
  const runId = createRunId('plan')
  const dir = initRun(root, runId)
  const artifact: PlanArtifact = {
    runId,
    sourceRunId: shape.runId,
    goal: shape.goal,
    acceptanceCriteria: shape.successCriteria.length ? shape.successCriteria : ['produce viable candidate branches'],
    verificationPlan: ['run sf review', 'run sf qa on winner'],
    tasks: ['shape task validated', 'generate variants', 'compare results'],
  }
  writeJson(join(dir, 'plan.json'), artifact)
  writeText(
    join(dir, 'plan.md'),
    `# Plan

Goal: ${artifact.goal}

## Acceptance Criteria
${artifact.acceptanceCriteria.map((x) => `- ${x}`).join('\n')}

## Verification Plan
${artifact.verificationPlan.map((x) => `- ${x}`).join('\n')}
`,
  )
  const receipt: RunReceipt = {
    runId,
    stage: 'plan',
    status: 'success',
    createdAt: new Date().toISOString(),
    summary: `Created plan for: ${artifact.goal}`,
    artifacts: [join(dir, 'plan.md'), join(dir, 'plan.json')],
    next: [`sf prototype --from ${runId} --variants 3`],
  }
  saveReceipt(root, receipt)
  return { artifact, receipt }
}

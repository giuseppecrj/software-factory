import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { initRun, createRunId, saveFailureReceipt, saveReceipt, loadJson } from '../core/run-store'
import { writeJson, writeText } from '../core/artifacts'
import { readFactoryText, renderTemplate } from '../core/factory-files'
import type { PlanArtifact, RunReceipt, ShapeArtifact } from '../core/types'

export async function runPlan(root: string, from: string) {
  let workflow
  let template
  try {
    workflow = readFactoryText(root, 'workflows', 'plan.md')
    template = readFactoryText(root, 'templates', 'implementation-plan.md')
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    saveFailureReceipt(root, 'plan', message, ['Restore factory/workflows/plan.md and factory/templates/implementation-plan.md'])
    throw error
  }
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
    `${renderTemplate(template.content, { goal: artifact.goal })}\n\nWorkflow: ${workflow.path}\n\n## Acceptance Criteria\n${artifact.acceptanceCriteria.map((x) => `- ${x}`).join('\n')}\n\n## Verification Plan\n${artifact.verificationPlan.map((x) => `- ${x}`).join('\n')}\n`,
  )
  const receipt: RunReceipt = {
    runId,
    stage: 'plan',
    status: 'success',
    createdAt: new Date().toISOString(),
    summary: `Created plan for: ${artifact.goal}`,
    artifacts: [join(dir, 'plan.md'), join(dir, 'plan.json')],
    next: [`sf prototype ${runId} --variants 3`],
  }
  saveReceipt(root, receipt)
  return { artifact, receipt }
}

import { join } from 'node:path'
import { initRun, createRunId, saveFailureReceipt, saveReceipt } from '../core/run-store'
import { writeJson, writeText } from '../core/artifacts'
import { readFactoryText, renderTemplate } from '../core/factory-files'
import type { RunReceipt, ShapeArtifact } from '../core/types'

export async function runShape(root: string, idea: string) {
  let workflow
  let template
  try {
    workflow = readFactoryText(root, 'workflows', 'shape.md')
    template = readFactoryText(root, 'templates', 'shape.md')
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    saveFailureReceipt(root, 'shape', message, ['Restore factory/workflows/shape.md and factory/templates/shape.md'])
    throw error
  }
  const runId = createRunId('shape')
  const dir = initRun(root, runId)
  const artifact: ShapeArtifact = {
    runId,
    idea,
    goal: idea,
    constraints: ['keep V1 lean', 'prefer explicit artifacts'],
    successCriteria: ['clear operator flow', 'parallel candidate generation', 'reviewable outputs'],
  }
  writeJson(join(dir, 'shape.json'), artifact)
  writeText(
    join(dir, 'shape.md'),
    `${renderTemplate(template.content, { idea })}\n\nWorkflow: ${workflow.path}\n\n## Constraints\n${artifact.constraints.map((x) => `- ${x}`).join('\n')}\n\n## Success Criteria\n${artifact.successCriteria.map((x) => `- ${x}`).join('\n')}\n`,
  )
  const receipt: RunReceipt = {
    runId,
    stage: 'shape',
    status: 'success',
    createdAt: new Date().toISOString(),
    summary: `Created shape artifact for: ${idea}`,
    artifacts: [join(dir, 'shape.md'), join(dir, 'shape.json')],
    next: [`sf plan ${runId}`],
  }
  saveReceipt(root, receipt)
  return { artifact, receipt }
}

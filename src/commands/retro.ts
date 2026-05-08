import { join } from 'node:path'
import { createRunId, initRun, saveFailureReceipt, saveReceipt } from '../core/run-store'
import { writeJson, writeText } from '../core/artifacts'
import { readFactoryText, renderTemplate } from '../core/factory-files'
import type { RunReceipt } from '../core/types'

export async function runRetro(root: string, from: string) {
  let workflow
  let template
  try {
    workflow = readFactoryText(root, 'workflows', 'retro.md')
    template = readFactoryText(root, 'templates', 'retro.md')
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    saveFailureReceipt(root, 'retro', message, ['Restore factory/workflows/retro.md and factory/templates/retro.md'])
    throw error
  }
  const runId = createRunId('retro')
  const dir = initRun(root, runId)
  const retro = {
    sourceRunId: from,
    workflowPath: workflow.path,
    templatePath: template.path,
    worked: ['artifact-first flow', 'candidate fanout'],
    failed: ['review and QA remain heuristic in early V1'],
    promoteToSystem: {
      rule: 'Add deterministic verification as soon as domain hooks exist',
      check: 'expand sf doctor over time',
      rubric: 'preserve reviewer disagreement explicitly',
      runbook: 'document merge and rollback clearly',
    },
  }
  writeJson(join(dir, 'retro.json'), retro)
  writeText(
    join(dir, 'retro.md'),
    `${renderTemplate(template.content, { runId: from })}\n\nWorkflow: ${workflow.path}\n\n## Worked\n- artifact-first flow\n- candidate fanout\n\n## Promote to system\n- rule: Add deterministic verification as soon as domain hooks exist\n`,
  )
  const receipt: RunReceipt = {
    runId,
    stage: 'retro',
    status: 'success',
    createdAt: new Date().toISOString(),
    summary: `Captured retro for ${from}`,
    artifacts: [join(dir, 'retro.md'), join(dir, 'retro.json')],
  }
  saveReceipt(root, receipt)
  return { retro, receipt }
}

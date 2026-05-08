import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { createRunId, initRun, saveFailureReceipt, saveReceipt } from '../core/run-store'
import { writeJson, writeText } from '../core/artifacts'
import { readFactoryText, renderTemplate } from '../core/factory-files'
import type { RunReceipt } from '../core/types'

export async function runQa(root: string, from: string, candidate: string) {
  let workflow
  let template
  try {
    workflow = readFactoryText(root, 'workflows', 'qa.md')
    template = readFactoryText(root, 'templates', 'qa-report.md')
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    saveFailureReceipt(root, 'qa', message, ['Restore factory/workflows/qa.md and factory/templates/qa-report.md'])
    throw error
  }
  const candidateManifestPath = join(root, 'runs', 'completed', from, 'variants', `${candidate}.json`)
  if (!existsSync(candidateManifestPath)) {
    saveFailureReceipt(root, 'qa', `Could not find candidate bundle for '${candidate}' in run '${from}'`, [`sf review ${from}`, `Inspect runs/completed/${from}/variants/`])
    throw new Error(`Could not find candidate bundle for '${candidate}' in run '${from}'`)
  }

  const runId = createRunId('qa')
  const dir = initRun(root, runId)
  const report = {
    sourceRunId: from,
    candidate,
    workflowPath: workflow.path,
    templatePath: template.path,
    steps: ['verify candidate artifacts exist', 'manual QA hook placeholder'],
    status: 'pending',
    notes: ['QA implementation is scaffolded; domain-specific QA checks can be added later.'],
  }
  writeJson(join(dir, 'qa.json'), report)
  writeText(join(dir, 'qa.md'), `${renderTemplate(template.content, { candidate })}\n\nWorkflow: ${workflow.path}\nStatus: pending\n`)
  const receipt: RunReceipt = {
    runId,
    stage: 'qa',
    status: 'success',
    createdAt: new Date().toISOString(),
    summary: `Created QA report for ${candidate}`,
    artifacts: [join(dir, 'qa.md'), join(dir, 'qa.json')],
    next: [`sf retro ${from}`],
  }
  saveReceipt(root, receipt)
  return { report, receipt }
}

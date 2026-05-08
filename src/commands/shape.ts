import { join } from 'node:path'
import { initRun, createRunId, saveReceipt } from '../core/run-store'
import { writeJson, writeText } from '../core/artifacts'
import type { RunReceipt, ShapeArtifact } from '../core/types'

export async function runShape(root: string, idea: string) {
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
  writeText(join(dir, 'shape.md'), `# Shape

Idea: ${idea}

## Constraints
- keep V1 lean
- prefer explicit artifacts

## Success Criteria
- clear operator flow
- parallel candidate generation
- reviewable outputs
`)
  const receipt: RunReceipt = {
    runId,
    stage: 'shape',
    status: 'success',
    createdAt: new Date().toISOString(),
    summary: `Created shape artifact for: ${idea}`,
    artifacts: [join(dir, 'shape.md'), join(dir, 'shape.json')],
    next: [`sf plan --from ${runId}`],
  }
  saveReceipt(root, receipt)
  return { artifact, receipt }
}

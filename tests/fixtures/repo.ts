import { $ } from 'bun'
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

export async function createSeedRepo(prefix = 'sf-repo-') {
  const root = mkdtempSync(join(tmpdir(), prefix))

  for (const file of ['AGENTS.md', 'ETHOS.md', 'ROUTING.md', 'DESIGN.md']) {
    writeFileSync(join(root, file), `# ${file}\n`)
  }

  mkdirSync(join(root, 'docs/architecture'), { recursive: true })
  writeFileSync(join(root, 'docs/architecture/overview.md'), '# overview\n')
  writeFileSync(join(root, 'docs/architecture/operator-flow.md'), '# operator flow\n')

  mkdirSync(join(root, 'factory/workflows'), { recursive: true })
  mkdirSync(join(root, 'factory/templates'), { recursive: true })

  writeFileSync(join(root, 'factory/workflows/shape.md'), '# shape\n')
  writeFileSync(join(root, 'factory/workflows/plan.md'), '# plan\n')
  writeFileSync(join(root, 'factory/workflows/prototype.md'), '# prototype\n')
  writeFileSync(join(root, 'factory/workflows/review.md'), '# review\n')
  writeFileSync(join(root, 'factory/workflows/qa.md'), '# qa\n')
  writeFileSync(join(root, 'factory/workflows/retro.md'), '# retro\n')

  mkdirSync(join(root, 'factory/skills/product'), { recursive: true })
  mkdirSync(join(root, 'factory/skills/implementation'), { recursive: true })
  mkdirSync(join(root, 'factory/skills/review'), { recursive: true })
  mkdirSync(join(root, 'factory/skills/learning'), { recursive: true })

  writeFileSync(join(root, 'factory/templates/shape.md'), '# Shape\n\nIdea: {{idea}}\n')
  writeFileSync(join(root, 'factory/templates/implementation-plan.md'), '# Implementation Plan\n\nGoal: {{goal}}\n')
  writeFileSync(join(root, 'factory/templates/prototype-brief.md'), '# Prototype Brief\n\nStrategy: {{strategy}}\nGoal: {{goal}}\n')
  writeFileSync(join(root, 'factory/templates/review-report.md'), '# Review Report\n\nCandidate: {{candidate}}\nReviewer: {{reviewer}}\n')
  writeFileSync(join(root, 'factory/templates/scorecard.md'), '# Scorecard\n\nCandidate: {{candidate}}\n')
  writeFileSync(join(root, 'factory/templates/qa-report.md'), '# QA Report\n\nCandidate: {{candidate}}\n')
  writeFileSync(join(root, 'factory/templates/retro.md'), '# Retro\n\nSource Run: {{runId}}\n')

  writeFileSync(join(root, 'README.md'), '# temp\n')

  await $`git init -b main`.cwd(root).quiet()
  await $`git config user.email test@example.com`.cwd(root).quiet()
  await $`git config user.name test`.cwd(root).quiet()
  await $`git add .`.cwd(root).quiet()
  await $`git commit --no-gpg-sign -m init`.cwd(root).quiet()

  return root
}

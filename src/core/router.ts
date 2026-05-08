import { join } from 'node:path'

export function repoRoot() {
  return process.cwd()
}

export function workflowPath(name: string) {
  return join(repoRoot(), 'factory', 'workflows', `${name}.md`)
}

export function templatePath(name: string) {
  return join(repoRoot(), 'factory', 'templates', `${name}.md`)
}

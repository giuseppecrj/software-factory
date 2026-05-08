import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

export function readFactoryText(root: string, kind: 'workflows' | 'templates' | 'skills', relativePath: string) {
  const path = join(root, 'factory', kind, relativePath)
  if (!existsSync(path)) throw new Error(`Missing factory ${kind} file: ${relativePath}`)
  return { path, content: readFileSync(path, 'utf8') }
}

export function renderTemplate(template: string, values: Record<string, string>) {
  return template.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (_, key) => values[key] ?? '')
}

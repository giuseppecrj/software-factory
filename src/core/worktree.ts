import { mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { $ } from 'bun'

export function worktreeBase(root: string) {
  return join(root, '.sf', 'worktrees')
}

export async function createWorktree(root: string, branch: string, name: string) {
  const base = worktreeBase(root)
  mkdirSync(base, { recursive: true })
  const path = join(base, name)
  if (!existsSync(path)) {
    await $`git worktree add -b ${branch} ${path} HEAD`.cwd(root).quiet()
  }
  return path
}

export async function removeWorktree(root: string, path: string) {
  if (existsSync(path)) {
    await $`git worktree remove --force ${path}`.cwd(root).quiet()
  }
}

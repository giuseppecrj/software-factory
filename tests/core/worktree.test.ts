import { expect, test } from 'bun:test'
import { mkdtempSync, mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { $ } from 'bun'
import { createWorktree, removeWorktree } from '../../src/core/worktree'

test('createWorktree creates an isolated worktree path', async () => {
  const root = mkdtempSync(join(tmpdir(), 'sf-worktree-'))
  mkdirSync(root, { recursive: true })
  writeFileSync(join(root, 'README.md'), '# temp\n')
  await $`git init -b main`.cwd(root).quiet()
  await $`git config user.email test@example.com`.cwd(root).quiet()
  await $`git config user.name test`.cwd(root).quiet()
  await $`git add .`.cwd(root).quiet()
  await $`git commit --no-gpg-sign -m init`.cwd(root).quiet()
  const path = await createWorktree(root, 'sf/test-branch', 'candidate-a')
  expect(existsSync(path)).toBe(true)
  await removeWorktree(root, path)
})

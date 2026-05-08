#!/usr/bin/env bun
import { Cli, z } from 'incur'
import { runInit } from './commands/init'
import { runDoctor } from './commands/doctor'
import { runShape } from './commands/shape'
import { runPlan } from './commands/plan'
import { runPrototype } from './commands/prototype'
import { runReview } from './commands/review'
import { runQa } from './commands/qa'
import { runRetro } from './commands/retro'

const root = process.cwd()

export const cli = Cli.create('sf', {
  description: 'Lean software factory CLI',
})
  .command('init', {
    description: 'Initialize repo-local factory state',
    async run() {
      return await runInit(root)
    },
  })
  .command('doctor', {
    description: 'Validate readiness and explain recovery steps',
    async run() {
      return await runDoctor(root)
    },
  })
  .command('shape', {
    description: 'Shape a new idea into an explicit artifact',
    args: z.object({ idea: z.string().describe('Idea to shape') }),
    async run(c) {
      return await runShape(root, c.args.idea)
    },
  })
  .command('plan', {
    description: 'Create a plan from a previous shape run or raw text',
    args: z.object({ from: z.string().describe('Shape run id or raw goal') }),
    async run(c) {
      return await runPlan(root, c.args.from)
    },
  })
  .command('prototype', {
    description: 'Generate parallel prototype candidates from a plan run',
    args: z.object({ from: z.string().describe('Plan run id') }),
    options: z.object({ variants: z.number().default(3).describe('Number of candidate variants') }),
    async run(c) {
      return await runPrototype(root, c.args.from, c.options.variants)
    },
  })
  .command('review', {
    description: 'Run independent reviews against a prototype run',
    args: z.object({ from: z.string().describe('Prototype run id') }),
    async run(c) {
      return await runReview(root, c.args.from)
    },
  })
  .command('qa', {
    description: 'Create a QA report for a candidate',
    args: z.object({ from: z.string().describe('Prototype or review source run id') }),
    options: z.object({ candidate: z.string().default('candidate-1').describe('Candidate id') }),
    async run(c) {
      return await runQa(root, c.args.from, c.options.candidate)
    },
  })
  .command('retro', {
    description: 'Capture learnings from a run',
    args: z.object({ from: z.string().describe('Source run id') }),
    async run(c) {
      return await runRetro(root, c.args.from)
    },
  })

if (import.meta.main) cli.serve()

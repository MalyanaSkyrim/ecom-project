#!/usr/bin/env node
import { Command } from 'commander'

import { version } from '../package.json'
import { initCommand } from './commands/init'

const program = new Command()

program
  .version(version)
  .description('CLI for initializing a monorepo starter project')

program
  .command('init')
  .description('Initialize a new monorepo project')
  .action(initCommand)

program.parse(process.argv)

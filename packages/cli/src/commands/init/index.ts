import chalk from 'chalk'
import * as fs from 'fs/promises'
import inquirer from 'inquirer'
import * as path from 'path'

import { repository } from '../../../package.json'
import { downloadRepository, initializeRepository } from './utils/git'
import {
  checkNodeVersion,
  checkYarnVersion,
  installDependencies,
} from './utils/node'
import { applyRepoModifications, DEFAULT_DESTINATION } from './utils/repo'

export const initCommand = async () => {
  await checkNodeVersion()
  await checkYarnVersion()

  const { destination, workspace } = await inquirer.prompt([
    {
      type: 'input',
      name: 'destination',
      message: 'Where would you like to create your monorepo?',
      default: DEFAULT_DESTINATION,
    },
    {
      type: 'input',
      name: 'workspace',
      message: 'What would you like to name your workspace?',
      default: '@ecom',
    },
  ])

  const destinationPath = path.resolve(process.cwd(), destination)

  try {
    await fs.access(destinationPath)
    console.log('The directory already exists. Please choose a different name.')
    return
  } catch {
    // Directory does not exist, proceed with creation
  }

  try {
    await downloadRepository(repository, destinationPath)
    await applyRepoModifications(destinationPath, workspace)
    await installDependencies(destinationPath)
    await initializeRepository(destinationPath)
    console.log('\n' + chalk.hex('#35A4FB')('Happy hacking! 😊'))
  } catch (error) {
    console.log(chalk.red('Failed to initialize monorepo'))
    console.error(error)
  }
}

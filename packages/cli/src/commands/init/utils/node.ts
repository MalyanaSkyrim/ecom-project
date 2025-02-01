import chalk from 'chalk'
import ora from 'ora'
import { $ } from 'zx/core'

export const checkNodeVersion = async () => {
  const { stdout: nodeVersion } = await $`node --version`

  if (!nodeVersion.includes('v22')) {
    console.log(
      chalk.red(
        `You're currently using Node ${nodeVersion}. Please use Node v22.`,
      ),
    )
    process.exit(1)
  }
  console.log(`✅ Node v22 is installed.`)
}

export const checkYarnVersion = async () => {
  const { stdout: yarnVersion } = await $`yarn --version`.catch(() => {
    console.log(
      chalk.red(
        `Yarn is not installed. You can install yarn with 'npm i -g yarn'`,
      ),
    )
    process.exit(1)
  })

  if (!yarnVersion.includes('1.22')) {
    console.log(
      chalk.red(
        `You're currently using Yarn ${yarnVersion}. Please use Yarn v1.22.x.`,
      ),
    )
    process.exit(1)
  }
  console.log(`✅ Yarn ${yarnVersion} is installed.`)
}

export const installDependencies = async (destinationPath: string) => {
  const spinner = ora('Installing dependencies...').start()
  try {
    await $`cd ${destinationPath} && yarn --silent`
    spinner.succeed('Dependencies installed successfully')
  } catch (error) {
    if ((error as Error).message.includes('dependencies are unsorted')) {
      await $`cd ${destinationPath} && yarn manypkg fix`
      spinner.succeed('Dependencies installed successfully')
    } else {
      spinner.fail('Failed to install dependencies')
      console.error(error)
    }
  }
}

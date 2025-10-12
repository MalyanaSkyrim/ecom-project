// scripts/pull-env.ts
import * as p from '@clack/prompts'
import { Command } from '@commander-js/extra-typings'
import { SecretManagerServiceClient } from '@google-cloud/secret-manager'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import color from 'picocolors'

// Configuration
const PROJECT_ID = 'ecom-project-455201'
const SECRET_NAME = 'DEV_ENVIRONMENT_VARIABLES'

async function forceLogin(): Promise<boolean> {
  const s = p.spinner()

  try {
    s.start('Opening browser for authentication...')

    execSync('gcloud auth application-default login', {
      stdio: 'inherit',
    })

    s.stop('Authentication successful!')
    return true
  } catch (error) {
    s.stop('Authentication failed')
    p.cancel(color.red('Failed to authenticate with Google Cloud'))
    return false
  }
}

async function pullSecrets(outputPath: string): Promise<void> {
  const s = p.spinner()

  try {
    s.start('Fetching secrets from Google Cloud...')

    const client = new SecretManagerServiceClient()
    const name = `projects/${PROJECT_ID}/secrets/${SECRET_NAME}/versions/latest`

    const [version] = await client.accessSecretVersion({ name })

    if (!version.payload?.data) {
      throw new Error('Secret payload is empty or undefined')
    }

    const envContent = version.payload.data.toString('utf8')

    s.stop('Secrets fetched successfully')

    // Write to file
    const s2 = p.spinner()
    s2.start(`Writing to ${color.cyan(outputPath)}...`)

    const envFilePath = path.join(process.cwd(), outputPath)
    fs.writeFileSync(envFilePath, envContent)

    s2.stop(`Environment variables written to ${color.cyan(outputPath)}`)
  } catch (error: any) {
    s.stop('Failed to fetch secrets')
    p.cancel(color.red(`Error: ${error.message}`))
    process.exit(1)
  }
}

async function main() {
  console.clear()

  p.intro(color.bgCyan(color.black(' Environment Sync ')))

  // Parse command line arguments
  const program = new Command()
    .name('pull-env')
    .description(
      'Pull development environment variables from Google Cloud Secrets',
    )
    .option('-o, --output <file>', 'Output file path', '.env')
    .option('--no-auth', 'Skip authentication (use existing credentials)')
    .parse()

  const options = program.opts()

  // Authenticate if needed
  if (options.auth) {
    const authenticated = await forceLogin()
    if (!authenticated) {
      process.exit(1)
    }
  }

  // Pull secrets
  await pullSecrets(options.output)

  p.outro(color.green('✨ Done! Your environment is ready.'))
}

main().catch((error) => {
  p.cancel(color.red(`Unexpected error: ${error.message}`))
  process.exit(1)
})

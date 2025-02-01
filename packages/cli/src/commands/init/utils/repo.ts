import * as fs from 'fs/promises'
import ora from 'ora'
import * as path from 'path'

const DEFAULT_WORKSPACE = '@ecom'
export const DEFAULT_DESTINATION = 'monorepo-starter'

const foldersToSkip = [
  'cockroach-data',
  'node_modules',
  'dist',
  'build',
  '.next',
  '.git',
]

const allowedFilesExtensions = ['.tsx', '.ts', '.js', '.mjs', '.json', '.md']

const updatePackageJsonName = async (
  destinationPath: string,
  newName: string,
) => {
  if (destinationPath === DEFAULT_DESTINATION) return
  const packageJsonPath = path.join(destinationPath, 'package.json')
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))
  packageJson.name = newName
  await fs.writeFile(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2),
    'utf8',
  )
}

const removeAuthorFromPackageJson = async (directory: string) => {
  const entries = await fs.readdir(directory, { withFileTypes: true })

  for (let entry of entries) {
    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      await removeAuthorFromPackageJson(entryPath)
    } else if (entry.isFile() && entry.name === 'package.json') {
      const packageJson = JSON.parse(await fs.readFile(entryPath, 'utf8'))
      if (packageJson.author) {
        delete packageJson.author
        await fs.writeFile(
          entryPath,
          JSON.stringify(packageJson, null, 2),
          'utf8',
        )
      }
    }
  }
}

const replaceWorkspaceInFiles = async (
  destinationPath: string,
  workspace: string,
) => {
  const validWorkspace =
    workspace.charAt(0) === '@' ? workspace : `@${workspace}`

  if (validWorkspace === DEFAULT_WORKSPACE) return
  const entries = await fs.readdir(destinationPath, { withFileTypes: true })

  for (let entry of entries) {
    if (foldersToSkip.includes(entry.name)) continue
    const entryPath = path.join(destinationPath, entry.name)
    if (entry.isDirectory()) {
      await replaceWorkspaceInFiles(entryPath, validWorkspace)
    } else {
      const fileExtension = path.extname(entryPath)
      if (allowedFilesExtensions.includes(fileExtension)) {
        const content = await fs.readFile(entryPath, 'utf8')
        const modifiedContent = content.replace(
          new RegExp(`${DEFAULT_WORKSPACE}`, 'g'),
          `${validWorkspace}`,
        )
        await fs.writeFile(entryPath, modifiedContent, 'utf8')
      }
    }
  }
}

export const applyRepoModifications = async (
  destinationPath: string,
  workspace: string,
) => {
  const spinner = ora('Applying modifications...').start()
  await replaceWorkspaceInFiles(destinationPath, workspace)
  await updatePackageJsonName(destinationPath, path.basename(destinationPath))
  await removeAuthorFromPackageJson(destinationPath)

  spinner.succeed('Modifications applied successfully')
}

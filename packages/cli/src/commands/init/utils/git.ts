import AdmZip from 'adm-zip'
import fs from 'fs'
import fetch from 'node-fetch'
import path from 'path'
import simpleGit from 'simple-git'

/**
 * Downloads a Git repository ZIP archive and unzips it to the specified destination directory.
 *
 * @param repoUrl - The URL of the Git repository (e.g., https://github.com/user/repo).
 * @param destinationPath - The path where the repository should be unzipped.
 */
export async function downloadRepository(
  repoUrl: string,
  destinationPath: string,
): Promise<void> {
  const zipUrl = `${repoUrl}/archive/refs/heads/master.zip`
  const zipFilePath = path.join(destinationPath, 'repo.zip')

  // Ensure the destination directory exists
  fs.mkdirSync(destinationPath, { recursive: true })

  console.log(`Downloading ZIP from: ${zipUrl}`)

  try {
    // Download the ZIP file
    const response = await fetch(zipUrl)
    if (!response.ok) {
      throw new Error(
        `Failed to download ZIP: ${response.status} ${response.statusText}`,
      )
    }

    // Save the ZIP file to disk
    const buffer = await response.buffer()
    fs.writeFileSync(zipFilePath, buffer)

    console.log(`ZIP downloaded to: ${zipFilePath}`)

    // Extract the ZIP file
    const zip = new AdmZip(zipFilePath)
    const tempExtractPath = path.join(destinationPath, 'temp')
    zip.extractAllTo(tempExtractPath, true)

    // Move files from the inner folder to the destination path
    const extractedFolder = fs.readdirSync(tempExtractPath)[0]
    const extractedPath = path.join(tempExtractPath, extractedFolder)
    const files = fs.readdirSync(extractedPath)

    for (const file of files) {
      const source = path.join(extractedPath, file)
      const target = path.join(destinationPath, file)
      fs.renameSync(source, target)
    }

    // Remove temporary files and folders
    fs.rmSync(tempExtractPath, { recursive: true, force: true })

    console.log(`Repository unzipped to: ${destinationPath}`)

    // Clean up the ZIP file
    fs.unlinkSync(zipFilePath)
  } catch (error) {
    throw error
  }
}

export async function initializeRepository(destinationPath: string) {
  try {
    const git = simpleGit(destinationPath)
    await git.init()
    await git.add('.')
    await git.commit('Initial commit from Turbo Stack CLI')
  } catch (error) {
    console.error('Failed to initialize git', error)
    throw error
  }
}

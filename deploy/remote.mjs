import { spawnSync } from 'node:child_process'
import { copyFileSync, readFileSync, writeFileSync, renameSync, chmodSync, existsSync, constants } from 'node:fs'
import { fileURLToPath } from 'node:url'

// One host-side entry point for the dedicated SSH key and deployment.
// Install root-owned at /usr/local/lib/gsr-site/remote.mjs after review.
const root = '/opt/gsr-site'
const script = fileURLToPath(import.meta.url)
const shaPattern = /^[0-9a-f]{40}$/

function run(executable, args, options = {}) {
  const child = spawnSync(executable, args, { stdio: 'inherit', ...options })
  if (child.error || child.status !== 0) throw new Error('GSR operation failed; deployment stopped.')
}

try {
  if (process.getuid() !== 0) {
    const match = /^gsr-deploy ([0-9a-f]{40})$/.exec(process.env.SSH_ORIGINAL_COMMAND ?? '')
    if (!match) throw new Error('This SSH key only accepts gsr-deploy <commit SHA>.')
    run('/usr/bin/sudo', ['-n', process.execPath, script, match[1]])
  } else {
    const args = process.argv.slice(2)
    const locked = args[0] === '--locked'
    const sha = locked ? args[1] : args[0]
    if (!shaPattern.test(sha ?? '') || args.length !== (locked ? 2 : 1)) {
      throw new Error('A valid immutable commit SHA is required.')
    }
    if (!locked) {
      run('/usr/bin/flock', ['-n', `${root}/.deploy.lock`, process.execPath, script, '--locked', sha])
    } else {
      process.umask(0o077)
      const envPath = `${root}/.env`
      const originalEnv = readFileSync(envPath, 'utf8')
      if (!/^GSR_MIGRATIONS_READY=1$/m.test(originalEnv)) throw new Error('Content import is not verified.')
      const previousImage = /^GSR_IMAGE=(.+)$/m.exec(originalEnv)?.[1]
      if (!previousImage) throw new Error('Previous image pointer is missing.')
      const nextImage = `ghcr.io/sabrinagui/gsr-sistemas-site:${sha}`
      const env = { ...process.env, GSR_IMAGE: nextImage }
      const compose = (args) => run('/usr/bin/docker', ['compose', '-p', 'gsr-site', '--project-directory', root, ...args], { cwd: root, env })

      console.log('Pulling only the GSR application and migration image.')
      compose(['pull', 'gsr-app', 'gsr-migrate'])
      console.log('Backing up only the GSR database and media.')
      compose(['--profile', 'maintenance', 'run', '--rm', '--name', 'gsr-backup', '--no-deps', 'gsr-backup'])
      console.log('Running GSR migrations before replacing the application.')
      compose(['run', '--rm', '--no-deps', 'gsr-migrate'])
      console.log('Replacing only gsr-app and waiting for its healthcheck.')
      compose(['up', '-d', '--no-deps', '--wait', '--wait-timeout', '180', 'gsr-app'])

      if (readFileSync(envPath, 'utf8') !== originalEnv) throw new Error('Server environment changed during deployment.')
      const stamp = new Date().toISOString().slice(0, 19).replaceAll('-', '').replaceAll(':', '').replace('T', '-')
      const backup = `${envPath}.bak-${stamp}`
      copyFileSync(envPath, backup, constants.COPYFILE_EXCL)
      chmodSync(backup, 0o600)
      console.log(`Environment rollback: cp -- ${backup} ${envPath}`)
      const updatedEnv = originalEnv.replace(/^GSR_IMAGE=.+$/m, `GSR_IMAGE=${nextImage}`)
      const temporary = `${envPath}.new-${stamp}`
      writeFileSync(temporary, updatedEnv, { mode: 0o600, flag: 'wx' })
      renameSync(temporary, envPath)
      const pointer = `${root}/previous-image.txt`
      if (existsSync(pointer)) {
        copyFileSync(pointer, `${pointer}.bak-${stamp}`, constants.COPYFILE_EXCL)
        chmodSync(`${pointer}.bak-${stamp}`, 0o600)
        console.log(`Image pointer rollback: cp -- ${pointer}.bak-${stamp} ${pointer}`)
      }
      writeFileSync(pointer, `${previousImage}\n`, { mode: 0o600 })
      console.log(`GSR deployment complete: ${sha}`)
    }
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : 'GSR operation failed.')
  process.exitCode = 1
}

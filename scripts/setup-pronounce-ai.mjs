import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const target = resolve(root, 'services', 'PronounceAI')
const repo = 'https://github.com/vikranthreddimasu/PronounceAI.git'

function run(args, cwd = root) {
  const result = spawnSync('git', args, { cwd, stdio: 'inherit', shell: false })
  if (result.error) {
    console.error('Git could not be started. Install Git and try again.')
    process.exit(1)
  }
  if (result.status !== 0) process.exit(result.status || 1)
}

if (existsSync(resolve(target, '.git'))) {
  console.log(`PronounceAI already exists at ${target}`)
  run(['pull', '--ff-only'], target)
} else {
  console.log(`Cloning PronounceAI into ${target}`)
  run(['clone', '--depth', '1', repo, target])
}

console.log(`\nPronounceAI source is ready.\n\nNext: open PRONUNCIATION_SETUP.md and start the Python backend on port 8000.`)

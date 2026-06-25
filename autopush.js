const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const ROOT = __dirname
const IGNORE = ['.next', 'node_modules', '.git', 'autopush.js', 'autopush.ps1']

let timer = null

function push() {
  try {
    execSync('git add -A', { cwd: ROOT, stdio: 'ignore' })
    const msg = `auto: update ${new Date().toLocaleString('en-IN')}`
    const result = execSync(`git commit -m "${msg}"`, { cwd: ROOT, stdio: 'pipe' }).toString()
    if (result.includes('nothing to commit')) return
    execSync('git push', { cwd: ROOT, stdio: 'ignore' })
    console.log(`\x1b[32m[autopush] Pushed at ${new Date().toLocaleTimeString()}\x1b[0m`)
  } catch (e) {
    const msg = e.stdout?.toString() || e.message
    if (!msg.includes('nothing to commit')) {
      console.error(`\x1b[31m[autopush] Push failed: ${msg}\x1b[0m`)
    }
  }
}

function shouldIgnore(filePath) {
  return IGNORE.some(ig => filePath.includes(path.sep + ig) || filePath.includes('/' + ig))
}

function watch(dir) {
  try {
    fs.watch(dir, { recursive: true }, (event, filename) => {
      if (!filename || shouldIgnore(path.join(dir, filename))) return
      clearTimeout(timer)
      timer = setTimeout(push, 5000)
    })
  } catch (e) {}
}

watch(ROOT)
console.log('\x1b[36m[autopush] Watching for changes — will push 5s after last save\x1b[0m')

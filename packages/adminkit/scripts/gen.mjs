// One entry point for both manifests — used by `pnpm gen`, verify.sh and the IDE
// watchers. Keeping the watch loop here (rather than in one generator) means a save to
// any css file, tokens.css included, refreshes everything: a token added but not
// regenerated is exactly the drift the guard in verify.sh would later fail on.
import { watch } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { genClasses } from './gen-classes.mjs'
import { genTokens } from './gen-tokens.mjs'

const cssDir = join(dirname(fileURLToPath(import.meta.url)), '../src/css')

function genAll() {
  genClasses()
  genTokens()
}

genAll()

if (process.argv.includes('--watch')) {
  console.log('[gen] watching', cssDir)
  let timer
  watch(cssDir, (_event, file) => {
    if (!file || !file.endsWith('.css')) return
    clearTimeout(timer) // debounce bursty save events
    timer = setTimeout(genAll, 50)
  })
}

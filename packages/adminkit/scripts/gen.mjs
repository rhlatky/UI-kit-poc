// Single entry point for both generators. Watch loop here so any .css save regenerates everything.
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

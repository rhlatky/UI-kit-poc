import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { extractTokens, extractTokenRefs } from './extract.mjs'

const cssDir = join(dirname(fileURLToPath(import.meta.url)), '../src/css')
const read = (f) => readFileSync(join(cssDir, f), 'utf8')
const cssFiles = readdirSync(cssDir).filter((f) => f.endsWith('.css'))

describe('extractTokens', () => {
  it('reads declarations and dedupes the theme redeclarations', () => {
    const css = `:root { --ds-color-primary: red; --ds-space-1: 4px; }
                 [data-theme='dark'] { --ds-color-primary: pink; }`
    expect(extractTokens(css)).toEqual(['--ds-color-primary', '--ds-space-1'])
  })

  it('does not treat a var() reference as a declaration', () => {
    expect(extractTokens('.a { color: var(--ds-color-text); }')).toEqual([])
  })

  it('ignores declarations in comments', () => {
    expect(extractTokens('/* --ds-gone: 1px; */ :root { --ds-here: 2px; }')).toEqual(['--ds-here'])
  })
})

describe('extractTokenRefs', () => {
  it('reads var() references, including with a fallback', () => {
    const css = '.a { color: var(--ds-color-text); gap: var( --ds-space-2 , 8px); }'
    expect(extractTokenRefs(css)).toEqual(['--ds-color-text', '--ds-space-2'])
  })

  it('does not treat a declaration as a reference', () => {
    expect(extractTokenRefs(':root { --ds-color-text: red; }')).toEqual([])
  })
})

// The contract check. A var() pointing at a property that does not exist renders as
// nothing at all and no tool reports it — not the browser, not tsc, not the class
// manifest. This is the only thing standing between a token typo and production.
describe('token contract', () => {
  const declared = new Set(extractTokens(read('tokens.css')))

  it.each(cssFiles)('every var() in %s resolves to a declared token', (file) => {
    const missing = extractTokenRefs(read(file)).filter((name) => !declared.has(name))
    expect(missing, `undeclared in tokens.css: ${missing.join(', ')}`).toEqual([])
  })

  it('the shipped css actually uses tokens', () => {
    const used = cssFiles.flatMap((f) => extractTokenRefs(read(f)))
    expect(used.length).toBeGreaterThan(0)
  })
})

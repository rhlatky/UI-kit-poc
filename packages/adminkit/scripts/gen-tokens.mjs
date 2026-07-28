// tokens.css -> generated-tokens.ts : typed map of custom-property names (not values — values differ per theme).
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { tokenKey, extractTokens } from './extract.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(root, 'src/css/tokens.css')
const out = join(root, 'src/generated-tokens.ts')

export function genTokens() {
  const tokens = extractTokens(readFileSync(source, 'utf8'))
  const entries = tokens
    .map((name) => `  ${JSON.stringify(tokenKey(name))}: ${JSON.stringify(name)}`)
    .join(',\n')

  writeFileSync(out, `export const tokens = {\n${entries},\n} as const\n`)
  console.log(`[generated-tokens] ${tokens.length} tokens`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) genTokens()

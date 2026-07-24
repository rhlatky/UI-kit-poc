// css → classes/<name>.d.ts : a TYPE-ONLY union of the file's class names.
// No runtime .js — the union is the single source of truth (from css); consumers
// write class literals inline, checked against it via `satisfies`.
import { readFileSync, writeFileSync, readdirSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const cssDir = join(root, 'src/css')
const outDir = join(root, 'src/classes')
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase())

for (const file of readdirSync(cssDir).filter((f) => f.endsWith('.css') && f !== 'tokens.css')) {
  const name = file.replace(/\.css$/, '')
  const css = readFileSync(join(cssDir, file), 'utf8')
  const classes = [...new Set([...css.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1]))]
  const union = classes.map((c) => `  | ${JSON.stringify(c)}`).join('\n')
  writeFileSync(join(outDir, `${name}.d.ts`), `export type ${cap(name)}Class =\n${union}\n`)
  console.log(`[classes] ${name}: ${classes.length} classes → ${cap(name)}Class`)
}

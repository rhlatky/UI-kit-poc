import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const cssDir = join(root, 'src/css')
const outDir = join(root, 'src/classes')
const camel = (s) => s.replace(/[-_]+([a-zA-Z0-9])/g, (_, c) => c.toUpperCase())

for (const file of readdirSync(cssDir).filter((f) => f.endsWith('.css') && f !== 'tokens.css')) {
  const name = file.replace(/\.css$/, '')
  const css = readFileSync(join(cssDir, file), 'utf8')
  const classes = [...new Set([...css.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1]))]
  const pairs = classes.map((c) => [camel(c), c])
  const body = pairs.map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(',\n')
  writeFileSync(join(outDir, `${name}.js`), `export const ${name} = {\n${body},\n}\n`)
  const dts = pairs.map(([k, v]) => `  readonly ${JSON.stringify(k)}: ${JSON.stringify(v)}`).join('\n')
  writeFileSync(join(outDir, `${name}.d.ts`), `export declare const ${name}: {\n${dts}\n}\n`)
  console.log(`[classes] ${name}: ${classes.length} classes`)
}

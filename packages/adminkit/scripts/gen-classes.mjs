// css → generated-classes/<name>.ts : a generated `as const` key→value manifest of the
// file's class names (camelCased key → BEM string). Gives Vue both the runtime
// values AND literal types (m.buttonPrimaryy = compile error). No hand-written map.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const cssDir = join(root, 'src/css')
const outDir = join(root, 'src/generated-classes')
const camel = (s) => s.replace(/[-_]+([a-zA-Z0-9])/g, (_, c) => c.toUpperCase())

for (const file of readdirSync(cssDir).filter((f) => f.endsWith('.css') && f !== 'tokens.css')) {
  const name = file.replace(/\.css$/, '')
  const css = readFileSync(join(cssDir, file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '') // strip comments
  const classes = [...new Set([...css.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1]))]
  const entries = classes.map((c) => `  ${JSON.stringify(camel(c))}: ${JSON.stringify(c)}`).join(',\n')
  writeFileSync(join(outDir, `${name}.ts`), `export const ${name} = {\n${entries},\n} as const\n`)
  console.log(`[generated-classes] ${name}: ${classes.length} classes`)
}

// css → generated-classes/<name>.ts : a generated `as const` key→value manifest of the
// file's class names (camelCased key → BEM string). Gives Vue both the runtime
// values AND literal types (m.buttonPrimaryy = compile error). No hand-written map.
// Run directly, or through gen.mjs, which also generates the token manifest.
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { classKey, extractClasses } from './extract.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const cssDir = join(root, 'src/css')
const outDir = join(root, 'src/generated-classes')

const cssNames = () =>
  readdirSync(cssDir)
    .filter((f) => f.endsWith('.css') && f !== 'tokens.css')
    .map((f) => f.replace(/\.css$/, ''))

function genFile(file) {
  const name = file.replace(/\.css$/, '')
  const classes = extractClasses(readFileSync(join(cssDir, file), 'utf8'))
  const entries = classes.map((c) => `  ${JSON.stringify(classKey(c))}: ${JSON.stringify(c)}`).join(',\n')
  writeFileSync(join(outDir, `${name}.ts`), `export const ${name} = {\n${entries},\n} as const\n`)
  console.log(`[generated-classes] ${name}: ${classes.length} classes`)
}

export function genClasses() {
  mkdirSync(outDir, { recursive: true }) // absent on a clean checkout / after a manual wipe
  const names = cssNames()
  for (const name of names) genFile(`${name}.css`)
  prune(names)
}

// Drop a generated .ts whose .css is gone. Left behind it would keep exporting a
// class contract with no styling behind it — and still typecheck, so nothing would
// ever flag it. (The matching `exports` entry in package.json is still manual.)
function prune(names) {
  for (const f of readdirSync(outDir).filter((f) => f.endsWith('.ts'))) {
    const name = f.replace(/\.ts$/, '')
    if (names.includes(name)) continue
    rmSync(join(outDir, f))
    console.log(`[generated-classes] ${name}: removed (no ${name}.css)`)
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) genClasses()

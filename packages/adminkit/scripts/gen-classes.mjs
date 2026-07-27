// css → generated-classes/<name>.ts : a generated `as const` key→value manifest of the
// file's class names (camelCased key → BEM string). Gives Vue both the runtime
// values AND literal types (m.buttonPrimaryy = compile error). No hand-written map.
// Run once, or with `--watch` to regenerate on css save (zero-dep fs.watch).
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync, watch } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const cssDir = join(root, 'src/css')
const outDir = join(root, 'src/generated-classes')
const camel = (s) => s.replace(/[-_]+([a-zA-Z0-9])/g, (_, c) => c.toUpperCase())

mkdirSync(outDir, { recursive: true }) // may be absent on a clean checkout / after a manual wipe

const cssNames = () =>
  readdirSync(cssDir)
    .filter((f) => f.endsWith('.css') && f !== 'tokens.css')
    .map((f) => f.replace(/\.css$/, ''))

function genFile(file) {
  const name = file.replace(/\.css$/, '')
  const css = readFileSync(join(cssDir, file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '') // strip comments
  const classes = [...new Set([...css.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1]))]
  const entries = classes.map((c) => `  ${JSON.stringify(camel(c))}: ${JSON.stringify(c)}`).join(',\n')
  writeFileSync(join(outDir, `${name}.ts`), `export const ${name} = {\n${entries},\n} as const\n`)
  console.log(`[generated-classes] ${name}: ${classes.length} classes`)
}

function genAll() {
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

genAll()

if (process.argv.includes('--watch')) {
  console.log('[generated-classes] watching', cssDir)
  let timer
  watch(cssDir, (_event, file) => {
    if (!file || !file.endsWith('.css') || file === 'tokens.css') return
    clearTimeout(timer) // debounce bursty save events
    timer = setTimeout(() => {
      try {
        genFile(file)
      } catch {
        genAll() // file renamed/removed — resync everything
      }
    }, 50)
  })
}

import { existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

const srcDir = fileURLToPath(new URL('./src', import.meta.url))

// Every barrel (`src/index.ts` + `src/<name>/index.ts`) is its own build entry.
// Required: with preserveModules, rollup inlines a pure re-export barrel that is
// NOT an entry into dist/index.js and never writes it — while vite-plugin-dts
// still emits its .d.ts. The `./*` subpath exports would then typecheck and fail
// at runtime. Auto-discovered, so adding a component needs no change here.
const entries = [
  resolve(srcDir, 'index.ts'),
  ...readdirSync(srcDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(resolve(srcDir, d.name, 'index.ts')))
    .map((d) => resolve(srcDir, d.name, 'index.ts')),
]

// Library build: ESM, per-component chunks (preserveModules) for tree-shaking.
// vue + adminkit are external → not bundled; `import 'adminkit/*.css'` stays an
// external import the consuming app resolves & dedupes.
export default defineConfig({
  plugins: [vue(), dts({ include: ['src'], exclude: ['**/*.vue.ts', '**/*.test.ts'] })],
  build: {
    lib: {
      entry: entries,
      formats: ['es'],
    },
    rollupOptions: {
      external: (id) => id === 'vue' || id === 'adminkit' || id.startsWith('adminkit/'),
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
  },
})

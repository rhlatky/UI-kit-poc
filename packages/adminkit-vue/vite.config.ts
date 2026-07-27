import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

// Library build: ESM, per-component chunks (preserveModules) for tree-shaking.
// vue + adminkit are external → not bundled; `import 'adminkit/*.css'` stays an
// external import the consuming app resolves & dedupes.
export default defineConfig({
  plugins: [vue(), dts({ include: ['src'], exclude: ['**/*.vue.ts'] })],
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
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

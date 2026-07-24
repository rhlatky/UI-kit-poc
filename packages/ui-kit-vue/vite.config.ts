import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const cssSrc = fileURLToPath(new URL('../ui-kit-css/src', import.meta.url))

export default defineConfig({
  plugins: [vue()],
  css: {
    modules: { localsConvention: 'camelCaseOnly' },
    preprocessorOptions: { scss: { loadPaths: [cssSrc] } },
  },
})

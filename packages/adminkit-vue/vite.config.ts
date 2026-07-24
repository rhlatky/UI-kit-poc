import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const scssSrc = fileURLToPath(new URL('../adminkit/src/scss', import.meta.url))

export default defineConfig({
  plugins: [vue()],
  css: {
    modules: { localsConvention: 'camelCaseOnly' },
    preprocessorOptions: { scss: { loadPaths: [scssSrc] } },
  },
})

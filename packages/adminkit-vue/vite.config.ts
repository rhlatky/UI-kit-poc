import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// Plain CSS, no sass, no css-modules. Components import adminkit's plain css for side-effect.
export default defineConfig({ plugins: [vue()] })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base is relative so the static build works on GitHub Pages (project subpath)
export default defineConfig({
  plugins: [react()],
  base: './',
})

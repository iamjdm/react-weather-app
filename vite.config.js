import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Vitest sets process.env.VITEST, so it gets its own dependency cache
  // instead of racing the `vite dev` server for node_modules/.vite.
  cacheDir: process.env.VITEST ? 'node_modules/.vitest-cache' : 'node_modules/.vite',
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: true,
    // The default worker_threads pool doesn't work in this sandboxed shell
    // (tests fail with "Vitest failed to find the current suite"); forks
    // (child_process) work reliably instead. Running multiple test files in
    // parallel is also flaky here even under forks, so parallelism is off too.
    pool: 'forks',
    fileParallelism: false,
  },
})

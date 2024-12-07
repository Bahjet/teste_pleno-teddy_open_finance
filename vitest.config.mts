import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'
import { resolve } from 'node:path'

export default defineConfig({
  test: {
    globals: true,
    alias: { '@src': './src', '@test': './test' },
    root: './',
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
  resolve: { alias: [{ find: '@', replacement: resolve(__dirname, './src') }] },
})

import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import dts from 'rollup-plugin-dts'
import { defineConfig } from 'rollup'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import babel from '@rollup/plugin-babel'

import { readFileSync } from 'fs'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const input = resolve(__dirname, './src/index.ts')

const pkg = JSON.parse(readFileSync('./package.json').toString());

const deps = Object.keys(
  Object.assign({}, pkg.peerDependencies, pkg.dependencies)
)

function commonPlugins() {
  return [
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env']
    }),
    json(),
    commonjs(),
    typescript({
      tsconfig: resolve(__dirname, './tsconfig.json'),
    })
  ]
}

const esmConfig = defineConfig({
  input,
  output: {
    dir: resolve(__dirname, 'dist'),
    entryFileNames: `node/[name].js`,
    chunkFileNames: 'node/chunks/dep-[hash].js',
    exports: 'named',
    format: 'esm',
    sourcemap: true,
    sourcemapExcludeSources: true,
    banner: "#!/usr/bin/env node"
  },
  external: id => deps.some(dep => id === dep || id.startsWith(`${dep}`)),
  plugins: [...commonPlugins()],
})

const cjsConfig = defineConfig({
  input,
  output: {
    dir: resolve(__dirname, 'dist'),
    entryFileNames: `node-cjs/[name].cjs`,
    chunkFileNames: 'node-cjs/chunks/dep-[hash].js',
    exports: 'named',
    format: 'cjs',
    sourcemap: true,
    sourcemapExcludeSources: true,
    banner: "#!/usr/bin/env node"
  },
  external: id => deps.some(dep => id === dep || id.startsWith(`${dep}`)),
  plugins: [...commonPlugins()],
})

const dtsConfig = defineConfig({
  input: resolve(__dirname, './types/index.d.ts'),
  output: {
    dir: resolve(__dirname, 'dist'),
    entryFileNames: `types/[name].ts`,
    format: 'es'
  },
  external: id => deps.some(dep => id === dep || id.startsWith(`${dep}`)),
  plugins: [dts()]
})

export default () => {
  return defineConfig([
    esmConfig,
    cjsConfig,
    dtsConfig
  ])
}
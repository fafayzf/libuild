import { rollup, defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import { visualizer } from 'rollup-plugin-visualizer'
import dts from 'rollup-plugin-dts'

import { logger, yellow } from "./logger"
import { getDefaultConfig } from "./config"

import type { Plugin, OutputOptions, RollupOptions } from "rollup"
import type { PartialDefaultConfig } from "./config"
import { TargetModuleEnum } from './constant'

async function rollupBuild(options: RollupOptions, config: PartialDefaultConfig) {
  const result = await rollup(options)
  const { output } = await result.write(options.output as OutputOptions)
  await result.close()
  logger.success(`${config.libraryName} - ${yellow(output[0].fileName)} exported!`)
  return output
}

function getRollupConfig(normalConfig: PartialDefaultConfig) {
  const rollupOutput: OutputOptions[] = []
  const rollupPlugins: Plugin[] = []
  const rollupConfig: RollupOptions = {
    input: normalConfig.entry,
    external: normalConfig.external,
    output: rollupOutput,
    plugins: rollupPlugins,
  }

  const rollupDefineConfig: RollupOptions[] = []
  const filename = splitLibraryName(normalConfig.libraryName)
  if (normalConfig.targets?.includes(TargetModuleEnum.ESM)) {
    rollupDefineConfig.push(defineConfig({
      ...rollupConfig,
      output: {
        dir: normalConfig.outDir,
        entryFileNames: `node/${filename}.js`,
        chunkFileNames: 'node/chunks/dep-[hash].js',
        exports: normalConfig.exports,
        format: 'esm',
        sourcemap: normalConfig.sourcemap,
        sourcemapExcludeSources: !!normalConfig.sourcemap,
        banner: normalConfig.banner
      },
      plugins: commonPlugins(normalConfig)
    }))
  }

  if (normalConfig.targets?.includes(TargetModuleEnum.CJS)) {
    rollupDefineConfig.push(defineConfig({
      ...rollupConfig,
      output: {
        dir: normalConfig.outDir,
        entryFileNames: `node-cjs/${filename}.cjs`,
        chunkFileNames: 'node-cjs/chunks/dep-[hash].js',
        exports: normalConfig.exports,
        format: 'esm',
        sourcemap: normalConfig.sourcemap,
        sourcemapExcludeSources: !!normalConfig.sourcemap,
        banner: normalConfig.banner
      },
      plugins: commonPlugins(normalConfig)
    }))
  }

  if (normalConfig.targets?.includes(TargetModuleEnum.UMD)) {
    rollupDefineConfig.push(defineConfig({
      ...rollupConfig,
      output: {
        dir: normalConfig.outDir,
        name:  `${filename}`,
        entryFileNames: `node-umd/${filename}.js`,
        chunkFileNames: 'node-umd/chunks/dep-[hash].js',
        exports: normalConfig.exports,
        format: 'umd',
        sourcemap: normalConfig.sourcemap,
        sourcemapExcludeSources: !!normalConfig.sourcemap,
        banner: normalConfig.banner
      },
      plugins: commonPlugins(normalConfig)
    }))
  }

  if (normalConfig.ts) {
    rollupDefineConfig.push(defineConfig({
      ...rollupConfig,
      output: {
        dir: normalConfig.outDir,
        entryFileNames: `types/${filename}.d.ts`,
        exports: normalConfig.exports,
        format: 'esm'
      },
      plugins: [dts()]
    }))
  }

  return defineConfig(rollupDefineConfig)
}

/**
 * Convert the file name, if the file name exists `scope`, do compatible processing, @yzfu/xxx -> yzfu-xxx
 * @param filename 
 */
function splitLibraryName(filename: string | undefined) {
  if (filename && filename.indexOf('@')> -1) {
    return filename
      .replace('@', '')
      .replace('/', '-')
  }
  return filename
}

function commonPlugins(config: PartialDefaultConfig): Plugin[] {
  const plugins: Plugin[] = [
    json(),
    commonjs(),
    terser(),
    visualizer()
  ]
  if (config.nodeResolve) {
    plugins.push(nodeResolve(config.nodeResolve))
  }

  if (config.ts) {
    plugins.push(typescript(config.ts))

  }

  return plugins
}

export async function build(config: PartialDefaultConfig) {
  // The purpose of obtaining the default configuration here is to solve the problem that the `name` in `package.json` 
  // cannot be obtained and the log cannot be printed if `libuild.config.mjs` is not configured in the project
  const defaultConfig = getDefaultConfig()
  const normalConfig = { ...defaultConfig, ...config }
  const options = getRollupConfig(normalConfig)

  return Promise.all(options.map(option => rollupBuild(option, normalConfig)))
    .then(result => {
      logger.success(`build success!!!`)
      return result
    })
    .catch(error => {
      logger.error('build error', error)
      throw error
    })
}
import type { RollupOptions, ExternalOption, GlobalsOption, OutputOptions } from 'rollup'
import type { RollupNodeResolveOptions } from '@rollup/plugin-node-resolve'
import type { RollupCommonJSOptions } from '@rollup/plugin-commonjs'
import type { RollupTypescriptOptions } from '@rollup/plugin-typescript'
import type { RollupAliasOptions } from '@rollup/plugin-alias'
import type { RollupReplaceOptions } from '@rollup/plugin-replace'
import type { RollupJsonOptions } from '@rollup/plugin-json'
import type { RollupEslintOptions } from '@rollup/plugin-eslint'
import type { PostCSSPluginConf } from 'rollup-plugin-postcss'
import type { TypescriptPluginOptions } from 'rollup-plugin-ts'
import type { Options as RollupDtsOptions } from 'rollup-plugin-dts'
import type { Options as RollupTerserOptions } from 'rollup-plugin-terser'
import type { PluginVisualizerOptions } from 'rollup-plugin-visualizer'
import type { TargetModuleType, ParserType } from './constant'

/**
 * Type helper to make it easier to use libundler.config.ts
 * accepts a direct {@link LibundlerConfig} object, or a function that returns {@link RollupOptions}.
 */
export function defineConfig(config: LibundlerConfigObject): LibundlerConfigObject
export function defineConfig(config: LibundlerConfigArray): LibundlerConfigArray
export function defineConfig(config: LibundlerConfigFn): LibundlerConfigFn
export function defineConfig(config: any) {
  return config
}

export type LibundlerConfig = LibundlerConfigObject | LibundlerConfigArray | LibundlerConfigFn
export type LibundlerConfigFn = (defaultRollupOptions: Partial<RollupOptions>) => RollupOptions
export type LibundlerConfigArray = Array<LibundlerConfigObject>
export interface LibundlerConfigObject {
  /**
   * Library name.
   * @default auto pascalify by `<package.json>.name`
   * @example 'JsMusicPlayer'
   */
  libName: string

  /**
   * Entry file path.
   * @default 'src/index.js'
   */
  entry?: string

  /**
   * Output bundle file dir.
   * @default 'dist'
   */
  outDir?: string

  /**
   * Output bundle file name.
   * @default auto kebab-case by `<package.json>.name`
   * @example 'js-music-player'
   */
  outFileName?: string

  /**
   * File header of output bundle file, `false` to disable.
   * @see [banner template](https://github.com/surmon-china/libundler/blob/main/src/banner.ts)
   * @default <banner template>
   */
  banner?: false | string

  /**
   * Generate sourcemap, `false` to disable.
   * @see [banner template](https://rollupjs.org/guide/en/#outputsourcemap)
   * @default true
   */
  sourcemap?: OutputOptions['sourcemap']

  /**
   * Output bundle module types.
   * @type `TargetBundleModuleType`
   * @default ['umd', 'esm', 'cjs']
   */
  targets?: TargetModuleType[]

  /**
   * Bundle file export mode.
   * @type `OutputOptions.exports`
   * @see [rollup - output.preserveModules](https://rollupjs.org/guide/en/#outputpreservemodules)
   * @default 'auto'
   */
  exports?: OutputOptions['exports']

  /**
   * Locate and bundle third-party dependencies in `node_modules`, `@rollup/plugin-node-resolve` options.
   * @see [@rollup/plugin-node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve)
   * @default {}
   */
  nodeResolve?: false | RollupNodeResolveOptions

  /**
   * Define which locates modules, `@rollup/plugin-commonjs` options.
   * @see [@rollup/plugin-commonjs](https://github.com/rollup/plugins/tree/master/packages/commonjs)
   * @default {}
   */
  commonjs?: RollupCommonJSOptions

  /**
   * Define and resolve aliases for bundle dependencies, `@rollup/plugin-alias` options.
   * @see [@rollup/plugin-alias](https://github.com/rollup/plugins/tree/master/packages/alias)
   * @default {}
   */
  alias?: false | RollupAliasOptions

  /**
   * Replace strings in files while bundling, `@rollup/plugin-replace` options.
   * @see [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace)
   * @default
   * {
   *   preventAssignment: true,
   *   'PACKAGE_VERSION': <package.json>.version,
   *   'process.env.NODE_ENV': '"production"'
   * }
   */
  replace?: RollupReplaceOptions

  /**
   * Treating `[module]` as external dependency.
   * @see [rollup - peer-dependencies](https://rollupjs.org/guide/en/#peer-dependencies)
   * @see [rollup - warning-treating-module-as-external-dependency](https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency)
   * @default []
   */
  external?: ExternalOption

  /**
   * Provide global variable names to replace your external imports.
   * @see [rollup - output-globals](https://rollupjs.org/guide/en/#outputglobals)
   * @default {}
   */
  globals?: GlobalsOption

  /**
   * Rollup parser type. `false` to disable.
   * @type `false` | `'babel'` | `'buble'`
   * @default 'buble'
   */
  parser?: false | ParserType

  /**
   * Rollup parser plugin options.
   * @type `@rollup/plugin-babel` options | `@rollup/plugin-buble` options
   * @see
   * - [@rollup/plugin-babel](https://github.com/rollup/plugins/tree/master/packages/babel)
   * - [@rollup/plugin-buble](https://github.com/rollup/plugins/tree/master/packages/buble)
   * @default {}
   */
  parserOptions?: Record<string, unknown>

  /**
   * Rollup postcss plugin options, defined to overwrite the default options.
   * @see [rollup-plugin-postcss](https://github.com/egoist/rollup-plugin-postcss)
   * @default {}
   */
  postcss?: Partial<PostCSSPluginConf>

  /**
   * Rollup JSON plugin options, defined to overwrite the default options.
   * @see [@rollup/plugin-json](https://github.com/rollup/plugins/tree/master/packages/json)
   * @default {}
   */
  json?: RollupJsonOptions

  /**
   * Rollup TypeScript plugin options, `false` to disable.
   * @see [@rollup/plugin-typescript](https://github.com/rollup/plugins/tree/master/packages/typescript)
   * @default false
   */
  typescript?: false | Partial<RollupTypescriptOptions>

  /**
   * Enable TS plugin (before build), `false` to disable.
   * @see [rollup-plugin-ts](https://github.com/wessberg/rollup-plugin-ts)
   * @default auto enable by `<package.json>.devDependencies`
   */
  ts?: false | Partial<TypescriptPluginOptions>

  /**
   * This is a plugin that lets you roll-up your .d.ts definition files.
   * @see[rollup-plugin-dts](https://github.com/Swatinem/rollup-plugin-dts)
   * @default false
   */
  dts?: false | Partial<RollupDtsOptions>

  /**
   * Enable ESLint plugin (before build), `false` to disable.
   * @see [@rollup/plugin-eslint](https://github.com/rollup/plugins/tree/master/packages/eslint)
   * @default auto enable by `<package.json>.devDependencies`
   */
  eslint?: false | RollupEslintOptions

  /**
   * Enable compression, use terser, `false` to disable.
   * @see [rollup-plugin-terser](https://github.com/TrySound/rollup-plugin-terser)
   * @default true
   */
  terser?: boolean | RollupTerserOptions

  /**
   * Visualize and analyze this bundle file, use `rollup-plugin-visualizer`, `false` to disable.
   * @see [rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer)
   * @default false
   */
  visualizer?: boolean | PluginVisualizerOptions

  /**
   * Display the rollup config info, `true` to enable.
   * @default false
   */
  verbose?: boolean
  /**
   * watch file
   * @default true
   */
  watch?: boolean
}

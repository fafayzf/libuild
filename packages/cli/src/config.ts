import { resolve } from 'path'

import { TargetModuleEnum, TargetModuleType } from './constant'
import { EXTS, TS_NAME, TS_JSON_FILE,  getPackageJson } from './constant'

import type { OutputOptions, ExternalOption } from 'rollup'
import type { RollupNodeResolveOptions } from '@rollup/plugin-node-resolve'
import type { RollupTypescriptOptions } from '@rollup/plugin-typescript'

export interface DefaultConfig {
  /**
   * The name of the compiled file, defaults to the name in package.json
   */
  libraryName?: string,
  /**
   * Entry file, default ./src/index.{ts, js}, 
   * determine whether it is ts or js according to whether there is typescript dependency in the project's package.json
   */
  entry?: string,
  /**
   * dist directory, default dist
   */
  outDir?: string,
  /**
   * Whether to enable sourcemap
   */
  sourcemap?: boolean,
  /**
   * build target, optional, cjs, esm, umd
   */
  targets?: TargetModuleType[]
  /**
   * export mode, see https://rollupjs.org/guide/en/#outputpreservemodules
   */
  exports?: OutputOptions['exports'],
  /**
   * Configure @rollup/plugin-node-resolve, see https://github.com/rollup/plugins/tree/master/packages/node-resolve
   */
  nodeResolve?: false | RollupNodeResolveOptions,
  /**
   * Dependency module ID parsing, see https://rollupjs.org/configuration-options/#external
   */
  external?: ExternalOption,
  /**
   * Typescript configuration, tsconfig defaults to tsconfig.json in the root directory,
   *  and the default depends on whether there is typescript dependency configuration in package.json in the project
   */
  ts: false | Partial<RollupTypescriptOptions>,
  /**
   * Monitor mode, not enabled by default, monitor string path
   */
  watch: false | string,
  banner: string
}

export type PartialDefaultConfig = Partial<DefaultConfig>

export function getDefaultConfig() {
  const pkgJSON = getPackageJson()
  const deps = pkgJSON.dependencies
  const devDeps = pkgJSON.devDependencies

  const isTS = { ...deps, ...devDeps }[TS_NAME]

  const defaultConfig: PartialDefaultConfig = {
    libraryName: pkgJSON.name,
    entry: `./src/index.${isTS ? 'ts' : 'js'}`,
    outDir: './dist',
    sourcemap: true,
    targets: [TargetModuleEnum.ESM, TargetModuleEnum.CJS],
    exports: 'named',
    nodeResolve: {
      extensions: EXTS
    },
    ts: isTS 
      ? { tsconfig: resolve(TS_JSON_FILE) }
      : false,
    watch: false
  }

  return defaultConfig
}
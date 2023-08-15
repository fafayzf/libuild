import process from 'process'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { pathToFileURL } from 'url'
import { logger } from './logger'

/**
 * Find the root directory Look up according to package.json
 * @param dir 
 * @returns 
 */
function findRootDir(dir: string) {
  if (existsSync(join(dir, 'package.json'))) {
      return dir
  }
  const parentDir = dirname(dir)
  if (dir === parentDir) {
      return dir
  }
  return findRootDir(parentDir)
}

// constant
export const LIB_BUILD_NAME = 'build'
export const TS_NAME = 'typescript'
export type TargetModuleType = 'umd' | 'cjs' | 'esm'
export const enum TargetModuleEnum {
  UMD = 'umd',
  CJS = 'cjs',
  ESM = 'esm',
}

// extensions
export const EXTS = ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json', '.node']

// root path
export const CWD = process.cwd()
export const ROOT = findRootDir(CWD)
export const LIB_CONFIG_FILE = join(ROOT, 'libuild.config.mjs')
export const PACKAGE_JSON_FILE = join(ROOT, 'package.json')
export const TS_JSON_FILE = join(ROOT, 'tsconfig.json')

// config files
export function getPackageJson() {
  const rawJson = readFileSync(PACKAGE_JSON_FILE, 'utf-8')
  return JSON.parse(rawJson)
}

// dist files
export function getDistDir(distPath: string) {
  return join(ROOT, distPath)
}

/**
 * get file content
 * @param file 
 * @returns 
 */
export async function getFileAsync(file: string) {
  try {
    // https://github.com/nodejs/node/issues/31710
    // absolute file paths don't work on Windows
    return (await import(pathToFileURL(file).href)).default
  } catch(err) {
    logger.warn(`Failed to load file from ${file}`)
    return {}
  }
}
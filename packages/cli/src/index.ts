import consola from 'consola'
import { program } from 'commander'
import { resolve } from 'path'
import { logger, red } from './logger'
import { build } from './build'
import { watchDirectory } from './watch'

import { 
  LIB_BUILD_NAME, 
  LIB_CONFIG_FILE, 
  ROOT, getFileAsync
} from './constant'

consola.wrapAll()

program.configureOutput({
  writeOut: (str) => logger.info(str),
  writeErr: (str) => logger.warn(str),
  outputError: (str, write) => write(red(str)),
})

program
  .name(LIB_BUILD_NAME)
  .description('CLI to rollup build library packages')
  .usage('[build]')
  .command('build', { isDefault: true })
  .option('-c, --config <char>', 'custom config')
  .option('-w, --watch [char]', 'keep watch')
  .action(async (str) => {
    let config = await getFileAsync(LIB_CONFIG_FILE)
    if (str.config) {
      config = await getFileAsync(resolve(ROOT, str.config))
    }

    // is watch?
    if (str.watch || config.watch) {
      watchDirectory(
        typeof str.watch === 'boolean' ? './src/' : str.watch, 
        () => { build(config) }
      )
    } else {
      build(config).then(() => {
        process.exit(0)
      })
    }
  })

program.parse(process.argv)
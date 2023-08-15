# Rollup compilation tool

[![GitHub stars](https://img.shields.io/github/stars/fafayzf/yzfu-libundler.svg?style=for-the-badge)](https://github.com/fafayzf/yzfu-libundler/stargazers)
&nbsp;
[![GitHub issues](https://img.shields.io/github/issues-raw/fafayzf/yzfu-libundler.svg?style=for-the-badge)](https://github.com/fafayzf/yzfu-libundler/issues)
&nbsp;
[![npm](https://img.shields.io/npm/v/@yzfu/libundler?color=c7343a&label=npm&style=for-the-badge)](https://www.npmjs.com/package/@yzfu/libundler)
&nbsp;
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=for-the-badge)](/LICENSE)

📦 Universal JavaScript library bundler, powered by [Rollup](https://github.com/rollup).

- custom configuration file
- Violent monitoring, monitoring can be turned on

## Use

```sh

npm install @zhziu/rollup-build

```

## configuration file

Add a configuration file `libuild.config.mjs` in the project root directory, the file may not match

```js
// libuild.config.mjs
{
  libraryName: 'demo'  // export package name
  targets: ['esm', 'cjs', 'umd'] // build target
}

```

## Build

In `package.json` add:

```json
// -w Enable monitoring, you can monitor the specified directory libbuild -w ./src/xxx/, default monitoring ./src/
// -c Specify configuration file, build -c ./config/index.js, default root directory libbuild.config.mjs
{
  "scripts": {
    "dev": "libuild -w",  
    "build": "libuild"
  }
}
```

## Compile result

- dist
  - node
    - index.js
    - index.js.map
  - node-cjs
    - index.cjs
    - index.cjs.map
  - types
    - index.d.ts

## Configuration file parameter description

### library
The compiled file name, the compiled file name, defaults to the name in package.json

The scope symbol (`@`) will be ignored for conversion, for example: `@yzfu/-xxx` -> `yzfu-xxx`

### entry
Entry file, default ``./src/index.{ts, js}``,

Determine whether it is `ts` or `js` according to whether there is `typescript` dependency in `package.json` of the project

### outDir 
After compiling `dist` directory, the default root directory generates `dist`

### sourcemap
Whether to enable sourcemap

### targets
build target, optional, cjs, esm, umd

### exports
export mode, see https://rollupjs.org/guide/en/#outputpreservemodules

### nodeResolve 
Configure @rollup/plugin-node-resolve, see https://github.com/rollup/plugins/tree/master/packages/node-resolve

### external
Dependency module ID parsing, see https://rollupjs.org/configuration-options/#external

example：
```js
export default {
  external: {
    'vue': 'Vue',
    'vue-router': 'VueRouter'
  }
}
```
### ts
`typescript` configuration, `tsconfig` defaults to `tsconfig.json`` in the root directory, 
and the default configuration depends on whether `typescript` exists in `package.json` in the project

### watch
Monitor mode, not enabled by default, monitor string path, for example:

```js
export default {
  watch: './src/'
}
```
# libundler
[英文文档](./README.md)

**2023-08-02**: 升级 rollup 以及一些插件

**2023-08-01**: 添加插件 rollup-plugin-dts

**2023-07-24**: 默认监听`watch`改为`true`

[![GitHub stars](https://img.shields.io/github/stars/fafayzf/yzfu-libundler.svg?style=for-the-badge)](https://github.com/fafayzf/yzfu-libundler/stargazers)
&nbsp;
[![GitHub issues](https://img.shields.io/github/issues-raw/fafayzf/yzfu-libundler.svg?style=for-the-badge)](https://github.com/fafayzf/yzfu-libundler/issues)
&nbsp;
[![npm](https://img.shields.io/npm/v/@yzfu/libundler?color=c7343a&label=npm&style=for-the-badge)](https://www.npmjs.com/package/@yzfu/libundler)
&nbsp;
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=for-the-badge)](/LICENSE)

📦 Universal JavaScript library bundler, powered by [Rollup](https://github.com/rollup).

---

### 使用

#### 1. 下载

```bash
npm install @yzfu/libundler --save-dev
```

也可以使用 `yarn` 或 `pnpm`.


#### 2. 添加脚本 `build` 至 `package.json`

```json
"scripts": {
  "build": "libundler"
}
```


#### 3. 运行

```bash
yarn build
```

---

### 配置

默认情况下，你不需要指定配置文件，`libundler`会根据你的`package.json`为`bundle`生成一个近乎完美的配置。

但如果您有更具体的需求，您可以在项目根目录中创建`libundler.config.js`或`libundler.config.ts`

[**libundler 配置接口**](/src/interface.ts)

- `LibundlerConfigObject`
- `LibundlerConfigObject[]`
- `(defaultRollupConfig) => RollupConfig`

**配置示例项目:**

- [javascript nope config](/tests/nope-config)
- [javascript `cjs` format config](/tests/cjs-config)
- [javascript `esm` format config](/tests/esm-config)
- [typescript](/tests/typescript)
- [react-jsx-scss](/tests/react-jsx-scss)
- [react-tsx](/tests/react-tsx)

**对象配置示例:**

```ts
// libundler.config.js

/** @type {import('@surmon-china/libundler/lib/interface').LibundlerConfigObject} */
module.exports = {
  entry: 'src/index.js',
  // ...
}
```

**数组配置示例:**

```ts
// libundler.config.js

/** @type {import('@surmon-china/libundler/lib/interface').LibundlerConfigArray} */
module.exports = [
  {
    entry: 'src/index.ts',
    // ...
  },
  {
    entry: 'src/entry.ts',
    // ...
  },
]
```

**函数配置示例:**

```ts
// libundler.config.js

/** @type {import('@surmon-china/libundler/lib/interface').LibundlerConfigFn} */
module.exports = (rollupConfig) => {
  // overwrite the Rollup config
  rollupConfig.plugins.push(/* ... */)

  // ...
  return rollupConfig
}
```

**`esm` 配置示例:**

```ts
// libundler.config.js
export default {
  entry: 'src/index.js',
  // ...
}
```

**`.ts` 配置示例:**

```ts
// libundler.config.ts
import { defineConfig } from '@surmon-china/libundler'

export default defineConfig({
  entry: 'src/index.js',
  // ...
})
```

### JavaScript API

```js
const libundler = require('@surmon-china/libundler')

libundler
  .bundle({
    /* LibundlerConfig */
  })
  .then((result) => {
    console.log('bundle success', result)
  })
  .catch((error) => {
    console.log('bundle error', error)
  })
```

### 开发

```bash
yarn dev

yarn lint

yarn build

yarn release
```

### License

[MIT](/LICENSE)

'use strict'
// 简单来说，vue-loader 就是处理 .vue 文件的。
const utils = require('./utils')
// utils配置文件用来解决css相关文件loader
const config = require('../config')
 // 生产和开发环境的相关属性
const isProduction = process.env.NODE_ENV === 'production'
// 判断当前是否生产环境
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap

module.exports = {
  // 这里调用了utils类生成样式loader的配置
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: isProduction
  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  // 在模版编译过程中，编译器可以将某些属性，如 src 路径，转换为require调用，以便目标资源可以由 webpack 处理.
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}

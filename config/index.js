'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths// path：用来存放打包后文件的输出目录
    assetsSubDirectory: 'static',
    assetsPublicPath: '/', // publicPath：指定资源文件引用的目录
    proxyTable: {}, // 代理示例： proxy: [{context: ["/auth", "/api"],target: "http://localhost:3000",}]

    // 开发服务器变量设置
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true, //这个就是用于配置自动打开浏览器的，可以不用  open-browser-webpack-plugin 插件
    errorOverlay: true,// 浏览器错误提示 devServer.overlay
    notifyOnErrors: true, // 配合 friendly-errors-webpack-plugin
    poll: false, // 使用文件系统(file system)获取文件改动的通知devServer.watchOptions

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    // eslint是一种代码检测工具，检测是否语法规则和代码风格的工具
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    // 生成source map，source map 用于将编辑后的代码映射回源代码，方便调试
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: true,// production 下是生成 sourceMap
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}

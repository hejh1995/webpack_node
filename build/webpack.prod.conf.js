'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
// copy-webpack-plugin复制文件或者文件夹到指定的目录的
const CopyWebpackPlugin = require('copy-webpack-plugin')
// html-webpack-plugin是生成html文件，可以设置模板
const HtmlWebpackPlugin = require('html-webpack-plugin')
// extract-text-webpack-plugin这个插件是用来将bundle中的css等文件分离到指定.css文件
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// optimize-css-assets-webpack-plugin插件的作用是压缩css代码的，
//还能去掉extract-text-webpack-plugin插件抽离文件产生的重复代码，
//因为同一个css可能在多个模块中出现所以会导致重复代码，换句话说这两个插件是两兄弟
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : require('../config/prod.env')
// 把当前的配置对象和基础的配置对象合并
const webpackConfig = merge(baseWebpackConfig, {
  module: {
    // 下面就是把utils配置好的处理各种css类型的配置拿过来
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,//生成独立的文件
      usePostCSS: true
    })
  },
  // devtool开发工具，用来生成个sourcemap方便调试
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {//打包后的文件目录
    path: config.build.assetsRoot,
    // 文件名称使用 static/js/[name].[chunkhash].js, 其中name就是main,chunkhash就是模块的hash值，用于浏览器缓存的
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    // chunkFilename是非入口模块文件，也就是说filename文件中引用了chunckFilename
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new UglifyJsPlugin({
      // UglifyJsPlugin插件是专门用来压缩js文件的
      uglifyOptions: {
        compress: {
          warnings: false// 禁止压缩时候的警告信息，给用户一种vue高大上没有错误的感觉
          drop_console: true//删除 console 语句，
        }
      },
      // 压缩后生成map文件
      sourceMap: config.build.productionSourceMap,
      comments: false,// 删除注释
      parallel: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      // 生成独立的css文件，下面是生成独立css文件的名称
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true,
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      // 压缩CSS文件。不同组件的相同的css会被删除
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    // 生成html页面
    new HtmlWebpackPlugin({
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : config.build.index,
      template: 'index.html',
      inject: true,// 将js文件放到body标签的结尾
      minify: { // 压缩产出后的html页面
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'// 生成html插入js的时候的顺序，manual手动排序，auto基于id排序，dependency 基于依赖关系排序
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // split vendor js into its own file
    // 将打包后的文件中的第三方库文件抽取出来，便于浏览器缓存，提高程序的运行速度
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      // 将所有依赖于node_modules下面文件打包到vendor中
      minChunks (module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    // 把webpack的runtime代码和module manifest代码提取到manifest文件中，防止修改了代码但是没有修改第三方库文件导致第三方库文件也打包的问题
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),

    // copy custom static assets
    // 复制静态文件
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

if (config.build.productionGzip) {
  // 开启Gzi压缩打包后的文件，老铁们知道这个为什么还能压缩吗？？，就跟你打包压缩包一样，把这个压缩包给浏览器，浏览器自动解压的
    // 你要知道，vue-cli默认将这个神奇的功能禁用掉的，理由是Surge 和 Netlify 静态主机默认帮你把上传的文件gzip了
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(// 这里是把js和css文件压缩
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  // 打包编译后的文件打印出详细的文件信息，vue-cli默认把这个禁用了，个人觉得还是有点用的，可以自行配置
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig

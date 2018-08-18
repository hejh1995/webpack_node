// 在项目开发环境下使用
'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
//merge 进行合并对象，相同项目会进行覆盖
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// HtmlWebpackPlugin 一个自动生成html 的插件，能把资源文件自动加载到html文件中
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
// FriendlyErrorsPlugin 一个用来把webpack的错误和日志收集起来，漂亮的展示给用户的插件
const CleanWebpackPlugin = require('clean-webpack-plugin')
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)
// process对象是一个全局对象，在任何地方都能访问到它，通过这个对象提供的属性和方法，使我们可以对当前运行的程序的进程进行访问和控制。
// process.env 获取当前系统环境信息的对象，常规可以用来进一步获取环境变量、用户名等系统信息。

//合并模块，第一个参数是webpack基本配置文件webpack.base.conf.js中的配置
const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    //创建模块时匹配请求的规则数组,这里调用了utils中的配置模板styleLoaders
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  //devtool是开发工具选项，用来指定如何生成sourcemap文件，cheap-module-eval-source-map此款soucemap文件性价比最高
  devtool: config.dev.devtool,

  devServer: { // webpack服务器配置
    clientLogLevel: 'warning',//使用内联模式时，在开发工具的控制台将显示消息，可取的值有none error warning info
    historyApiFallback: {
      //当使用h5 history api时，任意的404响应都可能需要被替代为index.html，通过historyApiFallback：true控制；
      // 通过传入一个对象，比如使用rewrites这个选项进一步控制
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    //是否启用webpack的模块热替换特性。这个功能主要是用于开发过程中，对生产环境无帮助。效果上就是界面无刷新更新。
    contentBase: false, // since we use CopyWebpackPlugin. 这里禁用了该功能。本来是告诉服务器从哪里提供内容，一般是本地静态资源。
    compress: true, // 一切服务是否都启用gzip压缩
    host: HOST || config.dev.host, //指定一个host,默认是localhost。如果有全局host就用全局，否则就用index.js中的设置。
    port: PORT || config.dev.port, //指定端口
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay //当有编译器错误时，是否在浏览器中显示全屏覆盖。
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath, //此路径下的打包文件可在浏览器中访问
    proxy: config.dev.proxyTable, // 如果你有单独的后端开发服务器api,并且希望在同域名下发送api请求，那么代理某些URL会很有用。
    quiet: true, // necessary for FriendlyErrorsPlugin
    // 启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见。
    watchOptions: {
      poll: config.dev.poll,//是否使用轮询
    }
  },
  plugins: [
    // DefinePlugin 允许你创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用。
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    // HotModuleReplacementPlugin 允许在运行时更新各种模块，而无需完全刷新。
    new webpack.HotModuleReplacementPlugin(),
    // NamedModulesPlugin，以便更容易查看要修补(patch)的依赖。
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    // 在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段。这样可以确保输出资源不会包含错误。对于所有资源，统计资料(stat)的 emitted 标识都是 false
    new webpack.NoEmitOnErrorsPlugin(),
    // CleanWebpackPlugin 打包之前把目录文件清除干净。
    new CleanWebpackPlugin(['dist']),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      // title 是生成html文件的标题
      // filename 是html文件的标题
      // template 指定生成文件所依赖的html文件模板
      // inject: true 默认值，script标签位于html文件的 body 底部
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([ //将单个文件或整个文件复制到构建目录
      {
        from: path.resolve(__dirname, '../static'),//将static文件夹及其子文件复制到
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})
//webpack将运行由配置文件导出的函数，并且等待promise返回，便于需要异步地加载所需的配置变量。
module.exports = new Promise((resolve, reject) => {
  // portfinder 帮你找到正在运行的进程打开了哪些端口
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({// 出错友好处理插件
        compilationSuccessInfo: {//build 成功会执行
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors //如果出错就执行这块,其实是utils里面配置好的提示信息
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})

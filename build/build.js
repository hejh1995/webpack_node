'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production' // 设置当前环境为生产环境

const ora = require('ora') //loading...进度条
const rm = require('rimraf') //删除文件 'rm -rf'
const path = require('path')
const chalk = require('chalk') // chalk插件，用来在命令行中输入不同颜色的文字
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

const spinner = ora('building for production...')
spinner.start()
// 清空文件夹 ，第一个参数的结果就是 dist/static，表示删除这个路径下面的所有文件
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    // 编译完成，输出编译文件。process.stdout.write和console.log类似，输出对象
    process.stdout.write(stats.toString({// stats对象中保存着编译过程中的各种消息
      colors: true,// 增加控制台颜色开关
      modules: false, // 不增加内置模块信息
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.// 不增加子级信息
      chunks: false,// 允许较少的输出
      chunkModules: false// 不将内置模块的信息加到包信息
    }) + '\n\n')
    // 以上就是在编译过程中，持续打印消息
    // 下面是编译成功的消息
    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
// 注: 如果你想自己编写一个高质量的脚手架工具，建议你:
// 去补习nodejs，然后补习 es6，然后再来看webpack官方文档，然后自己独立编写一个和vue-cli类似的脚手架，如果上面的东西看不懂，更要这样做
// vue-cli还有一部分内容是关于代码测试的，可以说这块内容的复杂度不亚于webpack，这些内容对nodejs要求比较熟悉，说白了就是基础弱的很难入门，
// 但是测试这块内容也是非常有价值的，可以借助无界面的浏览器解析引擎，通过一句命令就可以把你的代码在不同的平台上运行，还能指出问题所在。

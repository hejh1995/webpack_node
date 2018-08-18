'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
// webpack.base.config.js 用于通用的配置

//1、path模块是路径设置，不论是在这个配置中还是其他配置中，都是必不可少的。
//2、util是对vue-loader对于css预编译一些提取的工具模块，因为对于个人开发而言，里面提供了sass,less,stylus,possCss等一系列预编译解析的loader。
//3、config是对开发环境和生产环境的一系列不同参数的路径等配置。
//4、vueLoaderConfig也是同样基础生产环境和开发环境对vue-loader进行配置。

function resolve (dir) {
  return path.join(__dirname, '..', dir)
  // path 是node.js中的，join用于路径连接，__dirname表示存储文件所在的文件目录，是全局变量
}
//eslint 的检测规则
const createLintingRule = () => ({
    //对js和vue 文件进行eslint 检查
    test: /\.(js|vue)$/,
    //使用eslint-loader
    loader: 'eslint-loader',
    //enforce执行的意思 有两个值 pre post
    //pre是在其他规则执行之前执行 post是在其他规则执行之后执行
    enforce: 'pre',
    //进行检测的文件目录包括哪些 调用了路径函数，
    include: [resolve('src'), resolve('test')],
    options: {
      //使用第三方的插件进行eslint 检测
        formatter: require('eslint-friendly-formatter'),
        //是否输出eslint报错信息
        emitWarning: !config.dev.showEslintErrorsInOverlay
    }
})
//webpack的配置，可以理解成是开发环境和正式环境的一些公共配置
module.exports = {
    //webpack 解析时根目录地址如果此文件在跟目录这句话就不用写
    context: path.resolve(__dirname, '../'),
    // path.resolve([from...],to)将to参数解析为绝对路径
    //webpack 解析时根目录地址

    // 入口文件
    entry: {
      app: './src/main.js'
       // main.js是webpack的入口文件，在main.js中加载的是App.vue文件，
       // 所以App.vue是渲染的入口，在main.js的里面#app指代的是index.html里的id为app的DOM元素。
    },
    // 出口文件
    output: {
      path: config.build.assetsRoot,
      // path 代表输出路径。
      filename: '[name].js',
      // 这个是用来打包后出的文件名，为什么用name，因为会打包出来三个文件，第一个是源代码文件，
      // 第二个是runtime文件，第三个是ventor文件，所以每个文件打包出来的名字就跟定义的chunkname一致。
      publicPath: process.env.NODE_ENV === 'production'
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath
      //3、publicPath...是静态文件访问的路径，这个要根据你的静态文件的loader进行拼接配置。
    },
    //resolve是用来对模块进行解析，就是所谓的libary第三方库
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      //指定哪些文件在引用时可以省略后缀名
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': resolve('src'),
      }
      //2、alias是配置别名，什么是别名呢，如果你在一个很深的文件引入其他文件中又一个很深的文件，
      //相对路径会写到吐血，那用别名我们定入一个入口位置，我们用@来代替src目录的绝对路径，此时就
      //用到了上面function resolve封装的函数，此时绝对路径就定位到了src目录，因为我们所有文件
      //都放在src目录下，就可以通过src目录直接定位到你想要找的文件。
    },
    // 资源管理
    module: {
      //转换解析规则
      //1.test是用来解析所有此后缀名的文件，
      //2.loader我们用什么npm什么形式的loader去解析
      //3.include是代表我们解析的文件只包含那些东西
      //4.options解析文件参数设置 具体看下面的解释
      rules: [
        ...(config.dev.useEslint ? [createLintingRule()] : []),
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: vueLoaderConfig
          // 对所有.vue文件使用vue-loader，对vue的css进行解析
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
          // babel-loader是进行es6转换成es5的
          // 对 src、test 和 node_modules/webpack-dev-server/client 文件夹下的.js文件使用babel-loader
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('img/[name].[hash:7].[ext]')
          }
          // 对图片资源文件使用url-loader，name指明了输出的命名规则

          // url-loader会将引入的图片编码，生成dataURl。相当于把图片数据翻译成一串字符。
          // 再把这串字符打包到文件中，最终只需要引入这个文件就能访问图片了。
          // 当然，如果图片较大，编码会消耗性能。因此url-loader提供了一个limit参数，
          // 小于limit字节的文件会被转为DataURl，大于limit（这里是10000kb）的还会使用file-loader进行copy。

          // webpack最终会将各个模块打包成一个文件，
          // 因此我们样式中的url路径是相对入口html页面的，而不是相对于原始css文件所在的路径的。
          // 这就会导致图片引入失败。这个问题是用file-loader解决的，file-loader可以解析项目中的url引入（不仅限于css），
          // 根据我们的配置，将图片拷贝到相应的路径，再根据我们的配置，修改打包后文件引用路径，使之指向正确的文件。
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('media/[name].[hash:7].[ext]')
          }
        },
        {
          //对字体资源文件使用url-loader，name指明了输出的命名规则
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
          }
        }
      ]
    },
    // node 主要是阻止一些webpack的默认注入行为，因为在vue中已经具备了这些功能
    node: {
      setImmediate: false,
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    }
}

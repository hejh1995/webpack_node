<!-- .babelrc ---- 设置转码规则
.editorconfig ---- 配置编译器的编码风格
  {
  charset：文件编码。
  indent_style: 缩进类型。space或tab。
  indent_size: 缩进数量。2/4/tab
  insert_final_newline：是否在文件的最后插入一个空行。
  trim_trailing_whitespace ：是否清除一行结尾的空格
  end_of_line：换行符格式。
}
.eslintignore ---- 想要引入三方js库，但是这些库不符合eslint规范，可以在这个文件里忽略掉
.eslintrc.js ---- 负责代码规范，引入插件
.gitignore ---- 不需要加入版本管理的文件
package-lock.json是当 node_modules 或 package.json 发生变化时自动生成的文件。这个文件主要功能是确定当前安装的包的依赖，以便后续重新安装的时候生成相同的依赖，
            而忽略项目开发过程中有些依赖已经发生的更新。为的是让开发者知道只要你保存了源文件，到一个新的机器上、或者新的下载源，
            只要按照这个package-lock.json所标示的具体版本下载依赖库包，就能确保所有库包与你上次安装的完全一样。
package.json ---- 配置项目要用到的依赖插件，这个文件一般不会手动更改，而是使用npm install xxxx 来安装插件，
    然后这个文件自动被修改。scripts节点配置命令的执行文件。运行npm run dev执行build/dev-server.js，
    运行npm run build的时候执行待是build/build.js文件。 -->
    
    

# my-blog

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

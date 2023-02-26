// module.exports = {
//     publicPath: "/xs_music/"
// }
const path = require('path')
const webpack = require("webpack")
const CompressionWebpackPlugin = require("compression-webpack-plugin")
const productionGzipExtensions = ["js", "css"]


module.exports = {
    publicPath: '/dist/',
    productionSourceMap: false,
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@assets', path.join(__dirname, './src/assets'))
            .set('@components', path.join(__dirname, './src/components'))
            .set('@plugins', path.join(__dirname, './src/plugins'))
            .set('@views', path.join(__dirname, './src/views'))
            .set('@apis', path.join(__dirname, './src/apis'))
            .set('@utils', path.join(__dirname, './src/utils'))

        config.resolve.extensions
            .add('.js')
            .add('.vue')

        const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
        types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
    },
    configureWebpack: (config) => {
        const plugins = []
        //start 生成gzip压缩文件
        plugins.push(
        // Ignore all locale files of moment.js
        new webpack.IgnorePlugin(/^\.\/locale$/,/moment$/),
  
        // 配置compression-webpack-plugin压缩
        new CompressionWebpackPlugin({
            algorithm: "gzip",
            test: new RegExp("\\.(" +productionGzipExtensions.join("|") + ")$"),
            threshold: 10240,	//对10K以上的数据进行压缩
            minRatio: 0.8,
        }),
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 5,
          minChunkSize: 100,
        })
      )
      //end 结束生成gzip压缩文件
      config.plugins = [...config.plugins, ...plugins]
    }

}

function addStyleResource(rule) {
    rule.use('style-resource')
        .loader('style-resources-loader')
        .options({
            patterns: [
                path.resolve(__dirname, './src/assets/less/common.less'), // 需要全局导入的less
            ],
        })
}
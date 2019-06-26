const { smart } = require("webpack-merge");//合并
const base = require("./webpack.base.js");//主配置
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");//压缩css
const UglifyjsPlugin = require("uglifyjs-webpack-plugin");//压缩js插件
const webpack = require("webpack");
module.exports = smart(base,{
    mode: "production",
    devtool:"source-map",
    optimization:{//配置优化项
        minimizer:[
            new OptimizeCssAssetsWebpackPlugin({}),
            new UglifyjsPlugin({
                cache: true,//是否用缓存
                parallel: true,//是否并发压缩 压缩多个
            })
        ],
        splitChunks: {//分隔代码块
            cacheGroups: {//缓存组
                common: {
                    chunks: "all",//从哪开始抽离 从入口抽离
                    minSize: 0,//大于0kb就抽离
                    minChunks: 2,//引用次数超过两次进行抽离
                    automaticNameDelimiter: '~',   // 打包分割符
                },
                vendor: {
                    priority: 1,//权重
                    test: /node_modules/,//只要引入了node_modules文件夹下面的内容 我就把你抽离出来
                    chunks: "all",
                    minSize: 0,//大于多少抽离
                    minChunks: 2,//引用次数超过两次进行抽离
                }
            }
        },
    },
    plugins:[
        new webpack.DefinePlugin({//定义环境
            DEV: JSON.stringify('PRO')
        }),
    ]
})
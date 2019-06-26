const { smart } = require("webpack-merge");//合并
const base = require("./webpack.base.js");//主配置
const webpack = require("webpack");

module.exports = smart(base,{
    mode: "development",
    devServer: {
        hot: true,
        contentBase: "./dist",
        overlay:{//当出现编译器错误警告时 显示一层黑色的背景
            errors:true,
        }
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({//定义环境
            DEV: JSON.stringify('DEV')
        }),
    ]    
    
})
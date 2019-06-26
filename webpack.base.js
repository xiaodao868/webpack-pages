const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const Happypack = require("happypack");//多线程打包
const fs = require("fs");
let PagesArray = fs.readdirSync(path.resolve(__dirname, "./src"));//读取src文件下面的文件夹名称
/***
 * 构建多页入口文件列表
 * **/
let entryPage = {};
PagesArray.map(item => {
    entryPage[item] = `./src/${item}/${item}.js`;
});
/***
 *  构建多页HtmlWebpackPlugin列表
 * **/
let HtmlWebpackPluginArray = [];
PagesArray.map(item => {
    HtmlWebpackPluginArray.push(
        new HtmlWebpackPlugin({
            template: `./src/${item}/${item}.html`,//模板文件位置
            filename: `${item}.html`,//输出后的文件名称
            chunks: ["common~about~home","vendor~about~home",item],//指定代码块 common~about~home为抽离的公共代码
        })  
    )
});

module.exports = {
    entry: entryPage,//多页入口
    output: {
        filename: "js/[name].js",
        path: path.resolve(__dirname, "dist"),
    },
    plugins: [
        ...HtmlWebpackPluginArray,
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "css/[name].[hash:8].css",
        }),
        
        // 多线程打包 js
        new Happypack({
            id: "js",
            use: [
                {//必须是数组
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env"
                        ]
                    }
                }
            ]
        }),
    ],
    resolve:{
        extensions:[".js"],//自动解析确定的扩展
    },
    module: {
        noParse: /jquery/,
        rules: [
            //处理页面内引入的路径
            {
                test: /\.html$/,
                use: "html-withimg-loader"
            },
            {
                test: /\.(jpg|png|jpeg)$/,
                exclude: /node_modules/,//不去此文件夹下面查找
                include: path.resolve("assets/img"),//去此文件夹下面查找
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 2 * 1024,//小于20kb 就使用base64
                        outputPath: "image/",//输出到此文件夹下面
                    }
                }
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,//不去此文件夹下面查找
                include: path.resolve("src"),//去此文件夹下面查找
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "../"
                        }
                    },
                    "css-loader",
                    "postcss-loader"
                ]
            },
            {
                test: /\.js$/,
                use: "Happypack/loader?id=js",
            },
        ]
    }
}

/***
 * 1.多入口 多出口
 * 2.解析css js img
 * 3.抽离公共代码       -------优化项
 * 4.多线程打包 js文件
 * 5.源码映射 利于调试
 * 6.noParse           -------优化项
 * 7.lgnorePlugin      -------优化项
 * 8.区分环境 webpack-merge
 * 
 * **/
const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const Webpack = require("webpack");
const webpackBanner =
  " project: vue-amis-sdk \n github https://github.com/h7ml/vue-amis-sdk \n author: h7ml(h7ml@qq.com) \n Time: ";
const dateTime = new Date();
const webpackBarName = "vue-amis-sdk";
const WebpackBar = require('webpackbar')


function resolve(dir) {
  return path.join(__dirname, "..", dir);
}

module.exports = {
  productionSourceMap: false,
  pages: {
    index: {
      entry: "examples/main.js",
      template: "public/index.html",
      filename: "index.html",
    },
  },
  chainWebpack: (config) => {
    if (process.env.BUILD_TARGET === "lib") {
      config.plugin("compressionPlugin").use(
        new CompressionPlugin({
          algorithm: "gzip", //开启gzip
          test: /\.js$|\.html$|\.css/, // 匹配文件名
          threshold: 2048, // 对超过10k的数据压缩
          deleteOriginalAssets: false, // 不删除源文件
        })
      );
      config
        .plugin("banner")
        .use(Webpack.BannerPlugin, [`${webpackBanner}${dateTime}`]);
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              warnings: false,
              drop_debugger: true, // 注释console
              drop_console: true,
              pure_funcs: ["console.log"], // 移除console
            },
          },
          sourceMap: false,
          parallel: true,
        })
      );
      config.devtool = false;
      config.externals = {
        vue: "Vue",
        axios: "axios",
        amis: "amis",
        "element-ui": "ELEMENT",
      };
    }
    config.module
      .rule("js")
      .include.add(resolve("packages"))
      .end()
      .use("bable")
      .loader("bable-loader")
      .tap((options) => {
        return options;
      });
  },
};

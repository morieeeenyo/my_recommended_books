const { VueLoaderPlugin } = require("vue-loader");
const path = require('path');
module.exports = {
  mode: "development",
  entry: './src/main.js',
  output: {
    path: `${__dirname}/../public/javascripts`,
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader'
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    watchContentBase: true,
    publicPath: '/public/javascripts',
    openPage: 'index.html'
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
    }
  },
  plugins: [new VueLoaderPlugin()]
} 
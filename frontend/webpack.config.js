const path = require('path');
module.exports = {
  // mode: 'development',
  entry: './src/main.js',
  output: {
    path: `${__dirname}/../public/javascripts`,
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[path][name].[ext]',//
              },
            },
          ],
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    watchContentBase: true,
    publicPath: '/public/javascripts',
    openPage: 'index.html'
  },
} 
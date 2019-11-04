const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  target: 'web',
  mode: 'development',
  entry: { app: './src/app.js' },
  output: {
    filename: '[name].js?[contenthash]',
    path: path.resolve(__dirname, './build/'),
  },
  devServer: {
    contentBase: path.resolve(__dirname, './src'),
    watchContentBase: true,
    compress: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      hash: false,
      filename: 'index.html',
      template: 'src/index.html',
    }),
    new CopyWebpackPlugin([
      {
        from: './src/screen.png',
        to: './',
      },
    ]),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              assetsPublicPath: '',
              outputPath: './',
              name: '[name].[ext]?[contenthash]',
            },
          },
        ],
      },
      {
        test: /\.(html)$/,
        use: [{
          loader: 'html-loader',
          options: {
            assetsPublicPath: '',
            minimize: true,
          },
        }],
      },
    ],
  },
};

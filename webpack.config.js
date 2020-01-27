const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyFilesPlugin = require('webpack-copyfiles-plugin');
const path = require('path')
const PATHS = {
    src: path.join(__dirname, './src'),
    dist: path.join(__dirname, './dist'),
    assets: 'assets/'
  }
  
let conf = {
    externals: {
        paths: PATHS
    },
    entry: {
        app: PATHS.src
    },
    output: {
        filename: `${PATHS.assets}js/[name].js`,
        path: PATHS.dist,
        publicPath: '/'
    },
    module: {
        rules: [
            {
              test: /\.(js)$/,
              exclude: /node_modules/,
              use: ['babel-loader']
            },
            {
              test: /\.css$/,
              exclude: /node_modules/,
              use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
              test: /\.(png|jpg|gif|svg)$/,
              loader: 'file-loader',
              options: {
                name: '[name].[ext]'
              }
            },
            {
              test: /\.txt$/i,
              use: 'raw-loader',
            }
          ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist/assest'),
        compress: true,
        port: 9000
    },
    
    plugins: [
        new MiniCssExtractPlugin({
          filename: `${PATHS.assets}css/[name].css`,
        }),
        // Copy HtmlWebpackPlugin and change index.html for another html page
        new HtmlWebpackPlugin({
          hash: false,
          template: `${PATHS.src}/index.html`,
          filename: './index.html'
        }),
        new CopyWebpackPlugin([
          { from: `${PATHS.src}/img`, to: `${PATHS.assets}img` },
          { from: `${PATHS.src}/text`, to: `${PATHS.assets}text` },
        ])
      ]
};

module.exports = conf;
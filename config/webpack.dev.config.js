const autoprefixer = require('autoprefixer');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { LoaderOptionsPlugin, NamedModulesPlugin } = require('webpack');
const webpackMerge = require('webpack-merge');

const commonConfig = require('./webpack.common.js');
const { root, ASSETS, SRC, STYLES } = require('./utils');

module.exports = (env = {}) => {
  console.log('starting development build');

  return webpackMerge(commonConfig(env), {
    devtool: 'source-map',
    entry: {
      polyfills: root(SRC, 'polyfills.ts'),
      vendor: root(SRC, 'vendor.ts'),
      main: root(SRC, 'main.ts'),
      vendorStyles: root(SRC, STYLES, 'vendor.scss'),
      appStyles: root(SRC, STYLES, 'main.scss')
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.(js|ts)$/,
          loader: 'tslint-loader',
          include: root(SRC),
          exclude: [/node_modules/]
        },
        {
          test: /\.(ts|js)$/,
          use: ['ng-annotate-loader', 'awesome-typescript-loader'],
          include: [root(SRC)],
          exclude: [/\.(spec|e2e)\.(ts|js)$/]
        },
        {
          test: /\.html$/,
          loader: 'html-loader',
          include: [root(SRC)]
        },
        {
          test: /\.less$/,
          use: ['style-loader', 'css-loader?sourceMap', 'postcss-loader?sourceMap', 'less-loader?sourceMap']
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader?sourceMap', 'postcss-loader?sourceMap', 'sass-loader?sourceMap']
        },
        {
          test: /\.(png|jpg|ico|gif)$/,
          loader: 'url-loader'
        },
        {
          test: /\.(ttf|eot|svg|woff|woff2)(\?[a-z0-9]+)?$/,
          loader: 'url-loader'
        }
      ]
    },
    plugins: [
      new CommonsChunkPlugin({ name: ['polyfills', 'vendor'].reverse() }),
      new HtmlWebpackPlugin({
        template: root(SRC, 'index.html'),
        chunksSortMode: 'dependency',
        favicon: root(SRC, ASSETS, 'favicon.ico')
      }),
      new LoaderOptionsPlugin({
        minimize: false,
        debug: true,
        options: {
          postcss: [autoprefixer({ browsers: ['last 2 versions'] })],
          context: __dirname
        }
      }),
      new NamedModulesPlugin()
    ]
  });
};

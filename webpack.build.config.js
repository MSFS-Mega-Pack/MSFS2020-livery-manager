const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');
require('dotenv').config();

module.exports = {
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.jsx?$/,
        use: [{ loader: 'babel-loader', query: { compact: false } }],
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [{ loader: 'file-loader?name=img/[name]__[hash:base64:5].[ext]' }],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [{ loader: 'file-loader?name=font/[name]__[hash:base64:5].[ext]' }],
      },
    ],
  },
  target: 'electron-renderer',
  plugins: [
    new HtmlWebpackPlugin({ title: 'FS2020 Livery Manager' }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'bundle.css',
      chunkFilename: '[id].css',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new TerserPlugin(),
    process.env.SENTRY_AUTH_TOKEN
      ? new SentryWebpackPlugin({
          // sentry-cli configuration
          authToken: process.env.SENTRY_AUTH_TOKEN,
          org: 'gewoonjaap',
          project: 'msfs-api',

          // webpack specific configuration
          include: '.',
          ignore: ['node_modules', 'webpack.build.config.js', 'webpack.dev.config.js'],
        })
      : console.log('WARNING: NOT UPLOADING SOURCE MAPS TO SENTRY!\n\nMISSING API KEY!') && false,
  ].filter(Boolean),
  stats: {
    colors: true,
    children: false,
    chunks: false,
    modules: false,
  },
};

const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { spawn } = require('child_process');
const PackageJson = require('./package.json');

module.exports = {
  mode: 'development',
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
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            babelrc: false,
            presets: [['@babel/preset-env', { targets: { browsers: 'last 1 Electron version' } }], '@babel/preset-react'],
            plugins: [
              ['@babel/plugin-proposal-class-properties', { loose: true }],
              '@babel/plugin-proposal-export-default-from',
              '@babel/plugin-proposal-export-namespace-from',
            ],
          },
        },
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
    new HtmlWebpackPlugin({ title: PackageJson.productName }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
  devtool: 'inline-source-map',
  devServer: {
    hot: true,
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    devMiddleware: {
      stats: {
        colors: true,
        chunks: false,
        children: false,
      },
    },
    onBeforeSetupMiddleware() {
      spawn('electron', ['.'], {
        shell: true,
        env: process.env,
        stdio: 'inherit',
      })
        .on('close', code => process.exit(0))
        .on('error', spawnError => console.error(spawnError));
    },
  },
};

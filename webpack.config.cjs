const { resolve } = require('node:path');
const CSSPlugin = require('mini-css-extract-plugin');

const isDev = process.env.NODE_ENV !== 'production';

module.exports = ['login', 'register'].map((file) => ({
  name: file,
  mode: isDev ? 'development' : 'production',
  entry: resolve('app', 'js', file + '.js'),
  output: {
    path: resolve('public', 'assets'),
    filename: file + '.js'
  },
  devtool: isDev ? 'inline-source-map' : false,
  watch: true,
  watchOptions: {
    ignored: ['node_modules', 'public', 'scripts', 'src'].map((p) => resolve(p))
  },
  resolve: {
    extensions: ['.js', '.mjs']
  },
  plugins: [new CSSPlugin({ filename: file + '.css' })],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          CSSPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          'postcss-loader'
        ]
      }
    ]
  },
  stats: 'errors-warnings'
}));

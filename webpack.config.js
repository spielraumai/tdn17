const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: {
    index: [
      'babel-polyfill', path.resolve('src/index.js')
    ],
  },
  output: {
    path: path.join(__dirname, 'build'),
    library: '[name]',
    libraryTarget: 'commonjs2',
    filename: '[name].js',
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
}


module.exports = {
  entry: {
    './': './index.js',
    'questList/': './questList/index.js'
  },
  output: {
    path: __dirname,
    filename: '[name]bundle.js'
  },
  module: {
    loaders: []
  }
}

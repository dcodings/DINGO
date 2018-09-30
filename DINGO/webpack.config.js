const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  mode: 'development',
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    dns: 'empty'
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname)
  }
};


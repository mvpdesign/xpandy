import path from 'path';

export default () => ({
  mode: 'production',
  entry: './src/xpandy.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'xpandy-bundle.js',
    library: 'Xpandy',
    libraryTarget: 'umd'
  }
});

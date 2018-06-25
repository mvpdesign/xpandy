import path from 'path';

export default () => ({
  mode: 'production',
  entry: {
    main: './src/index.js',
    polyfill: './src/polyfill.js'
  },
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
    filename: 'xpandy-[name].min.js',
    library: 'Xpandy',
    libraryTarget: 'umd'
  }
});

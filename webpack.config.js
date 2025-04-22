const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

// Load .env file
const env = dotenv.config().parsed || {};

// Convert env variables to strings for webpack definePlugin
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = {
  entry: './src/index.ts',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "crypto": require.resolve("crypto-browserify"),
      "fs": false,
      "buffer": require.resolve("buffer/"),
      "stream": require.resolve("stream-browserify")
    }
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'mistralConnector',
      type: 'umd',
    },
    globalObject: 'this',
  },
  plugins: [
    new webpack.DefinePlugin(envKeys),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    })
  ],
}; 
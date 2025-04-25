const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const TerserPlugin = require('terser-webpack-plugin');

// Load .env file
const env = dotenv.config().parsed || {};

// Convert env variables to strings for webpack definePlugin
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

// Common configuration 
const commonConfig = {
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
  plugins: [
    new webpack.DefinePlugin(envKeys),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    })
  ],
};

// Create two configurations: one for the regular bundle and one for the minified version
module.exports = [
  // Regular bundle
  {
    ...commonConfig,
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
      library: {
        name: 'MistralFormat',
        type: 'umd',
        export: 'default',
        umdNamedDefine: true
      },
      globalObject: 'typeof self !== \'undefined\' ? self : this',
    },
  },
  // Minified bundle
  {
    ...commonConfig,
    output: {
      filename: 'mistral-format.min.js',
      path: path.resolve(__dirname, 'dist'),
      library: {
        name: 'MistralFormat',
        type: 'umd',
        export: 'default',
        umdNamedDefine: true
      },
      globalObject: 'typeof self !== \'undefined\' ? self : this',
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          },
          compress: {
            drop_console: true,
          },
        },
      })],
    },
  }
]; 
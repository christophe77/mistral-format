const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// Load .env file
const env = dotenv.config().parsed || {};

// Convert env variables to strings for webpack definePlugin
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

// Node.js build configuration
const nodeConfig = {
  entry: './src/index.ts',
  mode: 'production',
  target: 'node',
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
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist/node'),
    library: {
      type: 'commonjs2',
    },
  },
  externals: {
    'dotenv': 'commonjs dotenv',
  },
  plugins: [
    new webpack.DefinePlugin(envKeys),
  ],
};

// Browser build configuration
const browserConfig = {
  entry: './src/browser.ts',
  mode: 'production',
  target: 'web',
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
      "stream": require.resolve("stream-browserify"),
      "vm": false
    }
  },
  output: {
    filename: 'mistral-format.js',
    path: path.resolve(__dirname, 'dist/browser'),
    library: {
      name: 'MistralFormat',
      type: 'umd',
      export: 'default',
      umdNamedDefine: true
    },
    globalObject: 'typeof self !== \'undefined\' ? self : this',
  },
  plugins: [
    new webpack.DefinePlugin(envKeys),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
    // Uncomment this line to generate bundle analysis report
    // new BundleAnalyzerPlugin(),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};

// Minified browser build configuration
const minifiedBrowserConfig = {
  ...browserConfig,
  output: {
    ...browserConfig.output,
    filename: 'mistral-format.min.js',
  },
  optimization: {
    ...browserConfig.optimization,
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
};

// Update package.json to point to the correct files
// main: dist/node/index.js
// browser: dist/browser/mistral-format.min.js

module.exports = [nodeConfig, browserConfig, minifiedBrowserConfig]; 
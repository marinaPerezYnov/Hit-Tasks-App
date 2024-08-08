const path = require("path");
const config = require("./webpack.config");
const { merge } = require("webpack-merge");
const Dotenv = require("dotenv-webpack");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { ServiceWorkerPlugin } = require("service-worker-webpack");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = merge(config, {
  mode: "production",
  plugins: [
    new Dotenv({ path: ".env.production" }),
    new ServiceWorkerPlugin(),
    new CompressionPlugin({
      exclude: /index\.html$/,
      algorithm: "gzip",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "public/favicon.ico", to: "favicon.ico" },
        { from: "public/robots.txt", to: "robots.txt" },
        {
          from: "public/android-chrome-192x192.png",
          to: "android-chrome-192x192.png",
        },
        {
          from: "public/android-chrome-512x512.png",
          to: "android-chrome-512x512.png",
        },
        { from: "public/favicon-16x16.png", to: "favicon-16x16.png" },
        { from: "public/favicon-32x32.png", to: "favicon-32x32.png" },
        { from: "public/apple-touch-icon.png", to: "apple-touch-icon.png" },
        { from: "public/screenshot1.png", to: "screenshot1.png" },
        { from: "public/screenshot2.png", to: "screenshot2.png" },
        { from: "public/logo.png", to: "logo.png" },
        { from: "public/sitemap.xml", to: "sitemap.xml" },
      ],
    }),
  ],
  optimization: {
    splitChunks: {
      minSize: 17000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      automaticNameDelimiter: "_",
      enforceSizeThreshold: 30000,
      cacheGroups: {
        common: {
          test: /[\\/]node_modules[\\/]/,
          priority: -5,
          reuseExistingChunk: true,
          chunks: "initial",
          name: "common_app",
          minSize: 0,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        // we are opting out of defaultVendors, so rest of the node modules will be part of default cacheGroup
        defaultVendors: false,
        reactPackage: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
          name: "vendor_react",
          chunks: "all",
          priority: 10,
        },
      },
    },
    usedExports: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        parallel: true,
        terserOptions: {
          mangle: true,
          compress: {
            drop_console: true,
          },
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
});

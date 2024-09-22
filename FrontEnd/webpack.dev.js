const config = require("./webpack.config");
const { merge } = require("webpack-merge");
const fs = require("fs");
const Dotenv = require("dotenv-webpack");

module.exports = merge(config, {
  mode: "development",
  plugins: [new Dotenv({ path: ".env.development" })],
  entry: "./src/index.js",
  devtool: "eval",
  devServer: {
    // server: {
    //   type: "https",
    //   options: {
    //     key: fs.readFileSync("./certs/localhost.key"),
    //     cert: fs.readFileSync("./certs/localhost.crt"),
    //   },
    // },
    compress: true,
    client: {
      logging: "error",
      overlay: true,
    },
    port: 3030,
  },
  // Need for docker container reloading
  watchOptions: {
    poll: true,
  },
  stats: {
    errorDetails: true,
    entrypoints: false,
    children: true,
  },
});

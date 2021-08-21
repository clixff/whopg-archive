const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  devServer: {
    static: './docs',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use:
        [
          'style-loader', 
          {
              loader: 'css-loader',
              options: {
                  modules: {
                      auto: true,
                      localIdentName: '[name]__[local]--[hash:base64:5]'
                  }
              }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: ['babel-loader', 
        {
          loader: 'react-svg-loader',
          options: 
          {
            jsx: true
          }
        }]
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new CopyPlugin({
        patterns: [
          {
            from: "src/CNAME"
          },
          {
            from: "src/data.json"
          },
          {
            from: 'src/favicon.ico'
          }
        ]
      }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'docs'),
  }
};

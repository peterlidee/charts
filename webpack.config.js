const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const path = require('path');

var config = {
  entry:  { main: './src/index.js' },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    //publicPath: 'https://www.lidee.be/charts/',
    //publicPath: '/',
  },
  module: {

    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            //options: { minimize: true }
          }
        ]
      },
      { test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { url: false }  },
          { loader: "sass-loader", } //compiles Sass to CSS
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    /*new OptimizeCssAssetsPlugin({
      //assetNameRegExp: /\.optimize\.css$/g,
      //cssProcessor: require('cssnano'),
      //cssProcessorOptions: { discardComments: { removeAll: false } },
      //canPrint: true
    }),*/
  ],
  devServer: {
    port: 8080,
    open: true,
    historyApiFallback: true,
  }
};

// https://webpack.js.org/concepts/mode/
// use argv.mode to get the correct path

module.exports = (env, argv) => {
  //console.log('Hello??????,', env, argv);
  if (argv.mode === 'development') {
    config.output.publicPath = '/';
  }
  if (argv.mode === 'production') {
    config.output.publicPath = 'http://www.lidee.be/charts/';
  }

  return config;
};

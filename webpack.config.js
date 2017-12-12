var webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin'); // Require  html-webpack-plugin plugin
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

require('dotenv').config()

const ENV = process.env.APP_ENV;
const isTest = ENV === 'test';
const isProd = ENV === 'prod';
if (isTest) console.log('Using testing configuration')
else if (isProd) console.log('Using production configuration')
else console.log("Using no configuration");


function setDevTool() { // function to set dev-tool depending on environment
  if (isTest) {
    return 'inline-source-map';
  } else if (isProd) {
    return 'source-map';
  } else {
    return 'eval-source-map';
  }
}

const config = {
  entry: __dirname + "/src/app/index.js", // webpack entry point. Module to start building dependency graph
  devtool: setDevTool(), //Set the devtool
  output: {
    path: __dirname + '/dist', // Folder to store generated bundle
    filename: 'bundle.js', // Name of generated bundle after build
    publicPath: '/'
  },
  module: { // where we defined file patterns and their loaders
    rules: [{
        test: /\.js$/,
        use: 'babel-loader',
        exclude: [
          /node_modules/
        ]
      },
      {
        test: /\.html/,
        loader: 'raw-loader'
      },
      {
        test: /\.(sass|scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
              loader: 'css-loader'
            },
            {
              loader: 'sass-loader'
            }
          ],
        })
      }
    ]
  },
  plugins: [ // Array of plugins to apply to build chunk
    new HtmlWebpackPlugin({
      template: __dirname + "/src/public/index.html",
      inject: 'body'
    }),
    new ExtractTextPlugin("styles.css"), // extract css to a separate file called styles.css
    new webpack.DefinePlugin({ // plugin to define global constants
      API_KEY: JSON.stringify(process.env.API_KEY)
    })
  ],
  devServer: { // configuration for webpack-dev-server
    contentBase: './src/public', //source of static assets
    port: 7700, // port to run dev-server
  }
};

// Minify and copy assets in production
if (isProd) { // plugins to use in a production environment
  config.plugins.push(
    new UglifyJSPlugin(), // minify the chunk
    new CopyWebpackPlugin([{ // copy assets to public folder
      from: __dirname + '/src/public'
    }])
  );
};

module.exports = config;
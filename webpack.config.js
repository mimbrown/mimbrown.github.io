const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  // Webpack needs to know where to start the bundling process,
  // so we define the main JS and Sass files, both under
  // the './src' directory
  entry: {
    root: './src/styles/root.scss',
    resume: './src/styles/resume.scss',
  },
  // This is where we define the path where Webpack will place
  // the bundled JS file
  output: {
    path: path.join(__dirname, 'docs'),
    filename: 'junk/[name].css',
    publicPath: '/',
    // The name of the output bundle. Path is also relative
    // to the output path
    // filename: 'scripts/[name].js'
  },
  module: {
    // Array of rules that tells Webpack how the modules (output)
    // will be created
    rules: [
      {
        // Look for JavaScript files and apply the babel-loader
        // excluding the './node_modules' directory. It uses the
        // configuration in `.babelrc`
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        // Look for Sass files and process them according to the
        // rules specified in the different loaders
        test: /\.(sa|sc)ss$/,
        // Use the following loaders from right-to-left, so it will
        // use sass-loader first and ending with MiniCssExtractPlugin
        use: [
          {
            // Extracts the CSS into a separate file and uses the
            // defined configurations in the 'plugins' section
            loader: MiniCssExtractPlugin.loader
          },
          {
            // Interprets CSS
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
          // {
          //   // Use PostCSS to minify and autoprefix. This loader
          //   // uses the configuration in `postcss.config.js`
          //   loader: 'postcss-loader'
          // },
          {
            // Adds support for Sass files, if using Less, then
            // use the less-loader
            loader: 'sass-loader'
          },
        ]
      },
      {
        // Adds support to load images in your CSS rules. It looks
        // for .png, .jpg, .jpeg and .gif
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              // The image will be named with the original name and
              // extension
              name: 'images/[name].[ext]',
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              // The font will be named with the original name and
              // extension
              name: 'fonts/[name].[ext]',
            }
          },
        ],
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    // Configuration options for MiniCssExtractPlugin. Here I'm only
    // indicating what the CSS outputted file name should be and
    // the location
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      inject: false,
    }),
    new HtmlWebpackPlugin({
      filename: 'resume/index.html',
      template: 'src/resume/index.html',
      inject: false,
    }),
    new CopyPlugin({
      patterns: [
        { context: 'src', from: '*.png', to: '.' },
        { context: 'src', from: '*.ico', to: '.' },
        { context: 'src', from: '*.webmanifest', to: '.' },
      ],
    }),
  ]
};

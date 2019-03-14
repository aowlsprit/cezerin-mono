const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const THEME_PATH = path.join(__dirname, '../', 'cezerin-theme');

module.exports = {
  entry: {
    app: ['babel-polyfill', './src/client/index.js'],
    theme: [THEME_PATH]
  },

  performance: {
    hints: false
  },

  output: {
    publicPath: '/',
    path: THEME_PATH,
    filename: 'assets/js/[name]-[chunkhash].js',
    chunkFilename: 'assets/js/[name]-[chunkhash].js'
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          name: 'theme',
          test: 'theme',
          enforce: true
        }
      }
    }
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react'],
            plugins: ['transform-class-properties']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: false,
              importLoaders: true
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(
      [
        path.join(THEME_PATH, 'assets/js/app-*.js'),
        path.join(THEME_PATH, 'assets/js/theme-*.js'),
        path.join(THEME_PATH, 'assets/css/bundle-*.css'),
        path.join(THEME_PATH, 'assets/sw.js'),
        path.join(THEME_PATH, 'assets/precache-manifest.*.js')
      ],
      { verbose: false }
    ),
    new MiniCssExtractPlugin({
      filename: 'assets/css/bundle-[contenthash].css',
      chunkFilename: 'assets/css/bundle-[contenthash].css'
    }),
    new HtmlWebpackPlugin({
      template: path.join(THEME_PATH, 'index.html'),
      inject: 'body',
      filename: 'assets/index.html'
    }),
    new WorkboxPlugin.GenerateSW({
      swDest: 'assets/sw.js',
      precacheManifestFilename: 'assets/precache-manifest.[manifestHash].js',
      clientsClaim: true,
      skipWaiting: true,
      exclude: [/\.html$/],
      runtimeCaching: [
        {
          urlPattern: new RegExp('/(images|assets|admin-assets)/'),
          handler: 'cacheFirst'
        },
        {
          urlPattern: new RegExp('/api/'),
          handler: 'networkOnly'
        },
        {
          urlPattern: new RegExp('/ajax/payment_form_settings'),
          handler: 'networkOnly'
        },
        {
          urlPattern: new RegExp('/'),
          handler: 'networkFirst',
          options: {
            networkTimeoutSeconds: 10
          }
        }
      ]
    }),
    new webpack.BannerPlugin({
      banner: `Created: ${new Date().toUTCString()}`,
      raw: false,
      entryOnly: false
    })
  ],

  stats: {
    children: false,
    entrypoints: false,
    modules: false
  }
};

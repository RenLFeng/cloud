const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');



const CompressionWebpackPlugin = require('compression-webpack-plugin');

const productionGzipExtensions = ['js', 'css'];

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  publicPath: '',
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
            autoprefixer(),
          pxtorem({
            rootValue: 37.5,
            propList: ['*']
          })
        ]
      }
    }
  },
    configureWebpack: config => {
        if (isProduction) {

            config.plugins.push(new CompressionWebpackPlugin({

                algorithm: 'gzip',

                test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),

                threshold: 10240,

                minRatio: 0.8

            }))

        }

    },
  lintOnSave: false,
  devServer: {
   proxy: 'http://192.168.0.2:9982'
    //  proxy: 'http://localhost:9982'
  }
}
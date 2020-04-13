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
                    require('postcss-pxtorem')({
                        rootValue : 37.5,
                        selectorBlackList  : ['.biggp-'], 
                        propList   : ['*'],
                    }),
                ]
            }
        }
    },
    pages: {
        index: {
            entry: 'src/main.js',
            template: 'public/index.html',
            filename: 'index.html',
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
        daping: 'src/daping.js'
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
        //   proxy: 'http://192.168.40.104:9982'
        // proxy: 'https://www2.exsoft.com.cn'
    }
}
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
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
  lintOnSave: false,
  devServer: {
    proxy: 'http://192.168.0.2:9982'
    // proxy: 'http://localhost:9982'
  }
}
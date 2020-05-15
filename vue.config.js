const ENV = process.env

module.exports = {
  transpileDependencies: [ 'vuetify' ],
  lintOnSave: false,
  chainWebpack: config => {
    [ 'vue-modules', 'vue', 'normal-modules', 'normal' ].forEach((match) => {
      config.module.rule('sass').oneOf(match).use('sass-loader').tap(opt => ({
        ...opt,
        prependData: "@import '@/assets/scss/_variables.scss'",
      }))
    })

    config.plugins.delete('prefetch')
  },
  devServer: { proxy: { '^/api': { target: ENV.VUE_APP_API_URL } } },
  css: {
    loaderOptions: {
      scss: {
        implementation: require('sass'),
        prependData: "@import '@/assets/scss/_variables.scss';",
      },
    },
  },
}

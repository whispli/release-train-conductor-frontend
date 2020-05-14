module.exports = {
  transpileDependencies: [ "vuetify" ],
  lintOnSave: false,
  chainWebpack: config => {
    ;[ 'vue-modules', 'vue', 'normal-modules', 'normal' ].forEach((match) => {
      config.module.rule('sass').oneOf(match).use('sass-loader').tap(opt => ({
        ...opt,
      }))
    })

    config.plugins.delete('prefetch')
  },
  css: {
    loaderOptions: {
      scss: {
        implementation: require('sass'),
      }
    },
  },
}

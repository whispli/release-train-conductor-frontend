import Vue from 'vue'
import AppContainer from './AppContainer.vue'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(AppContainer),
}).$mount('#app')

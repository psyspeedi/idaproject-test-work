import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import messagePlugin from './utils/message.plugin'

Vue.config.productionTip = true

Vue.use(messagePlugin)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

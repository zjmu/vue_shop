import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import './assets/fonts/iconfont.css'
import VueAxios from 'vue-axios'


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

// Vue.use(VueAxios, axios)
Vue.prototype.$ajax = axios

axios({
  url: 'http://localhost:8091/contents/?access_token=c7829e2e-b6e8-424c-ac15-735fbe78eaac',
  method:'get'
}).then(res => {
  console.log(res)
})

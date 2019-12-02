import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'

Vue.prototype.$http = axios
Vue.config.productionTip = false
// axios.post('http://localhost:8090/login', { username: 'zjm', password: '123456' }).then(res => {
//   console.log(res)
// })

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "./assets/css/gobal.css"
import element  from './Element-ui/index'
import axios from "axios";
axios.defaults.baseURL='https://www.liulongbin.top:8888/api/private/v1/'
//  挂载到vue实例上，后面可以通过this调用
Vue.prototype.$axios=axios

Vue.use(element)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

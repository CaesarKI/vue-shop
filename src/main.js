import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "./assets/css/gobal.css"
import "./assets/fonts/iconfont.css"
import element  from './Element-ui/index'
import axios from "axios";

//请求接口的基准地址
axios.defaults.baseURL='https://www.liulongbin.top:8888/api/private/v1/'
//axios请求拦截器添加token，为了请求到特殊权限的接口
axios.interceptors.request.use(config=>{
  // console.log(config)
  config.headers.Authorization=window.sessionStorage.getItem("token")
  return config
})
//  挂载到vue实例上，后面可以通过this调用
Vue.prototype.$axios=axios

Vue.use(element)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

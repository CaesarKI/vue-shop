import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "./assets/css/gobal.css"
import "./assets/fonts/iconfont.css"
import element  from './Element-ui/index'
import axios from "axios";
import treeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'


//请求接口的基准地址
// axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
// axios.defaults.baseURL='https://www.liulongbin.top:8888/api/private/v1/'
axios.defaults.baseURL='http://timemeetyou.com:8889/api/private/v1/'

//axios请求拦截器添加token，为了请求到特殊权限的接口
axios.interceptors.request.use(config=>{
  // console.log(config)
  config.headers.Authorization=window.sessionStorage.getItem("token")
  return config
})
//  挂载到vue实例上，后面可以通过this调用
Vue.prototype.$axios=axios
Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  // yyyy-mm-dd hh:mm:ss
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.use(VueQuillEditor)
Vue.use(element)
Vue.config.productionTip = false
//树形表格
Vue.component('tree-table', treeTable)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

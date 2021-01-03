import Vue from 'vue'
import MpvueRouterPatch from 'mpvue-router-patch'
import App from '@/App'
import store from '@/store'
import axios from '@/utils/axiosA'
import AlertW from '@/utils/alertW'

Vue.use(MpvueRouterPatch)
Vue.use(AlertW)
Vue.config.productionTip = false
if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = './api/'
} else {
  axios.defaults.baseURL = 'http://192.168.137.1/mall-api/index.php'
}
Vue.prototype['$axios'] = axios

const app = new Vue({
  mpType: 'app',
  store,
  ...App
})
app.$mount()

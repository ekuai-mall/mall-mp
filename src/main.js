import Vue from 'vue'
import MpvueRouterPatch from 'mpvue-router-patch'
import App from '@/App'
import store from '@/store'
import axios from '@/utils/axiosA'
import AlertW from '@/utils/alertW'

Vue.use(MpvueRouterPatch)
Vue.use(AlertW)
Vue.config.productionTip = false
axios.defaults.baseURL = 'https://faka.lifestudio.cn/api/index.php'
Vue.prototype['$axios'] = axios

const app = new Vue({
  mpType: 'app',
  store,
  ...App
})
app.$mount()

import axios from 'axios'
import mpAdapter from 'axios-miniprogram-adapter'
import qs from 'qs'

axios.defaults.adapter = mpAdapter
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
export default {
  $get: axios.get,
  '$post': (url, data) => {
    return axios.post(url, qs.stringify(data))
  },
  ...axios
}

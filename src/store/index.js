// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'
import User from '@/store/user'
import Run from '@/store/run'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    User,
    Run
  }
})

export default store

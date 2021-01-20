<template>
  <div>
    <div class="align-center">
      <div class="title margin-10">
        {{ mallTitle }}
      </div>
      <div class="subTitle margin-10">
        登陆
      </div>
    </div>

    <van-cell-group class="margin-10">
      <van-field
        :value="username"
        required
        label="用户名"
        placeholder="请输入用户名"
        data-change-name="username"
        @change="change"
      />
      <van-field
        :value="password"
        type="password"
        label="密码"
        placeholder="请输入密码"
        required
        data-change-name="password"
        @change="change"
      />
      <div>
        <van-cell title="记住密码">
          <van-switch :checked="remember" @change="remember=!remember"/>
        </van-cell>
        <van-cell title="自动登录">
          <van-switch :checked="autoLogin" @change="autoLogin=!autoLogin"/>
        </van-cell>
        <van-cell
          is-link
          title="没有账户？立即注册"
          link-type="navigateTo"
          url="/pages/register"
        />
      </div>
      <div class="align-center">
        <van-button round type="info" @click="login">登陆</van-button>
      </div>
    </van-cell-group>
  </div>

</template>

<script>
export default {
  mpType: 'page',
  data: () => ({
    username: '',
    password: '',
    remember: false,
    autoLogin: false
  }),
  mounted () {
    console.log(this.$store.state)
  },
  methods: {
    login () {
      console.log(this)
      this.$axios.$post('?_=auth/login', {
        user: this.username,
        pass: this.password
      }).then(response => {
        if (response.status === 200) {
          let dat = response.data
          if (dat.status === 0) {
            this.$store.commit('User/updateUserInfo', dat['ret'])
            this.$success({
              title: '登录成功',
              content: '即将跳转至登录前页面，若无法跳转请刷新页面'
            })
            if (this.$store.state.Run.loginBack) {
              wx.navigateBack()
            } else {
              wx.switchTab({
                url: '/pages/user'
              })
            }
          } else {
            this.$warning({
              title: '登录失败',
              content: '错误码：' + dat.status + '，错误信息：' + dat['ret']
            })
          }
        } else {
          this.$error({
            title: '网络错误',
            content: response.status + '：' + response.statusText
          })
        }
        console.log(response)
      }).catch(error => {
        this.$error({
          title: '网络错误',
          content: error
        })
        console.log(error)
      })
    },
    change (e) {
      console.log(e.target.dataset)
      this[e.target.dataset.changeName] = e.mp.detail
    }
  },
  computed: {
    mallTitle () {
      return this.$store.state.Run.mallTitle
    }
  }
}
</script>

<style scoped>

.title {
  font-size: xx-large;
  text-shadow: #1890ff 3px 0 0, #1890ff 0 3px 0, #1890ff -2px 0 0, #1890ff 0 -2px 0;
  color: white;
}

.subTitle {
  font-size: x-large;
}
</style>

<template>
  <div>
    <div class="align-center">
      <div class="title">
        {{ mallTitle }}
      </div>
      <div class="subTitle margin-10">
        注册
      </div>
    </div>

    <van-cell-group class="margin-10">
      <van-field
        :value="username"
        required
        label="用户名"
        placeholder="请输入用户名"
        data-change-name="username"
        @change="onChange"
      />
      <van-field
        :value="password"
        type="password"
        label="密码"
        placeholder="请输入密码"
        required
        data-change-name="password"
        @change="onChange"
      />
      <van-field
        :value="password1"
        type="password"
        label="重复密码"
        placeholder="请再此输入密码"
        required
        data-change-name="password1"
        @change="onChange"
      />
      <div>
        <van-cell
          is-link
          title="已有账户？立即登陆"
          link-type="navigateBack"
          url="/pages/login"
        />
      </div>
      <div class="align-center margin-10">
        <van-button round type="info" @click="register">注册</van-button>
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
    password1: ''
  }),
  mounted () {
  },
  methods: {
    register () {
      if (this.password1 !== this.password) {
        this.$error({
          title: '两次密码输入不同'
        })
        return
      }
      this.$axios.$post('?_=auth/register', {
        user: this.username,
        pass: this.password
      }).then(response => {
        if (response.status === 200) {
          let dat = response.data
          if (dat.status === 0) {
            this.$store.commit('User/updateUserInfo', {
              pass: this.password,
              ...dat['ret']
            })
            this.$success({
              title: `注册成功！欢迎你， ${dat['ret'].user} ！`,
              content: '即将自动跳转，若跳转失败请刷新页面'
            })
            wx.navigateBack()
          } else {
            this.$warning({
              title: '注册失败',
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
    onChange (e) {
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

<template>
  <div>
    <van-nav-bar :title="title">
      <van-icon @click="toConfig" class="icon" name="setting-o" slot="right"/>
    </van-nav-bar>
    <div class="align-center margin-10">
      <div v-if="!login" class="login">
        <div class="margin-10">
          <van-button round type="info" @click="toLogin">立即登陆</van-button>
        </div>
      </div>
      <div v-else>
        <div>
          <van-collapse accordion :value="activeName" data-change-name="activeName" @change="onChange">
            <van-collapse-item title="个人信息" name="1">
              <van-cell-group class="margin-10" v-if="showInfo">
                <van-field
                  :value="form.contact"
                  label="联系方式"
                  placeholder="请输入联系方式"
                  data-change-name="contact"
                  @change="onChangeForm"
                />
                <div class="align-center margin-10">
                  <van-button round type="info" @click="saveInfo">保存</van-button>
                </div>
              </van-cell-group>
            </van-collapse-item>
            <van-collapse-item title="修改密码" name="2">
              <van-cell-group class="margin-10">
                <van-field
                  :value="password"
                  type="password"
                  label="原密码"
                  placeholder="请输入原密码"
                  required
                  data-change-name="password"
                  @change="onChange"
                />
                <van-field
                  :value="password1"
                  type="password"
                  label="新密码"
                  placeholder="请输入新密码"
                  required
                  data-change-name="password1"
                  @change="onChange"
                />
                <van-field
                  :value="password2"
                  type="password"
                  label="重复密码"
                  placeholder="请输入新密码"
                  required
                  data-change-name="password2"
                  @change="onChange"
                />
                <div class="align-center margin-10">
                  <van-button round type="info" @click="newPass">保存</van-button>
                </div>
              </van-cell-group>
            </van-collapse-item>
            <van-collapse-item title="绑定微信" name="3">
              抱歉，微信小程序端不支持该功能，请在网页端操作
            </van-collapse-item>
            <van-collapse-item title="我的订单" name="4">
              <van-button round type="info" @click="toOrderList">查看我的订单</van-button>
            </van-collapse-item>
            <van-collapse-item title="退出登陆" name="5">
              <div class="margin-10">
                <van-checkbox :value="cancelAutoLogin" shape="square" data-change-name="cancelAutoLogin" @change="onChange">
                  取消自动登陆
                </van-checkbox>
              </div>
              <div class="margin-10">
                <van-button round type="info" @click="quitLogin">退出登陆</van-button>
              </div>
            </van-collapse-item>
          </van-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mpType: 'page',
  data: () => ({
    activeName: 1,
    cancelAutoLogin: true,
    form: {
      contact: ''
    },
    password: '',
    password1: '',
    password2: '',
    showInfo: true
  }),
  onShow () {
    this.activeName = 1
    if (this.login) {
      this.$axios.$post('?_=auth/getInfo', {
        id: this.$store.state.User.id,
        cookie: this.$store.state.User.cookie
      }).then(response => {
        if (response.status === 200) {
          let dat = response.data
          if (dat.status === 0) {
            let ret = JSON.parse(dat['ret'])
            for (let key in this.form) {
              this.form[key] = ret[key] ? ret[key] : this.form[key]
            }
            this.$success({
              title: '成功',
              content: '个人信息数据拉取成功'
            })
            console.log(this)
          } else {
            this.$warning({
              title: '信息拉取失败',
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
    }
  },
  methods: {
    toLogin () {
      wx.navigateTo({
        url: '/pages/login'
      })
    },
    quitLogin () {
      this.$axios.$post('?_=auth/logout', {
        id: this.$store.state.User.id,
        cookie: this.$store.state.User.cookie
      }).then(response => {
        if (response.status === 200) {
          this.$success({
            title: '成功',
            content: '退出账户成功'
          })
        } else {
          this.$error({
            title: '网络错误',
            content: response.status + '：' + response.statusText
          })
        }
        console.log(response)
        if (this.cancelAutoLogin) {
          wx.setStorageSync('autoLogin', false)
        }
        this.$store.commit('User/updateUserInfo')
      }).catch(error => {
        this.$error({
          title: '网络错误',
          content: error
        })
        console.log(error)
      })
    },
    saveInfo () {
      this.$axios.$post('?_=auth/setInfo', {
        id: this.$store.state.User.id,
        cookie: this.$store.state.User.cookie,
        info: JSON.stringify(this.form)
      }).then(response => {
        if (response.status === 200) {
          let dat = response.data
          if (dat.status === 0) {
            let ret = JSON.parse(dat['ret'])
            for (let key in this.form) {
              this.form[key] = ret[key] ? ret[key] : this.form[key]
            }
            this.$success({
              title: '成功',
              content: '个人信息数据提交成功，已自动刷新'
            })
          } else {
            this.$warning({
              title: '信息拉取失败',
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
    newPass () {
      if (this.password1 !== this.password2) {
        this.$error({
          title: '两次密码输入不同'
        })
        return
      }
      this.$axios.$post('?_=auth/cPass', {
        user: this.$store.state.User.username,
        pass: this.password,
        nPass: this.password1
      }).then(response => {
        if (response.status === 200) {
          let dat = response.data
          if (dat.status === 0) {
            this.$success({
              title: '成功',
              content: '密码更改成功，请重新登录'
            })
            this.password = this.password1 = this.password2 = ''
            wx.setStorageSync('autoLogin', false)
            wx.removeStorageSync('pass')
            this.$store.commit('User/updateUserInfo')
            this.toLogin()
          } else {
            this.$warning({
              title: '密码更改失败',
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
    toOrderList () {
      wx.navigateTo({
        url: '/pages/orderList'
      })
    },
    toConfig () {
      wx.navigateTo({
        url: '/pages/cfg'
      })
    },
    onChange (e) {
      this[e.target.dataset.changeName] = e.mp.detail
    },
    onChangeForm (e) {
      this.form[e.target.dataset.changeName] = e.mp.detail
    }
  },
  computed: {
    login () {
      return this.$store.state.User.id > 0 && this.$store.state.User.cookie !== ''
    },
    username () {
      return this.$store.state.User.username
    },
    contact () {
      return this.form.contact
    },
    title () {
      if (this.login) {
        return '欢迎回来，' + this.username + '！'
      } else {
        return '您还未登陆'
      }
    }
  }
}
</script>

<style scoped>
.login {
  position: absolute;
  top: 200px;
  width: 100%;
}

.icon {
  color: #1890ff;
  font-size: x-large;
}
</style>

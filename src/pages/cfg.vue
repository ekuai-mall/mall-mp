<template>
  <div>
    <div class="margin-10">
      <div class="align-center">
        设置
      </div>
      <div class="margin-10"></div>
      <div>
        <van-cell title="清除缓存" is-link @click="clearStorage"/>
      </div>
      <div>
        <van-collapse accordion :value="activeName" @change="onChange">
          <van-collapse-item title="关于" name="1">
            <div>ekuai mall</div>
            <div @click="eggClick">copyright ekuai 2020 &copy;</div>
            <hr>
            <div>ekuai mall for wechat miniprogram</div>
            <div>copyright ekuai 2021 &copy;</div>
            <hr>
            <div>wechat miniprogram pay service provided by lifeStudio</div>
          </van-collapse-item>
        </van-collapse>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mpType: 'page',
  data: () => ({
    activeName: '0',
    eggs: 0
  }),
  onShow () {
    this.eggs = 0
  },
  methods: {
    clearStorage () {
      let that = this
      wx.showModal({
        title: '警告',
        content: '清除缓存将退出登陆并清除保存的用户名密码等信息',
        success (res) {
          if (res.confirm) {
            that.$store.commit('User/updateUserInfo')
            wx.clearStorageSync()
            that.$success({
              title: '成功',
              content: '清除缓存成功'
            })
          } else if (res.cancel) {
            that.$error({
              title: '取消',
              content: '用户取消缓存清除操作'
            })
          }
        }
      })
    },
    onChange (e) {
      this.activeName = e.mp.detail
    },
    eggClick () {
      this.eggs++
      if (this.eggs >= 5) {
        wx.showToast({
          title: '别戳啦，再戳就坏掉啦！',
          icon: 'none',
          duration: 2000
        })
      }
    }
  }
}
</script>

<style scoped>

</style>

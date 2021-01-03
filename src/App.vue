<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.$axios.$get('?_=info/getAll')
      .then(response => {
        if (response.status === 200) {
          let dat = response.data
          if (dat.status === 0) {
            this.$store.commit('Run/updateGlobalInfo', dat['ret'])
          } else {
            this.$error({
              title: '服务器错误',
              content: dat.status + '：' + dat['ret']
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
    // eslint-disable-next-line
    console.log('app created and cache logs by setStorageSync')
  }
}
</script>

<style>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 100px 0;
  box-sizing: border-box;
}

* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>

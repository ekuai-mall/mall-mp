<script>
export default {
  created () {
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.$axios.$get('?_=info/getAll')
      .then(response => {
        if (response.status === 200) {
          let dat = response.data
          if (dat.status === 0) {
            let globalInfo = [{key: 'init', value: true}, ...dat['ret']]
            this.$store.commit('Run/updateGlobalInfo', globalInfo)
            wx.setNavigationBarTitle({
              title: this.$store.state.Run.mallTitle
            })
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
      })
      .catch(error => {
        this.$error({
          title: '网络错误',
          content: error
        })
        console.log(error)
      })
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

.margin-10 {
  margin: 10px;
}

.align-center {
  text-align: center;
}

.margin-auto {
  margin: auto;
}

.van-cell__title {
  margin: auto;
}

* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}

.loading {
  position: fixed;
  top: 250px;
  width: 100%;
  text-align: center;
}
</style>

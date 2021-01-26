<template>
  <div class="margin-10">
    <div class="align-center">
      微信支付
    </div>
    <div v-if="onLoading" class="loading">
      <van-loading color="#1890ff"/>
    </div>
    <div v-else class="margin-10">
      <van-cell-group>
        <van-cell title="用户" :value="order.user.user"/>
        <van-cell title="商品" :label="order.name"/>
        <van-cell title="订单号" :label="orderId"/>
        <van-cell title="下单时间" :label="time"/>
        <van-cell title="备注留言" :label="order.remark"/>
      </van-cell-group>
      <div class="margin-10 align-center">
        <div class="margin-10">
          <van-button round type="info" @click="pay">支付</van-button>
        </div>
        <div class="margin-10">
          <van-button :loading="checking" loading-text="查单中，请稍后..." :disabled="checking" round type="info" @click="checkOrder">
            强制查单
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mpType: 'page',
  data: () => ({
    orderId: '',
    order: null,
    onLoading: true,
    checking: false
  }),
  mounted () {
    this.orderId = this.$store.state.Run.payOrder
    this.$store.commit('Run/updatePayOrder')
    this.$axios.$post('?_=pay/getOrder', {
      order: this.orderId
    }).then(response => {
      if (response.status === 200) {
        let dat = response.data
        if (dat.status === 0) {
          this.order = dat['ret']
          if (dat['ret'].status === 'SUCCESS') {
            this.finish()
          } else {
            this.init()
          }
          this.onLoading = false
        } else {
          this.$warning({
            title: '订单获取失败',
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
  methods: {
    finish () {
      this.$store.commit('Run/updatePayOrder', this.orderId)
      wx.navigateTo({
        url: '/pages/order'
      })
    },
    init () {
      console.log('wxpay init')
    },
    pay () {
      console.log('wxpay')
    },
    checkOrder () {
      if (this.checking) {
        return
      }
      this.checking = true
      this.$axios.$post('?_=pay/checkOrder', {
        order: this.orderId
      }).then(response => {
        if (response.status === 200) {
          let dat = response.data
          if (dat.status === 0) {
            let status = dat['ret']
            console.log(dat)
            if (status === 'SUCCESS') {
              this.finish()
            } else {
              this.$error({
                title: '订单未支付',
                content: '请检查支付状态或稍后重试'
              })
            }
          } else {
            this.$error({
              title: '订单获取错误，请刷新页面重试',
              content: dat['ret']
            })
          }
        } else {
          this.$error({
            title: '网络错误',
            content: response.status + '：' + response.statusText
          })
        }
        console.log(response)
        this.checking = false
      }).catch(error => {
        this.$error({
          title: '网络错误',
          content: error
        })
        console.log(error)
        this.checking = false
      })
    }
  },
  computed: {
    time () {
      if (this.order) {
        let time = new Date(this.order['time_start'] * 1000)
        let y = time.getFullYear()
        let m = time.getMonth() + 1
        let d = time.getDate()
        return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' ' + time.toTimeString().substr(0, 8)
      } else {
        return ''
      }
    }
  }
}
</script>

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
    </div>
  </div>
</template>

<script>
export default {
  mpType: 'page',
  data: () => ({
    orderId: '',
    order: null,
    onLoading: true
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
      console.log('wxpay finish')
    },
    init () {
      console.log('wxpay init')
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

<style scoped>
.loading {
  position: fixed;
  top: 250px;
  width: 100%;
  text-align: center;
}
</style>

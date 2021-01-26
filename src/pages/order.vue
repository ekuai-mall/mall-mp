<template>
  <div>
    <div class="margin-10">
      <div v-if="!order" class="loading">
        <van-loading color="#1890ff"/>
      </div>
      <div v-else class="margin-10">
        <van-cell-group>
          <van-cell title="订单号" :label="order.order"/>
          <van-cell title="订单编号" :value="order.id"/>
          <van-cell title="商品" :label="order.name"/>
          <van-cell title="价格" :value="'￥'+order.price/100"/>
          <van-cell title="下单时间" :label="order.time_start"/>
          <van-cell title="订单状态">
            <span :style="{color:order.statusClr}">{{ order.status }}</span>
          </van-cell>
          <van-cell title="支付时间" :label="order.time_finish"/>
          <van-cell title="订单状态">
            <span :style="{color:order.extraClr}">{{ order.extra }}</span>
          </van-cell>
          <van-cell title="备注" :value="order.remark"/>
        </van-cell-group>
        <div class="margin-10 align-center">
          <van-button v-if="order.status==='未支付'" round type="info" @click="pay">支付/查单</van-button>
          <canvas v-else class="qrcode" canvas-id="qrcode"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import wxBarcode from 'wxbarcode'

export default {
  mpType: 'page',
  data: () => ({
    orderId: '',
    order: null
  }),
  onShow () {
    this.order = null
    this.orderId = this.$store.state.Run.payOrder || this.orderId
    this.$store.commit('Run/updatePayOrder')
    this.$axios.$post('?_=pay/getOrder', {
      order: this.orderId
    }).then(response => {
      if (response.status === 200) {
        let dat = response.data
        if (dat.status === 0) {
          this.order = dat['ret']
          this.order.time_start = this.getTime(this.order.time_start)
          this.order.time_finish = this.order.time_finish ? this.getTime(this.order.time_finish) : '/'
          this.order.extraClr = this.getClr(this.order.extra)
          this.order.extra = this.getExtra(this.order.extra)
          this.order.statusClr = this.getClr(this.order.status)
          this.order.status = this.getPayStatus(this.order.status)
          if (this.order.status === '支付成功') {
            wxBarcode.qrcode('qrcode', this.order.order, 420, 420)
          }
          wx.setNavigationBarTitle({
            title: this.order.name
          })
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
    getTime (e) {
      let time = new Date(e * 1000)
      let y = time.getFullYear()
      let m = time.getMonth() + 1
      let d = time.getDate()
      return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' ' + time.toTimeString().substr(0, 8)
    },
    getPayStatus (e) {
      let dat = {
        'SUCCESS': '支付成功',
        'NOTPAY': '未支付',
        'PAYERROR': '支付失败',
        'CLOSED': '订单关闭',
        'REFUND': '正在退款',
        'REVOKED': '支付撤销'
      }
      return dat[e] || 'Unknown status'
    },
    getExtra (e) {
      e = e || 'NULL'
      let dat = {
        'NULL': '未使用',
        'SUBMIT': '已提交',
        'FINISH': '已完成'
      }
      return dat[e] ? dat[e] : 'Unknown status'
    },
    getClr (e) {
      e = e || 'NULL'
      let dat = {
        'SUBMIT': '#66ccff',
        'FINISH': 'green',
        'SUCCESS': 'green',
        'NOTPAY': 'red'
      }
      return dat[e] ? dat[e] : 'black'
    },
    pay () {
      this.$store.commit('Run/updatePayOrder', this.orderId)
      wx.navigateTo({
        url: '/pages/wxpay'
      })
    }
  }
}
</script>

<style scoped>
.qrcode {
  width: 210px;
  height: 210px;
  margin: auto;
}
</style>

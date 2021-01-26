<template>
  <div>
    <div class="margin-10">
      <div class="align-center">
        订单列表
      </div>
      <div class="margin-10"></div>
      <div v-if="!orderList" class="loading">
        <van-loading color="#1890ff"/>
      </div>
      <div v-else>
        <div v-for="(order,index) in orderList" :key="index" class="margin-10">
          <van-divider
            contentPosition="center"
            customStyle="color: #1989fa; border-color: #1989fa"
            v-if="index!==0"
          >
            这是一条分割线
          </van-divider>
          <van-cell-group>
            <van-cell title="订单号" :label="order.order" is-link value="查看" @click="redirect(index)"/>
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
        </div>
        <van-empty description="到达了数据的尽头"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mpType: 'page',
  data: () => ({
    orderList: null
  }),
  mounted () {
    this.$axios.$post('?_=pay/getUserOrder', {
      user: this.$store.state.User.id,
      cookie: this.$store.state.User.cookie
    }).then(response => {
      if (response.status === 200) {
        let dat = response.data
        if (dat.status === 0) {
          this.orderList = dat['ret'].reverse()
          for (let i = 0; i < this.orderList.length; i++) {
            this.orderList[i].time_start = this.getTime(this.orderList[i].time_start)
            this.orderList[i].time_finish = this.orderList[i].time_finish ? this.getTime(this.orderList[i].time_finish) : '/'
            this.orderList[i].extraClr = this.getClr(this.orderList[i].extra)
            this.orderList[i].extra = this.getExtra(this.orderList[i].extra)
            this.orderList[i].statusClr = this.getClr(this.orderList[i].status)
            this.orderList[i].status = this.getPayStatus(this.orderList[i].status)
          }
          this.$success({
            title: '成功',
            content: '订单信息数据拉取成功'
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
  methods: {
    redirect (e) {
      this.$store.commit('Run/updatePayOrder', this.orderList[e].order)
      wx.navigateTo({
        url: '/pages/order'
      })
    },
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
    }
  }
}
</script>

<style scoped>

</style>

let $error = options => {
  wx.showToast({
    title: '错误：' + options.title + ',' + options.content,
    icon: 'none',
    duration: 2000
  })
  console.log('$error', options)
}
let $warning = options => {
  wx.showToast({
    title: '警告：' + options.title + ',' + options.content,
    icon: 'none',
    duration: 2000
  })
  console.log('$warning', options)
}
let $info = options => {
  wx.showToast({
    title: '提示：' + options.title + ',' + options.content,
    icon: 'none',
    duration: 2000
  })
  console.log('$info', options)
}
let $success = options => {
  wx.showToast({
    title: '成功：' + options.title + ',' + options.content,
    icon: 'none',
    duration: 2000
  })
  console.log('$success', options)
}
export default function (vue) {
  vue.prototype.$error = $error
  vue.prototype.$warning = $warning
  vue.prototype.$info = $info
  vue.prototype.$success = $success
}

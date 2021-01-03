let $error = options => {
  wx.showToast({
    title: '错误：' + options.title,
    icon: 'none',
    duration: 2000
  })
  console.log(options)
}
export default function (vue) {
  vue.prototype.$error = $error
}

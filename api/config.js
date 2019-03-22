const u = 'http://192.168.1.183:8105'
// const u = 'https://keke.store.zksr.cn'


export default function https (api, data) {
  let url = u + api
  return new Promise((resolve, rej) => {
    wx.request({
      url,
      method: 'post',
      data,
      header: {
        'content-type': url.indexOf('application') === -1 ? 'application/x-www-form-urlencoded' : 'application/json'
      },
      dataType: 'json',
      success: res => {
        wx.hideLoading()
        resolve(res)
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '网络状态不太好,下拉刷新试试...(TAT)',
          icon: 'none'
        })
      }
    })
  })
}
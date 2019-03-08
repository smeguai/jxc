const u = 'http://192.168.1.183:8105'

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
        resolve(res)
      },
      fail: err => {
        rej(err)
      }
    })
  })
}
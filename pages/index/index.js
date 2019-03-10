import {login} from '../../api/api'
Page({
  data: {
    userinfo: null,
    gys: null,
    gysTXT: null
  },
  onLoad: function () {
    this.setData({
      userinfo: wx.getStorageSync('userinfo'),
      gys: wx.getStorageSync('gys')
    })
  },
  changeGYS(e) {
    let data = {
      name: this.data.userinfo.name,
      sysCode: this.data.userinfo.sysCode,
      id: this.data.gys[e.detail.value].id,
      simplename: this.data.gys[e.detail.value].simplename
    }
    wx.setStorageSync('userinfo', data)
    this.setData({
      gysTXT: this.data.gys[e.detail.value].simplename
    })
  }
})

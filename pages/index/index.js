//index.js
//获取应用实例
const app = getApp()
import {login} from '../../api/api'
Page({
  data: {
    userinfo: null
  },
  onLoad: function () {
    this.getUserInfo()
  },
  onShow() {
    
  },
  getUserInfo() {
    wx.getStorage({
      key: 'userinfo',
      success: (res) => {
        this.setData({
          userinfo: res.data
        })
        console.log(this.data.userinfo)
      }
    })
  }
})

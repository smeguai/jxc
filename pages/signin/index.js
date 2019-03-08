import {signin} from '../../api/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: ''
  },

  setname(e) {
    this.setData({
      username: e.detail.value
    })
  },
  setpass(e) {
    this.setData({
      password: e.detail.value
    })
  },

  signin() {
    let username = this.data.username
    let password = this.data.password
    if (!username || !password) {
      wx.showToast({
        title: '请输入账号和密码!',
        icon: 'none'
      })
      return
    }
    let data = {
      username,
      password
    }
    signin(data).then(res => {
      if (res.status === 200) {
        let userinfo = {
          sysCode: res.data.sysUser.sysCode,
          name: res.data.sysUser.name,
          id: res.data.depts[0].id,
          simplename: res.data.depts[0].simplename
        }
        wx.setStorage({
          key: 'userinfo',
          data: userinfo,
          success: () => {
            wx.navigateTo({
              url: '../index/index',
            })
          }
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  }
})
import { purDetail, outDetail } from '../../api/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mode: 0,
    //  出库
    outStatus: '',
    // 出库 入库
    stockMode: 0,
    orderNo: '',
    pageIndex: 1,
    pageSize: 10,
    list: []
  },

  getpurDetail() {
    let data = {
      orderNo: this.data.orderNo,
      pageIndex: this.data.pageIndex,
      pageSize: this.data.pageSize,
      condition: ''
    }
    purDetail(data).then(res => {
      console.log(res)
      if (res.status === 200) {
        this.setData({
          list: [...this.data.list, ...res.data.records],
          pageIndex: this.data.pageIndex + 1
        })
      }
    })
  },
  getoutDetail() {
    let data = {
      orderNo: this.data.orderNo,
      pageIndex: this.data.pageIndex,
      pageSize: this.data.pageSize,
      outStatus: this.data.outStatus,
      condition: ''
    }
    outDetail(data).then(res => {
      console.log(res)
      if (res.status === 200) {
        this.setData({
          list: [...this.data.list, ...res.data.records],
          pageIndex: this.data.pageIndex + 1
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      mode: options.stockMode,
      created: options.created,
      orderNo: options.orderNo,
      skuNum: options.skuNum
    })
    this.init_requirs()
    if (options.stockMode == 1) {
      this.setData({
        supplierName: options.supplierName
      })
      wx.setNavigationBarTitle({
        title: '入库'
      })
    } else {
      this.setData({
        routeName: options.routeName
      })
      wx.setNavigationBarTitle({
        title: '出库'
      })
    }
  },
  init_requirs() {
    if (this.data.mode == 1) {
      this.getpurDetail()
    } else {
      this.getoutDetail()
    }
  },
  onReachBottom: function () {
    this.init_requirs()
  }
})
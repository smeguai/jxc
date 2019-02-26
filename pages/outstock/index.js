// pages/outstock/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filter: false,
    mode: ['未出库', '差异', '已出库'],
    list: [
      { mode: 0, no: 'DO0000', line: '线路1', time: '2015-02-04', sku: 12 },
      { mode: 1, no: 'D11111', line: '线路2', time: '2029-14-18', sku: 4 },
      { mode: 2, no: 'D22222', line: '线路3', time: '2019-12-23', sku: 53 },
      { mode: 1, no: 'D33333', line: '线路4', time: '2019-02-12', sku: 22 },
      { mode: 2, no: 'D22222', line: '线路3', time: '2019-12-23', sku: 53 },
      { mode: 0, no: 'D88888', line: '线路14', time: '2018-08-18', sku: 8 },
      { mode: 2, no: 'D44444', line: '线路5', time: '2011-03-11', sku: 3 }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  handleFilterClick() {
    this.setData({
      filter: !this.data.filter
    })
  },
  handleItemClick(e) {
    let modeIdx = e.currentTarget.dataset.mode
    if (modeIdx === 0) {
      wx.navigateTo({
        url: '../nooutstock/index'
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
import { purList, getSupplier } from '../../api/api.js'
import { getNowFormatDate } from '../../utils/util.js'
const app = new getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filter: false,
    pageSize: 10,
    pageIndex: 1,
    createTime: '',
    userinfo: null,


    createDate: '',
    purStatus: '',
    supplierId: '',
    supplierList: [],
    purList: [],


    _Type: ['手工录入', '自动生成'],
    _Status: ['未收货', '已收货', '差异']
  },
  getSupplier() {
    this.setData({
      userinfo: wx.getStorageSync('userinfo')
    })
    let data = {sysCode: this.data.userinfo.sysCode}
    getSupplier(data).then(res => {
      if (res.status === 200) {
        this.setData({
          supplierList: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSupplier()
    this.handleConfirmClick()
    // this.setData({
    //   createDate: getNowFormatDate()
    // })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  handleFilterClick() {
    this.setData({
      filter: !this.data.filter
    })
  },
  bindsupplierChange(e) {
    let index = e.detail.value
    let currentId = this.data.supplierList[index].id
    this.setData({
      supplierId: e.detail.value
    })
  },
  bindDateChange(e) {
    let d = new Date(e.detail.value)
    this.setData({
      createTime: d.getTime(),
      createDate: e.detail.value
    })
  },
  handleConfirmClick() {
    let data = {
      purStatus: this.data.purStatus,
      supplierId: this.data.supplierId,
      deptId: this.data.userinfo.id,
      created: this.data.createDate,
      pageIndex: this.data.pageIndex,
      pageSize: this.data.pageSize
    }
    purList(data).then(res => {
      console.log(res)
      if (res.status === 200) {
        this.setData({
          purList: res.data.records
        })
      }
    })
  },
  Statustoogle(e) {
    this.setData({
      purStatus: e.currentTarget.dataset.idx
    })
  },
  handleItemClick(e) {
    let mode = parseInt(e.currentTarget.dataset.mode)
    let item = this.data.purList[e.currentTarget.dataset.key]


    let sysCode = this.data.userinfo.sysCode
    let { deptId, deptName, supplierId, supplierName, orderNo, skuNum, created} = item
    switch (mode) {
      case 1:
      break;
      case 0:
      case 2:
        wx.navigateTo({
          url: `../goodsmode/index?mode=1&sysCode=${sysCode}&deptId=${deptId}&deptName=${deptName}&supplierId=${supplierId}&supplierName=${supplierName}&originalNo=${orderNo}&skuNum=${skuNum}&created=${created}`
        })
      break;
    }
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
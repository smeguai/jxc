import { purList, getSupplier } from '../../api/api.js'
import { getNowFormatDate } from '../../utils/util.js'
const app = new getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    condition: '',
    userinfo: null,
    createDate: '',
    purStatus: '',
    supplierId: '',
    supplierList: [],
    purList: [],
    pageSize: 10,
    pageIndex: 1,
    //  init
    _Type: ['手工录入', '自动生成'],
    _Status: ['未收货', '已收货', '差异'],
    filter: false
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
  },
  filterPurList() {
    this.setData({
      pageIndex: 1,
      pageSize: 10,
      purList: []
    })
    this.handleConfirmClick()
    this.handleFilterClick()
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
      supplierId: e.detail.value,
      condition: this.data.supplierList[index].supplierName
    })
  },
  bindDateChange(e) {
    let d = new Date()
    this.setData({
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
      pageSize: this.data.pageSize,
      condition: this.data.condition
    }
    purList(data).then(res => {
      if (res.status === 200) {
        this.setData({
          purList: [...this.data.purList, ...res.data.records]
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
          url: `../goodsmode/index?stockMode=1&sysCode=${sysCode}&deptId=${deptId}&deptName=${deptName}&supplierId=${supplierId}&supplierName=${supplierName}&orderNo=${orderNo}&skuNum=${skuNum}&created=${created}`
        })
      break;
    }
  },
  onReachBottom: function () {
    this.setData({
      pageIndex: this.data.pageIndex + 1
    })
    this.handleConfirmClick()
  }
})
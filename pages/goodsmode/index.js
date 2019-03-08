import { purDetail, saveDI, itemQuery, outDetail } from '../../api/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIdx: 0,
    //  stockMode : 1 采购入库 2 配送出库
    stockMode: 0,
    popsectionShow: false,
    orderNo: '',
    pageIndex: 1,
    pageSize: 10,
    list: [],
    itemDetail: null,
    diffNum: 0,
    userinfo: null,

    search_pageIdx: 1,
    search_pageSize: 10,
    //  保存的商品信息
    totalAmt: 0,
    saveDI_data: null,
    itemList: [],
    //  table data
    t_data: '',
    t_expiration_date: '',
    t_memo: '',
    t_itemNum: 0,
    t_totalAmt: 0,

  },

  tabtoogle(e) {
    this.setData({
      tabIdx: e.currentTarget.dataset.idx
    })
  },
  handleDateChange(e) {
    this.setData({
      t_data: e.detail.value
    })
  },
  handleNavigateBackClick() {
    wx.navigateBack({
      delta: 1
    })
  },
  handleRemarksBlur(e) {
    this.setData({
      t_memo: e.detail.value
    })
  },
  gandelexpirationBlur(e) {
    this.setData({
      t_expiration_date: e.detail.value
    })
  },
  handleShipmentBlur(e) {
    if (this.data.itemDetail.purNum >= e.detail.value) {
      this.setData({
        t_itemNum: e.detail.value,
        t_totalAmt: this.data.itemDetail.itemCostPrice * e.detail.value
      })
    } else {
      wx.showToast({
        title: '确认实收数量!',
        icon: 'none'
      })
    }
    console.log('line 44: 价格//' + this.data.t_totalAmt)
  },
  getPurDetail() {
    let data = {
      orderNo: this.data.saveDI_data.originalNo,
      pageIndex: this.data.pageIndex,
      pageSize: this.data.pageSize
    }
    purDetail(data).then(res => {
      if (res.status === 200) {
        this.setData({
          list: res.data.records
        })
      }
    })
  },
  getoutDetail() {
    let data = {
      orderNo: this.data.saveDI_data.originalNo,
      outStatus: 0,
      pageIndex: this.data.pageIndex,
      pageSize: this.data.pageSize
    }
    outDetail(data).then(res => {
      console.log(res)
      if (res.status === 200) {
        this.setData({
          list: res.data.records
        })
      }
    })
  },
  _init_itemList(i) {
    let item = {
      sysCode: i.sysCode,
      deptId: i.deptId,
      deptName: i.deptName,
      supplierId: i.supplierId,
      supplierName: i.supplierName,
      originalNo: i.originalNo,
      skuNum: i.skuNum,
      totalAmt: this.data.totalAmt,
      operator: this.data.userinfo.name
    }
    this.setData({
      saveDI_data: item
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      stockMode: options.mode,
      orderNo: options.originalNo,
      created: options.created,
      deptName: options.deptName,
      skuNum: options.skuNum,
      userinfo: wx.getStorageSync('userinfo')
    })
    this._init_itemList(options)
    if (options.mode == 1) {
      this.getPurDetail()
    } else {
      this.getoutDetail()
    }
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
  handleItemClick(e) {
    let key = e.currentTarget.dataset.key
    let list = this.data.list
    this.setData({
      itemDetail: list[key],
      popsectionShow: !this.data.popsectionShow
    })
  },
  popMaskerToggle() {
    this.setData({
      popsectionShow: !this.data.popsectionShow
    })
  },
  saveGoods() {
    let i = this.data.saveDI_data
    let d = this.data.itemDetail
    let s = {
      sysCode: i.sysCode,
      deptId: i.deptId,
      deptName: i.deptName,
      supplierId: i.supplierId,
      supplierName: i.supplierName,
      itemId: d.itemId,
      itemSubno: d.itemSubno,
      itemNo: d.itemNo,
      itemName: d.itemName,
      itemUnit: d.itemUnit,
      itemSize: d.itemSize,
      itemCostPrice: d.itemCostPrice,
      totalAmt: this.data.t_totalAmt,
      itemNum: this.data.t_itemNum,
      productionDate: this.data.t_data,
      expiration_date: this.data.t_expiration_date,
      memo: this.data.t_memo
    }
    this.setData({
      itemList: [...this.data.itemList, JSON.stringify(s)],
      totalAmt: this.data.totalAmt + s.totalAmt
    })
    this.popMaskerToggle()
  },
  handleOutStockClick() {
    let DI = this.data.saveDI_data
    DI.skuNum = this.data.itemList.length
    DI.itemList = `[${this.data.itemList.toString()}]`
    DI.totalAmt = this.data.totalAmt
    this.setData({
      saveDI_data: DI
    })
    saveDI(DI).then(res => {
      console.log(res)
    })
  },
  handleSearchEnter(e) {
    // let data = {
    //   temSubno：商品条码
    //   itemName：商品名称
    //   deptId：配送中心ID
    //   pageIndex: this.data.search_pageIdx,
    //   pageSize: this.data.search_pageSize
    // }
    // itemQuery(data).then(res => {
    //   console.log(res)
    // })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { 
  }
})
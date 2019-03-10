import { getSupplier, itemQuery, addPur} from '../../api/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maskerShow: false,
    goodslistmaskShow: false,
    getSupplierTXT: '请选择供应商名称',
    getSupplierID: 0,
    userinfo: null,
    SupplierList: [],

    goodslist: [{a: 1}],
    pageindex: 1,
    pagesize: 20,
    goodslist_active:null,
    purNum: 0,
    addList: [],
    timer: null
  },
  scrollReachBottom() {
    clearTimeout(this.data.timer)
    let t = setTimeout(() => {
      this.getitemQuery()
    }, 400)
    this.setData({
      timer: t
    })
  },
  handleMaskerToggle() {
    this.setData({
      maskerShow: !this.data.maskerShow
    })
  },
  handleScancodeClick() {
    wx.scanCode({
      success: (res) => {
        this.setData({
          pageindex: 1,
          goodslist: [],
          condition: res.result
        })
        this.getitemQuery()
        this.handlegoodsMaskerToggle()
      },
      fail: (err) => {
        wx.showToast({
          title: '扫描失败',
          icon: 'none'
        })
      }
    })
  },
  handlegoodsMaskerToggle() {
    this.setData({
      goodslistmaskShow: !this.data.goodslistmaskShow
    })
  },
  getSupplier() {
    let data = { sysCode: this.data.userinfo.sysCode }
    getSupplier(data).then(res => {
      console.log(res.data)
      if (res.status===200) {
        this.setData({
          SupplierList: res.data
        })
      }
    })
  },
  bindsupplierChange(e) {
    let supplier = {
      txt: this.data.SupplierList[e.detail.value].supplierName,
      id : this.data.SupplierList[e.detail.value].id
    }
    this.setData({
      getSupplierTXT: supplier.txt,
      getSupplierID: supplier.id
    })
    wx:wx.setStorage({
      key: 'supplier',
      data: supplier
    })
  },
  handlegoodslistClick() {
    this.getitemQuery()
    this.handlegoodsMaskerToggle()
  },
  search_iptenter(e) {
    this.setData({
      condition: e.detail.value
    })
    if (this.data.goodslist) {
      this.getitemQuery()
      this.handlegoodsMaskerToggle()
    }
  },
  getitemQuery() {
    wx.showLoading({
      title: '加载中...'
    })
    let data = {
      condition: this.data.condition,
	    deptId: this.data.userinfo.id,
	    pageIndex: this.data.pageindex,
	    pageSize: this.data.pagesize
    }
    itemQuery(data).then(res => {
      if (res.status === 200) {
        if (res.data) {
          this.setData({
            goodslist: res.data.data,
            pageindex: this.data.pageindex + 1
          })
        }
      }
    })
  },
  handleAddItemClick() {
    let item = this.data.goodslist_active
    if (!item) {
      wx.showToast({
        title: '还未录入商品信息',
        icon: 'none'
      })
    } else {
      let userinfo = this.data.userinfo
      let data = {
        sysCode: userinfo.sysCode,
        deptId: userinfo.id,
        deptName: userinfo.simplename,
        supplierId: this.data.getSupplierID,
        supplierName: this.data.getSupplierTXT,
        itemId: item.id,
        itemSubno: item.itemSubno,
        itemNo: item.itemNo,
        itemName: item.itemName,
        itemUnit: item.itemUnit,
        itemSize: item.itemSize,
        itemCostPrice: item.itemCostPrice,
        totalAmt: item.itemCostPrice * this.data.purNum,
        purNum: this.data.purNum
      }
      let addList = [...this.data.addList, data]
      this.setData({
        addList,
        goodslist_active: null
      })
      wx.showToast({
        title: '添加成功！',
        icon: 'none'
      })
    }
  },
  goodsItemClick(e) {
    this.setData({
        goodslist_active: e.currentTarget.dataset.item
    })
  },
  purNum(e) {
    this.setData({
      purNum: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init_supplier()
    this.setData({
      userinfo: wx.getStorageSync('userinfo')
    })
    
    this.getSupplier()
  },
  init_supplier() {
    let supplier = wx.getStorageSync('supplier')
    this.setData({
      getSupplierTXT: supplier.txt,
      getSupplierID: supplier.id
    })
  },
  submitList() {
    if (this.data.addList.length == 0) return
    let { sysCode, name, id, simplename } = this.data.userinfo
    let itemlist = [], totalAmt = 0
    this.data.addList.map(i => {
      itemlist.push(JSON.stringify(i)),
      totalAmt += i.totalAmt
    })
    let data = {
      sysCode,
      deptId: id,
      deptName: simplename,
      operator: name,
      supplierId: this.data.getSupplierID,
      supplierName: this.data.getSupplierTXT,
      skuNum: this.data.addList.length,
      totalAmt,
      itemList: '[' + itemlist.toString() + ']'
    }
    addPur(data).then(res => {
      if (res.status === 200) {
        wx.showToast({
          title: '添加成功',
          icon: 'none'
        })
      }
    })
  }
})
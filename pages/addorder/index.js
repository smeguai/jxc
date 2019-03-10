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

    goodslist: [],
    pageindex: 1,
    pagesize: 100,
    itemSubno: '',
    itemName: '',
    goodslist_active:null,
    purNum: 0,
    addList: []
  },
  handleMaskerToggle() {
    this.setData({
      maskerShow: !this.data.maskerShow
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
    this.setData({
      getSupplierTXT: this.data.SupplierList[e.detail.value].supplierName,
      getSupplierID: this.data.SupplierList[e.detail.value].id
    })
  },
  handlegoodslistClick() {
    this.getitemQuery()
    this.handlegoodsMaskerToggle()
  },
  search_iptenter(e) {
    let mode = e.currentTarget.dataset.mode
    let t = '',n = ''
    if (mode==1) {
      t = e.detail.value
    } else {
      n = e.detail.value
    }
    this.setData({
      itemSubno: t,
      itemName: n
    })
    if (this.data.goodslist) {
      this.getitemQuery()
      this.handlegoodsMaskerToggle()
    }
  },
  getitemQuery() {
    let data = {
      itemSubno: this.data.itemSubno,
	    itemName: this.data.itemName,
	    deptId: this.data.userinfo.id,
	    pageIndex: this.data.pageindex,
	    pageSize: this.data.pagesize
    }
    itemQuery(data).then(res => {
      if (res.status === 200) {
        if (res.data) {
          this.setData({
            goodslist: res.data.data
          })
        }
      }
    })
  },
  goodsItemClick(e) {
    let item = e.currentTarget.dataset.item
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
      goodslist_active: item
    })
    this.handlegoodsMaskerToggle()
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
    this.setData({
      userinfo: wx.getStorageSync('userinfo')
    })
    this.getSupplier()
  },
  submitList() {
    if (this.data.addList.length == 0) return
    let { sysCode, name, id, simplename } = this.data.userinfo
    let itemlist = []
    this.data.addList.map(i => {
      itemlist.push(JSON.stringify(i))
    })
    let data = {
      sysCode,
      deptId: id,
      deptName: simplename,
      operator: name,
      supplierId: this.data.getSupplierID,
      supplierName: this.data.getSupplierTXT,
      skuNum: 1,
      totalAmt: 0,
      itemList: '[' + itemlist.toString() + ']'
    }
    addPur(data).then(res => {
      console.log(res)
      if (res.status === 200) {
        wx.showToast({
          title: '添加成功',
          icon: 'none'
        })
      }
    })
  }
})
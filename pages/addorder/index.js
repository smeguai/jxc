import { getSupplier, itemQuery, addPur} from '../../api/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maskerShow: false,
    goodslistmaskShow: false,
    getSupplierTXT: '请选择供应商名称',
    getSupplierID: -1,
    userinfo: null,
    SupplierList: [],
    goodslist: [],
    pageindex: 1,
    pagesize: 20,
    goodslist_active: null,
    purNum: '',
    addList: [],
    timer: null,
    itemSubno: '',
    itemName: ''
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
          itemSubno: res.result
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
      goodslistmaskShow: !this.data.goodslistmaskShow,
      pageindex: 1
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
    this.setData({
      pageindex: 1,
      goodslist: [],
      itemName: e.detail.value
    })
    this.getitemQuery()
    this.handlegoodsMaskerToggle()
  },
  search_name_iptenter(e) {
    this.setData({
      pageindex: 1,
      goodslist: [],
      itemName: e.detail.value
    })
    if (this.data.goodslist) {
      this.getitemQuery()
      this.handlegoodsMaskerToggle()
    }
  },
  search_no_iptenter(e) {
    this.setData({
      itemSubno: e.detail.value,
      pageindex: 1,
      goodslist: []
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
	    deptId: this.data.userinfo.id,
	    pageIndex: this.data.pageindex,
	    pageSize: this.data.pagesize,
      itemSubno: this.data.itemSubno,
      itemName: this.data.itemName
    }
    itemQuery(data).then(res => {
      if (res.status === 200) {
        if (res.data) {
          this.setData({
            goodslist: [...this.data.goodslist, ...res.data.data],
            pageindex: this.data.pageindex + 1
          })
        }
      }
    })
  },
  handleAddItemClick() {
    if (this.data.getSupplierID == -1) {
      wx.showToast({
        title: '请选择供应商',
        icon: 'none'
      })
      return
    }
    console.log(1)
    let t = this.data.purNum.replace(/(^\s*)|(\s*$)/g, "")
    if (t) {
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
          goodslist_active: null,
          purNum: ''
        })
        wx.showToast({
          title: '添加成功！',
          icon: 'none'
        })
      }
    } else {
      wx.showToast({  
        title: '请输入采购数量',
        icon: 'none'
      })
    }
  },
  goodsItemClick(e) {
    this.setData({
        goodslist_active: e.currentTarget.dataset.item
    })
    this.handlegoodsMaskerToggle()
  },
  purNum(e) {
    this.setData({
      purNum: e.detail.value.replace(/(^\s*)|(\s*$)/g, "")
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
          icon: 'none',
          success: () => {
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 1500)
          }
        })
      }
    })
  }
})
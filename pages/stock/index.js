import { checkList, getItemCls, check} from '../../api/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filter: false,
    numipt: '',
    checknumber: 0,
    popmasker: false,
    userinfo: null,
    pageindex: 1,
    pagesize: 10,
    catelist: [],
    cate: '请选择',
    orderlist: [],
    checkstatus: ['未盘点', '已盘点'],
    checker: '',
    clickItem: null
  },
  getcheckList() {
    let data = {
      deptId: this.data.userinfo.id,
      itemName: '',
      itemSubno: '',
      checkStatus: '',
      itemType: '',
      pageIndex: this.data.pageindex,
      pageSize: this.data.pagesize
    }
    checkList(data).then(res => {
      if (res.status === 200) {
        this.setData({
          orderlist: res.data.data
        })
      }
    })
  },
  checkeriptblur(e) {
    this.setData({
      checker: e.detail.value
    })
  },
  handleSubmitClick() {
    let item = this.data.clickItem
    console.log(item)
    let data = {
      sysCode: this.data.userinfo.sysCode,
	    deptId: this.data.userinfo.id,
      deptName: this.data.userinfo.simplename,
      itemId: item.itemId,
      itemSubno: item.itemSubno,
      itemNo: item.itemNo,
      itemName: item.itemName,
      itemUnit: item.itemUnit,
      itemSize: item.itemSize, 
      checkNum: this.data.checknumber, 
      checker: this.data.checker,
      memo: ''
    }
    check(data).then(res => {
      console.log(res)

    })
    this.popconfirmToggle()
  },
  getItemCls() {
    getItemCls().then(res => {
      if (res.status===200) {
        this.setData({
          catelist: res.data
        })
      }
    })
  },
  bindsupplierChange(e) {
    this.setData({
      cate: this.data.catelist[e.detail.value].itemClsname
    })
  },
  handleCateClick() {
    this.getcheckList()
  },
  handleItemClick(e) {
    let idx = e.currentTarget.dataset.idx
    this.setData({
      clickItem: this.data.orderlist[idx]
    })
    console.log(this.data.clickItem)
    this.popconfirmToggle()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userinfo: wx.getStorageSync('userinfo')
    })
    this.getItemCls()
    this.getcheckList()
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
  handleNumberClick(e) {
    let n = e.currentTarget.dataset.number
    if (!this.data.numipt) {
      this.setData({
        numipt: n
      })
      return
    }
    this.setData({
      numipt: this.data.numipt + n
    })
  },
  handleConfirmClick() {
    if (this.data.numipt) {
      this.setData({
        checknumber: this.data.numipt,
        numipt: ''
      })
    }
  },
  handleResetClick() {
    this.setData({
      numipt: ''
    })
  },
  popconfirmToggle() {
    this.setData({
      popmasker: !this.data.popmasker
    })
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
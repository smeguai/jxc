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
    clickItem: null,
    notRequires: false,
    //  0 未盘点 1 已盘点
    checker_mode: ''
  },
  Statustoogle(e) {
    this.setData({
        checker_mode: e.currentTarget.dataset.idx
    })
  },
  getcheckList() {
    let data = {
      deptId: this.data.userinfo.id,
      itemName: '',
      itemSubno: '',
      checkStatus: this.data.checker_mode,
      itemType: this.data.cate == "请选择" || this.data.cate == "全部" ? "" : this.data.cate,
      pageIndex: this.data.pageindex,
      pageSize: this.data.pagesize
    }
    checkList(data).then(res => {
      if (res.status === 200) {
        if (!res.data) {
          this.setData({
            orderlist: []
          })
          return
        }
        this.setData({
          orderlist: res.data.data,
          notRequires: res.data.total >= 10 ? false : true
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
          catelist: [{ itemClsname: '全部'}, ...res.data]
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
    this.setData({
      pageIndex: 1
    })
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
  onReachBottom: function () {
    if (this.data.notRequires) return
    this.setData({
      pageIndex: this.data.pageIndex + 1
    })
    this.getcheckList()
  }
})
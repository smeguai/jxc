import { outList} from '../../api/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filter: false,
    mode: ['未出库', '已出库', '差异'],
    userinfo: {},
    pageindex: 1,
    pagesize: 10,
    outList: []
  },
  getOutList() {
    let data = {
      sysCode: this.data.userinfo.sysCode,
      deptId: this.data.userinfo.id,
      outStatus: '',
      routeId: '',
      created: '',
      pageIndex: this.data.pageindex,
      pageSize: this.data.pagesize
    }
    outList(data).then(res => {
      if (res.status === 200) {
        this.setData({
          outList: res.data.records
        })
        console.log(this.data.outList)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userinfo: wx.getStorageSync('userinfo')
    })
    this.getOutList()
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
    let mode = parseInt(e.currentTarget.dataset.mode)
    let item = this.data.outList[e.currentTarget.dataset.key]

    let sysCode = this.data.userinfo.sysCode
    let { routeId, routeName, supplierId, supplierName, orderNo, skuNum, created } = item
    switch(mode) {
      case 1:

      break;
      case 0:
      case 2:
        wx.navigateTo({
          url: `../goodsmode/index?mode=2&sysCode=${sysCode}&deptId=${routeId}&deptName=${routeName}&supplierId=${supplierId}&supplierName=${supplierName}&originalNo=${orderNo}&skuNum=${skuNum}&created=${created}`
        })
      break;
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})
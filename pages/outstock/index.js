import { outList, getRoute} from '../../api/api.js'
import { get_YHM } from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filter: false,
    filterList: [{ mode: '全部', idx: '' }, { mode: '未收货', idx: '0' }, { mode: '差异', idx: '2' }, { mode: '已收货', idx: '1' }],
    mode: ['未出库', '已出库', '差异'],
    userinfo: {},
    outStatus: '',
    pageindex: 1,
    pagesize: 10,
    outList: [],
    createDate: '',
    //  时间区间
    date_start: '2016-01-01',
    date_end: ''
  },
  filterOutList() {
    this.setData({
      pageIndex: 1,
      outList: []
    })
    this.getOutList()
    this.handleFilterClick()
  },
  getOutList() {
    let data = {
      sysCode: this.data.userinfo.sysCode,
      deptId: this.data.userinfo.id,
      outStatus: this.data.outStatus,
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
  getRoute() {
    let data = {
      deptId: wx.getStorageSync('userinfo').id
    }
    getRoute().then(res => {

    })
  },
  Statustoogle(e) {
    this.setData({
      outStatus: e.currentTarget.dataset.idx
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userinfo: wx.getStorageSync('userinfo'),
      date_end: get_YHM()
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
    let { created, deptId, deptName, skuNum, outStatus, orderNo, routeId, routeName } = item
    switch(mode) {
      case 1:

      break;
      case 0:
      case 2:
        wx.navigateTo({
          url: `../goodsmode/index?stockMode=2&sysCode=${sysCode}&created=${created}&deptId=${deptId}&deptName=${deptName}&skuNum=${skuNum}&outStatus=${outStatus}&orderNo=${orderNo}&routeId=${routeId}&routeName=${routeName}`
        })
      break;
    }
  },
  datechange(e) {
    this.setData({
      createDate: e.detail.value
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})
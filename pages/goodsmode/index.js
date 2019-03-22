import { purDetail, saveDI, saveDO, itemQuery, outDetail } from '../../api/api.js'
import { get_YHM } from '../../utils/util.js'
Page({
  data: {
    // init 
    tabIdx: 0,
    //  stockMode : 1 采购入库 2 配送出库
    stockMode: 0,
    userinfo: null,

    //  search inner 
    condition: '',
    outstatus: 0,
    routeId: 0,
    routeName: '',
    popsectionShow: false,
    pageIndex: 1,
    pageSize: 10,
    list: [],
    itemDetail: null,
    diffNum: 0,
    
    // 公共的data数据
    sysCode: 0,
    deptId: 0,
    deptName: '',
    skuNum: 0,
    totalAmt: 0,
    orderNo: 0,
    operator: '',
    //  入库
    supplierId: 0,
    supplierName: '',
    purType: '',
    //  出库
    routId: '',
    routeName: '',
    itemlistTouchStartX: 0,
    itemlistTouchStartY: 0,
    animationData: null,
    animationDataIdx: null,
    search_pageIdx: 1,
    search_pageSize: 10,
    //  保存的商品信息
    saveDI_data: null,
    itemList: [],
    //  table data
    t_data: '请选择',
    t_expiration_date: '',
    t_memo: '',
    t_itemNum: '',
    t_totalAmt: 0,
    date_end: '',
    date_start: '2016-01-01',

    //  save DI key
    saveDI_KEY: 0
  },
  handleScancodeClick() {
    wx.scanCode({
      success: (res) => {
        this.setData({
          list: [],
          pageIndex: 1,
          condition: res.result
        })
        console.log(res)
        if (this.data.stockMode == 1) {
          this.getPurDetail()
        } else if (this.data.stockMode == 2) {
          this.getoutDetail()
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '扫描失败',
          icon: 'none'
        })
      }
    })
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
    let itemDetail = this.data.itemDetail
    if (this.data.stockMode == 1) {
      let num = parseInt(e.detail.value)
      if (num!==0 && num + itemDetail.takeNum <= itemDetail.purNum) {
        this.setData({
          t_itemNum: num,
          t_totalAmt: this.data.itemDetail.itemCostPrice * num
        })
      } else {
        wx.showToast({
          title: '收货数量不能小于1, 且应大于应收数量',
          icon: 'none'
        })
        this.setData({
          t_itemNum: ''
        })
      }
    } else {
      if (e.detail.value <= itemDetail.shouldNum - itemDetail.differenceNum - itemDetail.afterNum) {
        this.setData({
          t_itemNum: e.detail.value,
          t_totalAmt: this.data.itemDetail.itemCostPrice * e.detail.value
        })
      } else {
        wx.showToast({
          title: '实出数量不能大于应出数量',
          icon: 'none'
        })
        this.setData({
          t_itemNum: ''
        })
      }
    }
  },
  getPurDetail() {
    wx.showLoading({
      title: '搜索中...',
    })
    let data = {
      orderNo: this.data.orderNo,
      pageIndex: this.data.pageIndex,
      pageSize: this.data.pageSize,
      condition: this.data.condition
    }
    purDetail(data).then(res => {
      if (res.status === 200) {
        this.setData({
          list: [...this.data.list, ...res.data.records]
        })
      }
    })
  },
  getoutDetail() {
    wx.showLoading({
      title: '搜索中',
    })
    let data = {
      orderNo: this.data.orderNo,
      outStatus: this.data.outStatus,
      pageIndex: this.data.pageIndex,
      pageSize: this.data.pageSize,
      condition: this.data.condition
    }
    outDetail(data).then(res => {
      if (res.status === 200) {
        this.setData({
          list: [...this.data.list, ...res.data.records]
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
      skuNum: i.skuNum,
      totalAmt: this.data.totalAmt,
      operator: this.data.userinfo.name
    }
    this.setData({
      saveDI_data: item
    })
  },
  onLoad: function (options) {
    let { stockMode, sysCode, deptId, deptName, orderNo, created, skuNum } = options
    this.setData({
      date_end: get_YHM(),
      stockMode,
      sysCode,
      deptId,
      deptName,
      orderNo,
      created: created.substr(0, 10),
      skuNum,
      userinfo: wx.getStorageSync('userinfo')
    })
    this._init_itemList(options)
    if (stockMode == 1) {
      this.setData({
        supplierId: options.supplierId,
        supplierName: options.supplierName,
        purType: options.purType
      })
      wx.setNavigationBarTitle({
        title: '入库'
      })
      this.getPurDetail()
    } else if (stockMode == 2) {
      this.setData({
        outStatus: options.outStatus,
        routId: options.routeId,
        routeName: options.routeName
      })
      wx.setNavigationBarTitle({
        title: '出库'
      })
      this.getoutDetail()
    }
  },
  handleSaveItemListClick(e) {
    let key = e.currentTarget.dataset.key
    this.data.itemList.map(i => {
      if (i.itemId === e.currentTarget.dataset.item.itemId) {
        this.setData({
          t_itemNum: i.itemNum,
          t_expiration_date: i.expiration_date || i.expirationDate,
          t_memo: i.memo,
          t_data: i.productionDate
        })
      }
    })
    this.popMaskerToggle()
  },
  handleItemClick(e) {
    if (e.currentTarget.dataset.item.outStatus == 1 || e.currentTarget.dataset.item.purStatus == 1) return
    let key = e.currentTarget.dataset.key
    this.setData({
      saveDI_KEY: key,
      itemDetail: e.currentTarget.dataset.item,
      popsectionShow: !this.data.popsectionShow
    })
  },
  cancelSave() {
    this.setData({
      t_itemNum: '',
      t_expiration_date: '',
      t_memo: '',
      t_data: '请选择'
    })
    this.popMaskerToggle()
  },
  popMaskerToggle() {
    this.setData({
      popsectionShow: !this.data.popsectionShow
    })
  },
  handleSaveTouchStart(e) {
    this.setData({
      itemlistTouchStartX: e.touches[0].clientX,
      animationDataIdx: e.currentTarget.dataset.key
    })
  },
  handleSaveItemMove(e) {
    this.setData({
      animationData: {}
    })
    let animation = wx.createAnimation({
      duration: 200
    })
    if (e.touches[0].clientX - this.data.itemlistTouchStartX <= -60) {
      
      animation.right('140rpx').step()
      this.setData({
        animationData: animation.export()
      })
    } else if (e.touches[0].clientX - this.data.itemlistTouchStartX >= 60) {
      animation.right('0').step()
      this.setData({
        animationData: animation.export()
      })
    }
  },
  saveGoods() {
    if (this.data.t_data != '请选择' && this.data.t_itemNum.replace(/(^\s*)|(\s*$)/g, "") && this.data.t_expiration_date.replace(/(^\s*)|(\s*$)/g, "")) {
      //  检索是否提交过
      let itemList = this.data.itemList
      let list = this.data.list
      let out = false
      itemList.map(i => {
        if (i.itemId == this.data.saveDI_KEY) {
          list.map((i, k) => {
            if (i.itemId == this.data.saveDI_KEY) {
              list.splice(k, 1)
              this.setData({
                list
              })
            }
          })
          out = true
        }
      })
      if (out) return
      //  提交操作
      let init_item_data = this.data.saveDI_data
      list.map((i, k) => {
        if (i.itemId == this.data.saveDI_KEY) {
          list.splice(k, 1)
          let data = null
          if (this.data.stockMode == 1) {
            data = {
              sysCode: init_item_data.sysCode,
              deptId: init_item_data.deptId,
              deptName: init_item_data.deptName,
              supplierId: init_item_data.supplierId,
              supplierName: init_item_data.supplierName,
              purNum: i.purNum,
              itemId: i.itemId,
              itemSubno: i.itemSubno,
              itemNo: i.itemNo,
              itemName: i.itemName,
              itemUnit: i.itemUnit,
              itemSize: i.itemSize,
              itemCostPrice: i.itemCostPrice,
              totalAmt: this.data.t_totalAmt,
              itemNum: this.data.t_itemNum,
              productionDate: this.data.t_data,
              expiration_date: this.data.t_expiration_date,
              memo: this.data.t_memo
            }
          } else if(this.data.stockMode == 2) {
            data = {
              sysCode: this.data.sysCode,
              deptId: this.data.deptId,
              deptName: this.data.deptName,
              routeId: this.data.routeId,
              routeName: this.data.routeName,
              orderNo: this.data.orderNo,
              itemId: i.itemId,
              itemSubno: i.itemSubno,
              itemNo: i.itemNo,
              itemName: i.itemName,
              itemUnit: i.itemUnit,
              itemSize: i.itemSize,
              itemCostPrice: i.itemCostPrice,
              totalAmt: this.data.t_totalAmt,
              itemNum: this.data.t_itemNum,
              productionDate: this.data.t_data,
              expirationDate: this.data.t_expiration_date,	
              memo: this.data.t_memo
            }
          }
          this.setData({
            list,
            itemList: [...this.data.itemList, data]
          })
          this.cancelSave()
        }
      })
    } else {
      wx.showToast({
        title: '请录入商品信息',
        icon: 'none'
      })
    }
  },
  handleOutStockClick() {
    let DI = this.data.saveDI_data
    DI.skuNum = this.data.itemList.length
    let itemls_string = []
    let dotalAmt = 0
    this.data.itemList.map(i => {
      itemls_string.push(JSON.stringify(i)),
      dotalAmt += i.totalAmt
    })
    DI.itemList = '[' + itemls_string.toString() + ']'
    DI.totalAmt = dotalAmt
    this.setData({
      saveDI_data: DI
    })
    
    if (this.data.stockMode == 1) {
      let data = {
        sysCode: this.data.sysCode,
        deptId: this.data.deptId,
        deptName: this.data.deptName,
        supplierId: this.data.supplierId,
        supplierName: this.data.supplierName,
        skuNum: this.data.itemList.length,
        totalAmt: this.data.totalAmt,
        originalNo: this.data.orderNo,
        operator: this.data.userinfo.name,
        itemList: '[' + itemls_string.toString() + ']'
      }
      console.log(data)
      //  入库
      saveDI(data).then(res => {
        if (res.status === 200) {
          wx.showToast({
            title: '操作成功!',
            icon: 'none'
          })
          this.setData({
            itemList: []
          })
        } else if (res.status == 400) {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    } else {
      let itemls_string = []
      this.data.itemList.map(i => {
        itemls_string.push(JSON.stringify(i))
      })
      let data = {
        sysCode: this.data.sysCode,
        deptId: this.data.deptId,
        deptName: this.data.deptName,
        routId: this.data.routeId,
        routeName: this.data.routeName,
        skuNum: this.data.itemList.length,
        totalAmt: this.data.totalAmt,
        originalNo: this.data.orderNo,
        operator: this.data.userinfo.name,
        itemList: '[' + itemls_string.toString() + ']'
      }
      saveDO(data).then(res => {

        if (res.status === 200) {
          wx.showToast({
            title: '操作成功!',
            icon: 'none'
          })
          this.setData({
            itemList: []
          })
        } else if (res.status == 400) {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    }
  },
  savelist_item_delete(e) {
    let itemList = this.data.itemList
    let list = this.data.list
    let item = itemList.splice(e.currentTarget.dataset.idx, 1)
    list.push(...item)
    this.setData({
      itemList,
      list,
      animationData: null,
      animationDataIdx: null
    })
  },
  handleSearchEnter(e) {
    let t = e.detail.value.replace(/(^\s*)|(\s*$)/g, "")
    if (t) {
      this.setData({
        condition: t,
        list: [],
        pageIndex: 1
      })
      if (this.data.stockMode == 1) {
        this.getPurDetail()
      } else {
        this.getoutDetail()
      }
    }
  },
  onReachBottom() {
    if (this.data.tabIdx == 1) return
    this.setData({
      pageIndex: this.data.pageIndex + 1
    })
    if (this.data.stockMode == 1) {
      this.getPurDetail()
    } else {
      this.getoutDetail()
    }
  }
})



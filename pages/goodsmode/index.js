import { purDetail, saveDI, saveDO, itemQuery, outDetail } from '../../api/api.js'
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
    //  出库
    routId: '',
    routeName: '',


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


    //  save DI key
    saveDI_KEY: 0
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
    this.setData({
      t_itemNum: e.detail.value,
      t_totalAmt: this.data.itemDetail.itemCostPrice * e.detail.value
    })
  },
  getPurDetail() {
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
      stockMode,
      sysCode,
      deptId,
      deptName,
      orderNo,
      created,
      skuNum,
      userinfo: wx.getStorageSync('userinfo')
    })
    this._init_itemList(options)
    if (stockMode == 1) {
      this.setData({
        supplierId: options.supplierId,
        supplierName: options.supplierName
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
  handleItemClick(e) {
    let key = e.currentTarget.dataset.key
    this.setData({
      saveDI_KEY: key,
      itemDetail: e.currentTarget.dataset.item,
      popsectionShow: !this.data.popsectionShow
    })
  },
  popMaskerToggle() {
    this.setData({
      popsectionShow: !this.data.popsectionShow
    })
  },
  saveGoods() {
    if (this.data.t_data == '请选择' || this.data.t_itemNum == '' || this.data.t_expiration_date == '') {
      console.log(this.data.t_itemNum == '' )
      wx.showToast({
        title: '请输入完整信息',
        icon: 'none'
      })
      
    } else {
      this.popMaskerToggle()
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
          // let s = {
          //   sysCode: init_item_data.sysCode,
          //   deptId: init_item_data.deptId,
          //   deptName: init_item_data.deptName,
          //   supplierId: init_item_data.supplierId,
          //   supplierName: init_item_data.supplierName,
          //   itemId: i.itemId,
          //   itemSubno: i.itemSubno,
          //   itemNo: i.itemNo,
          //   itemName: i.itemName,
          //   itemUnit: i.itemUnit,
          //   itemSize: i.itemSize,
          //   itemCostPrice: i.itemCostPrice,
          //   totalAmt: this.data.t_totalAmt,
          //   itemNum: this.data.t_itemNum,
          //   productionDate: this.data.t_data,
          //   expiration_date: this.data.t_expiration_date,
          //   memo: this.data.t_memo
          // }
          // this.setData({
          //   list,
          //   itemList: [...this.data.itemList, s]
          // })
          if (this.data.stockMode == 1) {
            let data = {
              sysCode: init_item_data.sysCode,
              deptId: init_item_data.deptId,
              deptName: init_item_data.deptName,
              supplierId: init_item_data.supplierId,
              supplierName: init_item_data.supplierName,
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
            this.setData({
              list,
              itemList: [...this.data.itemList, data]
            })
          }else if(this.data.stockMode == 2) {
            let data = {
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
            this.setData({
              list,
              itemList: [...this.data.itemList, data]
            })
          }
        }
      })
    }
  },
  handleOutStockClick() {
    let DI = this.data.saveDI_data
    DI.skuNum = this.data.itemList.length
    let itemls_string = []
    this.data.itemList.map(i => {
      itemls_string.push(JSON.stringify(i))
    })
    DI.itemList = '[' + itemls_string.toString() + ']'
    DI.totalAmt = this.data.totalAmt
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
        console.log(res)
      })
    }
  },
  handleSearchEnter(e) {
    this.setData({
      condition: e.detail.value,
      list: [],
      pageIndex: 1
    })
    if (this.data.stockMode == 1) {
      this.getPurDetail()
    } else {
      this.getoutDetail()
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



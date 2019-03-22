import https from './config.js'
//  登录
export function signin(data) {
  return https('/Invoicing/login', data).then(res => {
    return res.data
  })
}
//  采购入库订单
export function purList(data) {
  return https('/Invoicing/purList',data).then(res => {
    return res.data
  })
}
//  采购订单详情
export function purDetail(data) {
  return https('/Invoicing/purDetail', data).then(res => {
    return res.data
  }).catch(() => {
  })
}
//  获取供应商
export function getSupplier(data) {
  return https('/Invoicing/getSupplier', data).then(res => {
    return res.data
  })
}
//  完成入库
export function getRoute(data) {
  return https('/Invoicing/getRoute', data).then(res => {
    return res.data
  })
}
//  完成线路
export function saveDI(data) {
  return https('/Invoicing/saveDI', data).then(res => {
    return res.data
  })
}
//  出库订单查询
export function outList(data) {
  return https('/Invoicing/outList', data).then(res => {
    return res.data
  })
}
//  商品查询
export function itemQuery(data) {
  return https('/Invoicing/itemQuery', data).then(res => {
    return res.data
  }).catch(() => {
  })
}
// 出库订单详情
export function outDetail(data) {
  return https('/Invoicing/outDetail', data).then(res => {
    return res.data
  }).catch(() => {
  })
}
// 获取盘点数据
export function checkList(data) {
  return https('/Invoicing/checkList', data).then(res => {
    return res.data
  })
}
// 获取商品类型列表
export function getItemCls(data) {
  return https('/Invoicing/getItemCls', data).then(res => {
    return res.data
  })
}
//  添加采购单
export function addPur(data) {
  return https('/Invoicing/addPur', data).then(res => {
    return res.data
  })
}
//  盘点
export function check(data) {
  return https('/Invoicing/check', data).then(res => {
    return res.data
  })
}
//  完成入库
export function saveDO(data) {
  return https('/Invoicing/saveDO', data).then(res => {
    return res.data
  })
}
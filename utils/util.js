const getNowFormatDate = () => {
  let date = new Date()
  let seperator = '-'
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  let strDate = date.getDate()
  if (m >= 1 && m <= 9) {
    m = "0" + m
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate
  }
  var currentdate = y + seperator + m + seperator + strDate
  return currentdate
}
module.exports = {
  getNowFormatDate
}
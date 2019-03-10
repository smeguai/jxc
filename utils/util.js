const get_YHM = () => {
  let date = new Date()
  let y = date.getFullYear()
  let m = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  let d = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
  let dateStr = `${y}-${m}-${d}`
  return dateStr
}
module.exports = {
  get_YHM
}
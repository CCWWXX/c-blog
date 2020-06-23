/**
 *  设置cookie
 * */
let setCookie = function (key, value, exdays) {
  let exdate = new Date() // 获取时间
  exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) // 保存的天数,不写为不保存
  // 字符串拼接cookie
  window.document.cookie =
    key + '=' + value + ';path=/;expires=' + exdate.toGMTString()
}
/**
 *  读取cookie
 * */
let getCookie = function (key = null) {
  let value = null
  const allcookies = document.cookie
  // key开始索引的位置
  let keyStart = allcookies.indexOf(key)
  // 如果找到了key索引，就代表cookie存在,否则不存在
  if (keyStart !== -1) {
    // 计算取cookie值的开始索引，加的1为“=”
    const cookieStart = keyStart + key.length + 1
    // 计算取cookie值的结束索引
    let cookieEnd = allcookies.indexOf('; ', cookieStart)
    if (cookieEnd === -1) {
      cookieEnd = allcookies.length
    }
    // 得到想要的cookie的值
    value = allcookies.substring(cookieStart, cookieEnd)
  }
  return value
}
/**
 *  清除cookie
 * */
let removeCookie = function (key) {
  setCookie(key, '', -1) // 修改值都为空，天数为负1天
}
export default {
  setCookie,
  getCookie,
  removeCookie
}

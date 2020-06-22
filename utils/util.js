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
  if (document.cookie.length > 0) {
    let arr = document.cookie.split('; ') // 这里显示的格式需要切割一下自己可输出看下
    let object = {}
    for (let i = 0; i < arr.length; i++) {
      let arr2 = arr[i].split('=')
      object[arr2[0]] = arr2[1]
    }
    if (key) {
      return object[key]
    } else {
      return object
    }
  }
}
/**
 *  清除cookie
 * */
let removeCookie = function (key) {
  setCookie(key, '', -1) // 修改2值都为空，天数为负1天就好了
}
export default {
  setCookie,
  getCookie,
  removeCookie
}

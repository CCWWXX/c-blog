/**
 * 注册验证
 */
const { ErrorModel } = require('../model/resModel')
const { getUserInfo } = require('../controller/user')

module.exports = async (ctx, next) => {
  const { username, password, id } = ctx.request.body
  const reg = /^(\w){6,12}$/
  const data = await getUserInfo(username)
  // id与寻找的id相同说明说明是修改本人信息
  if (data && data.length && Number(id) !== data[0].id) {
    ctx.body = new ErrorModel('该用户名已存在')
    return
  }
  // 有id时为更新信息，此时没有password不需要验证
  if ((!id || password) && !reg.test(password)) {
    ctx.body = new ErrorModel('密码只能输入6-12位的字母、数字、下划线')
    return
  }
  await next()
}

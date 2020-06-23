/**
 * 注册验证
 */
const { ErrorModel } = require('../model/resModel')
const { checkUsername } = require('../controller/user')

module.exports = async (ctx, next) => {
  const { username, password } = ctx.request.body
  const reg = /^(\w){6,12}$/
  const data = await checkUsername(username)
  if (data && data.length) {
    ctx.body = new ErrorModel('该用户名已存在')
    return
  }
  if (!reg.test(password)) {
    ctx.body = new ErrorModel('只能输入6-12位的字母、数字、下划线')
    return
  }
  await next()
}

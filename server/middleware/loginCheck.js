/**
 * 验证登陆
 */
const { ErrorModel } = require('../model/resModel')

module.exports = async (ctx, next) => {
  if (ctx.session.username) {
    await next()
    return
  }
  ctx.body = new ErrorModel('未登录或登陆信息已失效')
}

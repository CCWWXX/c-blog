const { ErrorModel } = require('../model/resModel')

module.exports = async (ctx, next) => {
  let type = ctx.request.files['image'].type
  const isImage = /(jpeg|png)$/.test(type)
  if (isImage) {
    await next()
    return
  }
  ctx.body = new ErrorModel('图片上传格式错误')
}

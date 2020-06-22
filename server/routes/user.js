const router = require('koa-router')()
const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/user')

router.post('/login', async function (ctx, next) {
  const { username, password } = ctx.request.body
  const data = await login(username, password)
  if (data.username) {
    // 设置 session
    ctx.session.username = data.username
    ctx.session.realname = data.realname
    ctx.session.user_id = data.id

    ctx.body = new SuccessModel(data)
    return
  }
  ctx.body = new ErrorModel('登录失败')
})

router.get('/info', loginCheck, async function (ctx, next) {
  const data = {
    username: ctx.session.username,
    realname: ctx.session.realname
  }
  if (data) {
    ctx.body = new SuccessModel(data)
  } else {
    ctx.body = new ErrorModel('更新博客失败')
  }
})

router.get('/logout', loginCheck, async function (ctx, next) {
  ctx.session.username = null
  ctx.session.realname = null
  ctx.session.user_id = null
  ctx.body = new SuccessModel('注销成功')
})

module.exports = router

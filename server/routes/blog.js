const router = require('koa-router')()
const {
  getList,
  getDetail,
  starBlog,
  checkStar,
  newBlog,
  createComment,
  getComment
} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')
const imageCheck = require('../middleware/imageCheck')
const { uploadImg } = require('../utils/uploadImg')

router.prefix('/api/blog')

router.get('/list', async function (ctx, next) {
  let author = ctx.query.author || ''
  if (ctx.query.isadmin) {
    console.log('is admin')
    // 管理员界面
    if (ctx.session.username == null) {
      console.error('is admin, but no login')
      // 未登录
      ctx.body = new ErrorModel('未登录')
      return
    }
    // 强制查询自己的博客
    author = ctx.session.username
  }
  const userId = ctx.session.user_id
  const listData = await getList(author, userId, ctx.query)
  ctx.body = new SuccessModel(listData)
})

router.get('/detail', async function (ctx, next) {
  const data = await getDetail(ctx.query.id, ctx.query.newView)
  ctx.body = new SuccessModel(data)
})

router.post('/star', async function (ctx, next) {
  const userId = ctx.session.user_id
  const data = await starBlog(userId, ctx.request.body)
  if (data) {
    ctx.body = new SuccessModel()
  } else {
    ctx.body = new ErrorModel('操作失败')
  }
})

router.get('/checkStar', async function (ctx, next) {
  const articleId = ctx.query.article_id || ''
  const data = await checkStar(ctx.session.user_id, articleId)
  ctx.body = new SuccessModel(data)
})

router.post('/new', loginCheck, async function (ctx, next) {
  const body = ctx.request.body
  body.author = ctx.session.username
  const data = await newBlog(body)
  ctx.body = new SuccessModel(data)
})

router.post('/upload', loginCheck, imageCheck, async function (ctx, next) {
  const url = await uploadImg(ctx)
  if (url) {
    ctx.body = new SuccessModel({url: url})
  } else {
    ctx.body = new ErrorModel('')
  }
})

router.post('/createComment', loginCheck, async function (ctx, next) {
  const body = ctx.request.body
  const userId = ctx.session.user_id
  const data = await createComment(userId, body)
  ctx.body = new SuccessModel(data)
})

router.get('/comment', async function (ctx, next) {
  const data = await getComment(ctx.query)
  ctx.body = new SuccessModel(data)
})

module.exports = router

const Koa = require('koa')
const { Nuxt, Builder } = require('nuxt')

// const json = require('koa-json')
const onerror = require('koa-onerror')
// const bodyparser = require('koa-bodyparser')
const koaBody = require('koa-body') // 解析上传文件的插件
// const logger = require('koa-logger')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const path = require('path')
// const fs = require('fs')
// const morgan = require('koa-morgan')
const KoaStatic = require('koa-static')

const blog = require('./routes/blog')
const user = require('./routes/user')

const allConfig = require('./conf/db')
const REDIS_CONF = allConfig.REDIS_CONF

async function start() {
  const app = new Koa()
  const host = allConfig.host || '127.0.0.1'
  const port = allConfig.port || 8002

  // Import and Set Nuxt.js options
  const config = require('../nuxt.config.js')
  config.dev = !(app.env === 'production')
  // error handler
  onerror(app)
  // 访问静态资源
  app.use(KoaStatic(path.join(__dirname, 'static')))
  // middlewares
  // app.use(bodyparser({
  //   enableTypes: ['json', 'form', 'text']
  // }))
  app.use(koaBody({
    multipart: true,
    strict: false, // 可解析其他请求方法，如delete, get
    formidable: {
      maxFileSize: 2000 * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
    }
  }))
  // app.use(json())
  // app.use(logger())

// logger
  // app.use(async (ctx, next) => {
  //   const start = new Date()
  //   await next()
  //   const ms = new Date() - start
  //   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
  // })

  // const ENV = process.env.NODE_ENV
  // if (ENV !== 'production') {
  // // 开发环境 / 测试环境
  //   app.use(morgan('dev'))
  // } else {
  // // 线上环境
  //   const logFileName = path.join(__dirname, 'logs', 'access.log')
  //   const writeStream = fs.createWriteStream(logFileName, {
  //     flags: 'a'
  //   })
  //   app.use(morgan('combined', {
  //     stream: writeStream
  //   }))
  // }

// session 配置
  let redisClient = redisStore({
    // all: '127.0.0.1:6379'   // 写死本地的 redis
    all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
  })
  redisClient.on('error', (err) => {
    // 打印redis连接报错
    console.log('redisError:', err)
  })
  app.keys = REDIS_CONF.redisKeys
  app.use(session({
  // 配置 cookie
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    },
  // 配置 redis
    store: redisClient
  }))

// Instantiate nuxt.js
  const nuxt = new Nuxt(config)

// Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

// routes
  app.use(blog.routes(), blog.allowedMethods())
  app.use(user.routes(), user.allowedMethods())
  app.use(ctx => {
    ctx.status = 200
    ctx.respond = false // Mark request as handled for Koa
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })
  app.listen(port, host)
  console.log(`Server listening on http://${host}:${port}`) // eslint-disable-line no-console
}

start()

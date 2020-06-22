require('source-map-support/register')
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

class BaseModel {
  constructor(data, message) {
    if (typeof data === 'string') {
      this.message = data;
      data = null;
      message = null;
    }
    if (data) {
      this.data = data;
    }
    if (message) {
      this.message = message;
    }
  }
}

class SuccessModel extends BaseModel {
  constructor(data, message) {
    super(data, message);
    this.errno = 0;
  }
}

class ErrorModel extends BaseModel {
  constructor(data, message) {
    super(data, message);
    this.errno = -1;
  }
}

module.exports = {
  SuccessModel,
  ErrorModel
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

let allConfig = __webpack_require__(22);
allConfig =  false ? allConfig.prod : allConfig.dev;

module.exports = allConfig;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("koa-router");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const mysql = __webpack_require__(21);
const allConfig = __webpack_require__(1);

// 创建链接对象
const con = mysql.createConnection(allConfig.MYSQL_CONF);

// 开始链接
con.connect();

// 统一执行 sql 的函数
function exec(sql) {
  const promise = new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
  return promise;
}

module.exports = {
  exec,
  escape: mysql.escape
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const { ErrorModel } = __webpack_require__(0);

module.exports = async (ctx, next) => {
  if (ctx.session.username) {
    await next();
    return;
  }
  ctx.body = new ErrorModel('未登录或登陆信息已失效');
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {const Koa = __webpack_require__(8);
const { Nuxt, Builder } = __webpack_require__(9);

const json = __webpack_require__(10);
const onerror = __webpack_require__(11);
// const bodyparser = require('koa-bodyparser')
const koaBody = __webpack_require__(12); // 解析上传文件的插件
const logger = __webpack_require__(13);
const session = __webpack_require__(14);
const redisStore = __webpack_require__(15);
const path = __webpack_require__(2);
const fs = __webpack_require__(3);
const morgan = __webpack_require__(16);
const KoaStatic = __webpack_require__(17);

const blog = __webpack_require__(18);
const user = __webpack_require__(26);

const allConfig = __webpack_require__(1);
const REDIS_CONF = allConfig.REDIS_CONF;

async function start() {
  const app = new Koa();
  const host = allConfig.host || '127.0.0.1';
  const port = allConfig.port || 8002;

  // Import and Set Nuxt.js options
  const config = __webpack_require__(30);
  config.dev = !(app.env === 'production');
  // error handler
  onerror(app);
  // 访问静态资源
  app.use(KoaStatic(path.join(__dirname, 'static')));
  // middlewares
  // app.use(bodyparser({
  //   enableTypes: ['json', 'form', 'text']
  // }))
  app.use(koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 2000 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
    }
  }));
  app.use(json());
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
  });
  redisClient.on('error', err => {
    // 打印redis连接报错
    console.log('redisError:', err);
  });
  app.keys = REDIS_CONF.redisKeys;
  app.use(session({
    // 配置 cookie
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    },
    // 配置 redis
    store: redisClient
  }));

  // Instantiate nuxt.js
  const nuxt = new Nuxt(config);

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  // routes
  app.use(blog.routes(), blog.allowedMethods());
  app.use(user.routes(), user.allowedMethods());
  app.use(ctx => {
    ctx.status = 200;
    ctx.respond = false; // Mark request as handled for Koa
    ctx.req.ctx = ctx; // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res);
  });
  app.listen(port, host);
  console.log(`Server listening on http://${host}:${port}`); // eslint-disable-line no-console
}

start();
/* WEBPACK VAR INJECTION */}.call(exports, "server"))

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("koa");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("nuxt");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("koa-json");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("koa-onerror");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("koa-body");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("koa-logger");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("koa-generic-session");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("koa-redis");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("koa-morgan");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("koa-static");

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

const router = __webpack_require__(4)();
const {
  getList,
  getDetail,
  starBlog,
  checkStar,
  newBlog,
  createComment,
  getComment
} = __webpack_require__(19);
const { SuccessModel, ErrorModel } = __webpack_require__(0);
const loginCheck = __webpack_require__(6);
const imageCheck = __webpack_require__(24);
const { uploadImg } = __webpack_require__(25);

router.prefix('/api/blog');

router.get('/list', async function (ctx, next) {
  let author = ctx.query.author || '';
  if (ctx.query.isadmin) {
    console.log('is admin');
    // 管理员界面
    if (ctx.session.username == null) {
      console.error('is admin, but no login');
      // 未登录
      ctx.body = new ErrorModel('未登录');
      return;
    }
    // 强制查询自己的博客
    author = ctx.session.username;
  }
  const userId = ctx.session.user_id;
  const listData = await getList(author, userId, ctx.query);
  ctx.body = new SuccessModel(listData);
});

router.get('/detail', async function (ctx, next) {
  const data = await getDetail(ctx.query.id, ctx.query.newView);
  ctx.body = new SuccessModel(data);
});

router.post('/star', async function (ctx, next) {
  const userId = ctx.session.user_id;
  const data = await starBlog(userId, ctx.request.body);
  if (data) {
    ctx.body = new SuccessModel();
  } else {
    ctx.body = new ErrorModel('操作失败');
  }
});

router.get('/checkStar', async function (ctx, next) {
  const articleId = ctx.query.article_id || '';
  const data = await checkStar(ctx.session.user_id, articleId);
  ctx.body = new SuccessModel(data);
});

router.post('/new', loginCheck, async function (ctx, next) {
  const body = ctx.request.body;
  body.author = ctx.session.username;
  const data = await newBlog(body);
  ctx.body = new SuccessModel(data);
});

router.post('/upload', loginCheck, imageCheck, async function (ctx, next) {
  const url = await uploadImg(ctx);
  if (url) {
    ctx.body = new SuccessModel({ url: url });
  } else {
    ctx.body = new ErrorModel('');
  }
});

router.post('/createComment', loginCheck, async function (ctx, next) {
  const body = ctx.request.body;
  const userId = ctx.session.user_id;
  const data = await createComment(userId, body);
  ctx.body = new SuccessModel(data);
});

router.get('/comment', async function (ctx, next) {
  const data = await getComment(ctx.query);
  ctx.body = new SuccessModel(data);
});

module.exports = router;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

const xss = __webpack_require__(20);
const { exec } = __webpack_require__(5);
const dayjs = __webpack_require__(23);

const getList = async (author, userId, query) => {
  const keyword = query.keyword || '';
  const page = query.page || 1;
  const pageSize = query.page_size || 10;
  let sql = `select * from blogs where 1=1 `;
  if (author) {
    sql += `and author='${author}' `;
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' or description like '%${keyword}%'`;
  }
  // 时间反序和分页
  sql += `order by createtime desc limit ${(page - 1) * pageSize}, ${pageSize};`;
  let listData = await exec(sql);
  const totalSql = `select count(id) from blogs`;
  const total = await exec(totalSql);
  for (let val of listData) {
    const starSql = `select * from stars where article_id='${val.id}'`;
    const starData = await exec(starSql);
    // 该文章点赞数
    val.stars = starData.length;
    // 当前用户是否点赞该文章
    let isStart;
    if (userId) {
      isStart = !!starData.find(item => item.user_id === userId);
    }
    val.isStar = isStart;
  }
  const data = {
    listData: listData,
    page: page,
    pageSize: pageSize,
    total: total[0]['count(id)']
  };
  return data;
};

const getDetail = async (id, newView) => {
  // 是否要增加一次预览
  if (Number(newView)) {
    const upDateViewsSql = `update blogs set views=views+1 where id='${id}'`;
    await exec(upDateViewsSql);
  }
  const starSql = `select * from stars where article_id='${id}'`;
  const starData = await exec(starSql);
  const sql = `select * from blogs where id='${id}'`;
  const rows = await exec(sql);
  // 该文章点赞数
  rows[0].stars = starData.length;
  // // 判断当前用户是否点赞
  // let isStart = !!starData.find(item => item.user_id === userId)
  // rows[0].isStar = isStart
  return rows[0];
};

const starBlog = async (userId, blogData = {}) => {
  const articleId = blogData.article_id;
  const status = blogData.status;
  const starTime = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
  let sql;
  if (Number(status)) {
    sql = `insert into stars (user_id, article_id, star_time) values ('${userId}', '${articleId}', '${starTime}');`;
  } else {
    sql = `delete from stars where article_id='${articleId}' and user_id='${userId}';`;
  }
  const insertData = await exec(sql);
  if (insertData.affectedRows > 0) {
    return true;
  }
  return false;
};

// 验证当前文章是否点赞，由于服务端渲染，cookie验证的接口单独拿出来
const checkStar = async (userId, articleId) => {
  const starSql = `select * from stars where article_id='${articleId}' and user_id='${userId}'`;
  const starData = await exec(starSql);
  // 判断当前用户是否点赞
  let isStart = starData && starData.length;
  return { isStar: isStart };
};

const newBlog = async (blogData = {}) => {
  const title = xss(blogData.title);
  // xss会影响富文本
  const content = blogData.content;
  const description = xss(blogData.description);
  const logo = xss(blogData.logo);
  const author = blogData.author;
  const createTime = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');

  const sql = `
        insert into blogs (title, content, description, logo, createtime, author)
        values ('${title}', '${content}', '${description}', '${logo}', '${createTime}', '${author}');
    `;

  const insertData = await exec(sql);
  return {
    id: insertData.insertId
  };
};

const createComment = async (userId, blogData = {}) => {
  const userSql = `select username from users where id=${userId}`;
  const user = await exec(userSql);
  const author = user[0].username;
  // xss会影响富文本
  const content = xss(blogData.content);
  const parentId = blogData.parent_id || -1;
  const articleId = blogData.article_id;
  const commentTime = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');

  const sql = `
        insert into comments (author, content, comment_time, user_id, parent_id, article_id)
        values ('${author}', '${content}', '${commentTime}', '${userId}', '${parentId}', '${articleId}');
    `;

  const insertData = await exec(sql);
  return {
    id: insertData.insertId
  };
};

const getComment = async query => {
  const articleId = query.article_id;
  const sql = `select * from comments where article_id=${articleId}`;

  const data = await exec(sql);
  return data;
};

module.exports = {
  getList,
  getDetail,
  starBlog,
  checkStar,
  newBlog,
  createComment,
  getComment
};

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("xss");

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("mysql");

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = {"dev":{"host":"127.0.0.1","port":"8002","secret_key":"ccc1456#","MYSQL_CONF":{"host":"localhost","user":"root","password":"a123456","port":"3306","database":"myblog"},"REDIS_CONF":{"port":"6379","host":"127.0.0.1","redisKeys":["ccc456#555_"]}},"prod":{"host":"127.0.0.1","port":"8003","secret_key":"ccc1456#","MYSQL_CONF":{"host":"localhost","user":"root","password":"a123456","port":"3306","database":"myblog"},"REDIS_CONF":{"port":"6379","host":"127.0.0.1","redisKeys":["ccc456#555_"]}}}

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("dayjs");

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

const { ErrorModel } = __webpack_require__(0);

module.exports = async (ctx, next) => {
  let type = ctx.request.files['image'].type;
  const isImage = /(jpeg|png)$/.test(type);
  if (isImage) {
    await next();
    return;
  }
  ctx.body = new ErrorModel('图片上传格式错误');
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {// 上传图片
const fs = __webpack_require__(3);
const path = __webpack_require__(2);
function uploadImg(ctx) {
  const promise = new Promise((resolve, reject) => {
    let time = new Date().getTime();
    // 创建可读流
    const reader = fs.createReadStream(ctx.request.files['image']['path']);
    let filePath = path.join(__dirname, '../', '../', 'static/image', `/${time}${ctx.request.files['image']['name']}`);
    // let filePath = `./static` + `/${ctx.request.files['image']['name']}`
    let remotefilePath = `http://127.0.0.1:8002/image` + `/${time}${ctx.request.files['image']['name']}`;
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
    reader.on('end', () => {
      resolve(remotefilePath);
    });
    reader.on('error', () => {
      resolve(false);
    });
  });
  return promise;
}
module.exports = {
  uploadImg
};
/* WEBPACK VAR INJECTION */}.call(exports, "server\\utils"))

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

const router = __webpack_require__(4)();
const { login } = __webpack_require__(27);
const { SuccessModel, ErrorModel } = __webpack_require__(0);
const loginCheck = __webpack_require__(6);

router.prefix('/api/user');

router.post('/login', async function (ctx, next) {
  const { username, password } = ctx.request.body;
  const data = await login(username, password);
  if (data.username) {
    // 设置 session
    ctx.session.username = data.username;
    ctx.session.realname = data.realname;
    ctx.session.user_id = data.id;

    ctx.body = new SuccessModel(data);
    return;
  }
  ctx.body = new ErrorModel('登录失败');
});

router.get('/info', loginCheck, async function (ctx, next) {
  const data = {
    username: ctx.session.username,
    realname: ctx.session.realname
  };
  if (data) {
    ctx.body = new SuccessModel(data);
  } else {
    ctx.body = new ErrorModel('更新博客失败');
  }
});

router.get('/logout', loginCheck, async function (ctx, next) {
  ctx.session.username = null;
  ctx.session.realname = null;
  ctx.session.user_id = null;
  ctx.body = new SuccessModel('注销成功');
});

module.exports = router;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

const { exec, escape } = __webpack_require__(5);
const { genPassword } = __webpack_require__(28);

const login = async (username, password) => {
  username = escape(username);

  // 生成加密密码
  password = genPassword(password);
  password = escape(password);

  const sql = `
        select username, realname, id from users where username=${username} and password=${password}
    `;
  const rows = await exec(sql);
  return rows[0] || {};
};

module.exports = {
  login
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

const crypto = __webpack_require__(29);
const allConfig = __webpack_require__(1);

// 密匙
const SECRET_KEY = allConfig.secret_key;

// md5 加密
function md5(content) {
  let md5 = crypto.createHash('md5');
  return md5.update(content).digest('hex');
}

// 加密函数
function genPassword(password) {
  const str = `password=${password}&key=${SECRET_KEY}`;
  return md5(str);
}

module.exports = {
  genPassword
};

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

const cdnConfig = __webpack_require__(31);
const env =  false ? require('./front-config.json').prod : __webpack_require__(32).dev;
module.exports = {
  // mode: 'spa',
  mode: 'universal', // 服务端渲染
  env,
  /*
  ** Headers of the page
  */
  head: {
    title: 'c-blog',
    meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }, { hid: 'description', name: 'description', content: 'Nuxt.js project' }],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: cdnConfig.js
    // script: [
    //   { src: require('./utils/lodash.js'), type: 'text/javascript' }
    // ]
  },
  /*
  ** Nuxt.js modules
  */
  modules: ['@nuxtjs/style-resources'],
  /*
  ** Global CSS
  */
  css: ['~assets/css/main.css', '~assets/style/common.scss', 'element-ui/lib/theme-chalk/index.css', 'quill/dist/quill.snow.css', 'quill/dist/quill.bubble.css', 'quill/dist/quill.core.css'],
  /*
  ** Customize the progress-bar color
  */
  router: {
    middleware: ['auth']
  },
  styleResources: {
    scss: ['@/assets/vars/*.scss' // 自己项目中的样式文件的路径
    ]
  },
  plugins: [{
    src: '~plugins/ElementUI',
    ssr: true
  }, {
    src: '~plugins/day',
    ssr: false
  }, {
    src: '~plugins/lodash.js',
    ssr: false
  }, {
    src: '~/plugins/vue-quill-editor',
    ssr: false
  }, {
    src: '~/plugins/eventlistener',
    ssr: false
  }],
  loading: { color: '#60aedd' },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** Run ESLINT on save
     */
    extend(config, ctx) {
      if (ctx.Client) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        });
      }
    }
  }
};

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = {"js":[{"src":"https://cdn.staticfile.org/particles.js/2.0.0/particles.min.js"}],"css":[]}

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = {"dev":{"apiUrl":"http://127.0.0.1:8002/"},"prod":{"apiUrl":"http://127.0.0.1:8003/"}}

/***/ })
/******/ ]);
//# sourceMappingURL=main.map
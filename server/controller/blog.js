const xss = require('xss')
const { exec } = require('../db/mysql')
const dayjs = require('dayjs')

const getList = async (author, userId, query) => {
  const keyword = query.keyword || ''
  const page = query.page || 1
  const pageSize = query.pageSize || 10
  let sql = `select * from blogs where 1=1 `
  if (author) {
    sql += `and author='${author}' `
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' or description like '%${keyword}%'`
  }
  // 获取总条数
  const total = await exec(sql)
  // 时间反序和分页
  sql += `order by createtime desc limit ${(page - 1) * pageSize}, ${pageSize};`
  let listData = await exec(sql)
  for (let val of listData) {
    const starSql = `select * from stars where article_id='${val.id}'`
    const starData = await exec(starSql)
    // 该文章点赞数
    val.stars = starData.length

    const commentSql = `select * from comments where article_id='${val.id}'`
    const commentData = await exec(commentSql)
    // 该文字评论数
    val.comments = commentData.length

    // 当前用户是否点赞该文章
    let isStart
    if (userId) {
      isStart = !!starData.find(item => item.user_id === userId)
    }
    val.isStar = isStart
  }
  const data = {
    listData: listData,
    page: page,
    pageSize: pageSize,
    total: total.length
  }
  return data
}

const getDetail = async (id, newView) => {
  // 是否要增加一次预览
  if (Number(newView)) {
    const upDateViewsSql = `update blogs set views=views+1 where id='${id}'`
    await exec(upDateViewsSql)
  }
  const starSql = `select * from stars where article_id='${id}'`
  const starData = await exec(starSql)
  const sql = `select * from blogs where id='${id}'`
  const rows = await exec(sql)
  // 该文章点赞数
  rows[0].stars = starData.length

  const commentSql = `select * from comments where article_id='${id}'`
  const commentData = await exec(commentSql)
  // 该文字评论数
  rows[0].comments = commentData.length

  // // 判断当前用户是否点赞
  // let isStart = !!starData.find(item => item.user_id === userId)
  // rows[0].isStar = isStart
  return rows[0]
}

const starBlog = async (userId, blogData = {}) => {
  const articleId = blogData.article_id
  const status = blogData.status
  const starTime = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss')
  let sql
  if (Number(status)) {
    sql = `insert into stars (user_id, article_id, star_time) values ('${userId}', '${articleId}', '${starTime}');`
  } else {
    sql = `delete from stars where article_id='${articleId}' and user_id='${userId}';`
  }
  const insertData = await exec(sql)
  if (insertData.affectedRows > 0) {
    return true
  }
  return false
}

// 验证当前文章是否点赞，由于服务端渲染，cookie验证的接口单独拿出来
const checkStar = async (userId, articleId) => {
  const starSql = `select * from stars where article_id='${articleId}' and user_id='${userId}'`
  const starData = await exec(starSql)
  // 判断当前用户是否点赞
  let isStart = starData && starData.length
  return { isStar: isStart }
}

const newBlog = async (blogData = {}) => {
  const title = xss(blogData.title)
  // xss会影响富文本
  const content = blogData.content
  const description = xss(blogData.description)
  const logo = xss(blogData.logo)
  const author = blogData.author
  const createTime = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss')

  const sql = `
        insert into blogs (title, content, description, logo, createtime, author)
        values ('${title}', '${content}', '${description}', '${logo}', '${createTime}', '${author}');
    `

  const insertData = await exec(sql)
  return {
    id: insertData.insertId
  }
}

const createComment = async (userId, blogData = {}) => {
  const userSql = `select username from users where id=${userId}`
  const user = await exec(userSql)
  const author = user[0].username
  // xss会影响富文本
  const content = xss(blogData.content)
  const parentId = blogData.parent_id || -1
  const articleId = blogData.article_id
  const commentTime = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss')

  const sql = `
        insert into comments (author, content, comment_time, user_id, parent_id, article_id)
        values ('${author}', '${content}', '${commentTime}', '${userId}', '${parentId}', '${articleId}');
    `

  const insertData = await exec(sql)
  return {
    id: insertData.insertId
  }
}

const getComment = async (query) => {
  const articleId = query.article_id
  const sql = `select * from comments where article_id=${articleId}`

  const data = await exec(sql)
  return data
}

const updateBlog = async (blogData = {}) => {
  const id = blogData.id
  const title = xss(blogData.title)
  // xss会影响富文本
  const content = blogData.content
  const description = xss(blogData.description)
  const logo = xss(blogData.logo)
  const sql = `
        update blogs set title='${title}', content='${content}', description='${description}', logo='${logo}' where id=${id}
    `
  const updateData = await exec(sql)
  if (updateData.affectedRows > 0) {
    return true
  }
  return false
}

const deleteBlog = async (id, author) => {
  const sql = `delete from blogs where id='${id}' and author='${author}';`
  const delData = await exec(sql)
  if (delData.affectedRows > 0) {
    return true
  }
  return false
}

module.exports = {
  getList,
  getDetail,
  starBlog,
  checkStar,
  newBlog,
  createComment,
  getComment,
  updateBlog,
  deleteBlog
}

const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')

const login = async (username, password) => {
  username = escape(username)

  // 生成加密密码
  password = genPassword(password)
  password = escape(password)

  const sql = `
        select username, realname, avatar, id from users where username=${username} and password=${password}
    `
  const rows = await exec(sql)
  return rows[0] || {}
}

const register = async (username, realname, password) => {
  username = escape(username)
  realname = escape(realname)
  password = genPassword(password)
  password = escape(password)
  const sql = `
        insert into users (username, realname, password)
        values (${username}, ${realname}, ${password});
    `
  const insertData = await exec(sql)
  return {
    id: insertData.insertId
  }
}

const getUserInfo = async (username) => {
  username = escape(username)
  let sql = `select username, realname, avatar, id from users where username=${username}`
  const data = await exec(sql)
  return data
}

const updateUser = async (userData = {}) => {
  // 克隆出来不影响下面
  let { username, realname, avatar, password, id } = JSON.parse(JSON.stringify(userData))
  username = escape(username)
  realname = escape(realname)
  let sql
  if (password) {
    password = genPassword(password)
    password = escape(password)
    sql = `
      update users set username=${username}, realname=${realname}, avatar='${avatar}', password=${password} where id=${id}
    `
  } else {
    sql = `
      update users set username=${username}, realname=${realname}, avatar='${avatar}' where id=${id}
    `
  }
  const updateData = await exec(sql)
  if (updateData.affectedRows > 0) {
    return {
      username: userData.username,
      realname: userData.realname,
      avatar: userData.avatar,
      id: userData.id
    }
  }
  return false
}

module.exports = {
  login,
  register,
  getUserInfo,
  updateUser
}

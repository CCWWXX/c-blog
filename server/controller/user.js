const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')

const login = async (username, password) => {
  username = escape(username)

  // 生成加密密码
  password = genPassword(password)
  password = escape(password)

  const sql = `
        select username, realname, id from users where username=${username} and password=${password}
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

const checkUsername = async (username) => {
  username = escape(username)
  let sql = `select * from users where username=${username}`
  const data = await exec(sql)
  return data
}

module.exports = {
  login,
  register,
  checkUsername
}

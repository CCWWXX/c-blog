 // 上传图片
const fs = require('fs')
const path = require('path')
const allConfig = require('../conf/db')
function uploadImg(ctx) {
  const promise = new Promise((resolve, reject) => {
    let time = new Date().getTime()
    // 创建可读流
    const reader = fs.createReadStream(ctx.request.files['image']['path'])
    let filePath = path.join(__dirname, '../', '../', 'static/image', `/${time}${ctx.request.files['image']['name']}`)
    // let filePath = `./static` + `/${ctx.request.files['image']['name']}`
    let remotefilePath = `${allConfig.img_base_url}/image` + `/${time}${ctx.request.files['image']['name']}`
    // 创建可写流
    const upStream = fs.createWriteStream(filePath)
    // 可读流通过管道写入可写流
    reader.pipe(upStream)
    reader.on('end', () => {
      resolve(remotefilePath)
    })
    reader.on('error', () => {
      resolve(false)
    })
  })
  return promise
}
module.exports = {
  uploadImg
}

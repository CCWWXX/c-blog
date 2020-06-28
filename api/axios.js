import axios from 'axios'
import qs from 'qs'
// import { Message } from 'element-ui'

const request = ({ url, params = {}, method = 'post', baseURL = '', isformData = false }) => {
  const config = {
    method,
    baseURL: baseURL || process.env.apiUrl,
    url,
    headers: {
      'Content-Type': !isformData ? 'application/x-www-form-urlencoded' : 'multipart/form-data' // 带有表单数据时的Content-Type
      // 'Content-Type': 'application/json'
    }
  }
  if (method === 'get' || method === 'GET') {
    config.params = params
  } else {
    config.data = qs.stringify(params)
    // config.data = params
  }
  return new Promise((resolve) => {
    try {
      axios(config)
        .then((res) => {
          // if (res.data.errno === -1) {
          //   Message({
          //     showClose: true,
          //     message: res.data.message,
          //     type: 'error'
          //   })
          //   return resolve()
          // }
          resolve(res.data || {})
        })
        .catch((err) => {
          console.log({ err })
          resolve()
        })
    } catch (error) {
      console.log(error)
      resolve()
    }
  })
}
export default request

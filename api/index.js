import request from './axios'
// user相关
export function login(params) {
  return request({ url: '/api/user/login', params, method: 'post' })
}

export function getUserInfo(params) {
  return request({ url: '/api/user/info', params, method: 'get' })
}

export function logout(params) {
  return request({ url: '/api/user/logout', params, method: 'get' })
}

// blog相关
export function getList(params) {
  return request({ url: '/api/blog/list', params, method: 'get' })
}

export function getDetail(params) {
  return request({ url: '/api/blog/detail', params, method: 'get' })
}

export function starBlog(params) {
  return request({ url: '/api/blog/star', params, method: 'post' })
}

export function checkStar(params) {
  return request({ url: '/api/blog/checkStar', params, method: 'get' })
}

export function createBlog(params) {
  return request({ url: '/api/blog/new', params, method: 'post' })
}

export function uploadImg(params) {
  return request({ url: '/api/blog/upload', params, method: 'post', isformData: true })
}

export function createComment(params) {
  return request({ url: '/api/blog/createComment', params, method: 'post' })
}

export function getComment(params) {
  return request({ url: '/api/blog/comment', params, method: 'get' })
}

// const cookieparser = process.server ? require('cookieparser') : undefined
import { getUserInfo, logout } from '@/api/index'
export const state = () => ({
  userInfo: {},
  isLogin: false
})
export const mutations = {
  setUser(state, data) {
    // 路由跳转时用，直接用url进入store里异步请求可能信息还没有获取，所以用localStorage里的判断
    // 前端路由跳转登陆验证用localStorage判断
    // 后端登陆信息过期只需给出提示
    state.userInfo = data
  },
  setLoginStatus(state, val) {
    state.isLogin = val
  }
}
export const actions = {
  async getUserInfo({ commit }) {
    let response = await getUserInfo()
    if (response.data) {
      commit('setUser', response.data)
    }
  },
  async logout({commit}) {
    let response = await logout()
    if (response) {
      commit('setUser', {})
      commit('setLoginStatus', false)
    }
  },
  async nuxtServerInit({ commit }, { req }) {
    if (req.ctx.session.username) {
      // let userInfo = {
      //   username: req.ctx.session.username,
      //   realname: req.ctx.session.realname
      // }
      commit('setLoginStatus', true)
    } else {
      commit('setLoginStatus', false)
    }
  }
}

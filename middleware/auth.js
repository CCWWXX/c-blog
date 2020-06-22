export default function ({ store, redirect, route }) {
  // 通过getUserInfo验证用户有没有登陆过
  // let userInfo = {}
  // try {
  //   userInfo = JSON.parse(localStorage.getItem('userInfo'))
  // } catch (error) {
  //   userInfo = {}
  // }
  if (/^\/admin/.test(route.path) && !store.state.isLogin) {
    return redirect('/')
  }
}

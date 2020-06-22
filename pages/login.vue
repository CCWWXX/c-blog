<template>
  <div class="login-container">
    <login-back></login-back>
    <!-- <p class="title">登陆</p> -->
    <el-form
      autocomplete="on"
      :model="loginForm"
      :rules="loginRules"
      ref="loginForm"
      label-position="left"
      label-width="0px"
      class="card-box login-form"
    >
      <el-form-item prop="username">
        <el-input
          name="username"
          type="text"
          v-model="loginForm.username"
          autocomplete="on"
          placeholder="账号"
          class="input"
        />
      </el-form-item>
      <el-form-item prop="password" class="password_wrap">
        <el-input
          name="password"
          :type="pwdType"
          @keyup.enter.native="handleLogin"
          v-model="loginForm.password"
          autocomplete="on"
          placeholder="密码"
          class="input"
        ></el-input>
      </el-form-item>
      <el-form-item class="check_wrap">
        <el-checkbox v-model="isRemember">记住密码</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          style="width:100%;"
          :loading="loading"
          @click.native.prevent="handleLogin"
          class="button"
        >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import util from '@/utils/util'
import { login } from '@/api/index'
import LoginBack from '@/components/LoginBack'
export default {
  name: 'login',
  data() {
    const validateUseraccount = (rule, value, callback) => {
      if (value.trim().length < 1) {
        callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.trim().length < 1) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      isRemember: false,
      loginRules: {
        username: [
          { required: true, trigger: 'change', validator: validateUseraccount }
        ],
        password: [{ required: true, trigger: 'change', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password'
    }
  },
  components: {
    LoginBack
  },
  methods: {
    rememberPassword() {
      if (this.isRemember) {
        // base64
        const loginInfo = this.loginForm.username + '&' + btoa(this.loginForm.password) + '&' + Number(this.isRemember)
        util.setCookie('loginInfo', loginInfo, 4)
      } else {
        util.removeCookie('loginInfo')
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // this.loading = true
          if (this.loginForm.username && this.loginForm.password) {
            // 记住密码
            this.login()
            this.rememberPassword()
          } else {
            // this.loading = false
          }
        } else {
          return false
        }
      })
    },
    async login() {
      let response = await login(this.loginForm)
      if (response && response.errno === 0) {
        // this.$store.commit('setUser', response.data)
        this.$store.commit('setLoginStatus', true)
        this.$router.push('/')
      } else {
        this.$message.error('账号或密码错误，登陆失败')
      }
    }
  },
  mounted() {
    // console.log(2222, this.$dayjs(new Date()).format('HH:mm:ss YYYY-MM-DD'))
    // console.log(3333, _)
    // console.log(process.env.NODE_ENV)
    const loginInfo = util.getCookie('loginInfo')
    if (loginInfo) {
      let infoArr = loginInfo.split('&')
      this.isRemember = !!infoArr[2]
      if (this.isRemember) {
        this.loginForm.username = infoArr[0]
        this.loginForm.password = atob(infoArr[1])
      }
    }
  }
}
</script>
<style scoped lang="scss">
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  // justify-content: center;
  // background-color: #365d9d;
  width: 100%;
  height: 100vh;
  padding-top: 250px;
  box-sizing: border-box;
  background-image: url(" ../assets/img/login_back.jpg");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  .title {
    z-index: 99;
    font-size: 34px;
    color: #fff;
  }
  .login-form {
    z-index: 99;
    display: flex;
    flex-direction: column;
    // align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 22px 30px 0;
    width: 320px;
    // height: 230px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 5px;
    .input input {
      width: 300px;
      background: rgba(255, 255, 255, 0.5);
    }
    .button {
      // width: 200px !important;
    }
    .password_wrap {
      margin-bottom: 15px;
    }
    .check_wrap {
      ::v-deep .el-form-item__content {
        line-height: unset;
      }
    }
  }
}
</style>

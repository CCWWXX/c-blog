<template>
  <div class="register-container">
    <login-back></login-back>
    <el-form
      autocomplete="on"
      :model="registerForm"
      :rules="registerRules"
      ref="registerForm"
      label-position="left"
      label-width="0px"
      class="card-box register-form"
    >
      <el-form-item prop="username" class="item_wrap">
        <div class="label">用户名</div>
        <el-input
          name="username"
          type="text"
          v-model="registerForm.username"
          autocomplete="on"
          placeholder="请输入用户名（账户）"
          class="input"
        />
      </el-form-item>
      <el-form-item prop="realname" class="item_wrap">
        <div class="label">真实姓名</div>
        <el-input
          name="realname"
          type="text"
          v-model="registerForm.realname"
          autocomplete="on"
          placeholder="请输入真实姓名"
          class="input"
        />
      </el-form-item>
      <el-form-item prop="password" class="item_wrap">
        <div class="label">密码</div>
        <el-input
          name="password"
          :type="pwdType"
          @keyup.enter.native="handleRegister"
          v-model="registerForm.password"
          autocomplete="on"
          placeholder="密码"
          class="input"
        ></el-input>
      </el-form-item>
      <el-form-item prop="passwordConfirm" class="item_wrap">
        <div class="label">确认密码</div>
        <el-input
          name="passwordConfirm"
          :type="pwdType"
          @keyup.enter.native="handleRegister"
          v-model="registerForm.passwordConfirm"
          autocomplete="on"
          placeholder="再次输入密码"
          class="input"
        ></el-input>
      </el-form-item>
      <el-form-item class="no_margin">
        <el-button
          type="primary"
          style="width:100%;"
          :loading="loading"
          @click.native.prevent="handleRegister"
          class="button"
        >注册</el-button>
      </el-form-item>
      <div class="bottom_wrap">
        <nuxt-link to="/login" class="register_btn">去登陆</nuxt-link>
      </div>
    </el-form>
  </div>
</template>

<script>
import { register } from '@/api/index'
import LoginBack from '@/components/LoginBack'
export default {
  name: 'register',
  head: {
    title: 'c-blog/注册'
  },
  data() {
    const validateUseraccount = (rule, value, callback) => {
      if (value.trim().length < 1) {
        callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      const reg = /^(\w){6,12}$/
      if (value.trim().length < 1) {
        callback(new Error('密码不能为空'))
      } else if (!reg.test(value)) {
        callback(new Error('只能输入6-12位的字母、数字、下划线'))
      } else {
        callback()
      }
    }
    const validatePassCon = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error('密码不一致'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        username: this.registerForm,
        realname: '',
        password: '',
        passwordConfirm: ''
      },
      registerRules: {
        username: [
          { required: true, trigger: 'change', validator: validateUseraccount }
        ],
        password: [{ required: true, trigger: 'change', validator: validatePass }],
        passwordConfirm: [{ required: true, trigger: 'blur', validator: validatePassCon }]
      },
      loading: false,
      pwdType: 'password'
    }
  },
  components: {
    LoginBack
  },
  methods: {
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.register()
        } else {
          return false
        }
      })
    },
    async register() {
      let param = {
        username: this.registerForm.username,
        realname: this.registerForm.realname,
        password: this.registerForm.password
      }
      this.loading = true
      let response = await register(param)
      this.loading = false
      if (response && response.errno === 0) {
        this.$refs.registerForm.resetFields()
        this.$message.success('注册成功')
      } else {
        this.$message.error(response.message)
      }
    }
  },
  mounted() {
  }
}
</script>
<style scoped lang="scss">
.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
  padding-top: 250px;
  box-sizing: border-box;
  background-image: url(" ../assets/img/login_back.jpg");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  .register-form {
    z-index: 99;
    display: flex;
    flex-direction: column;
    // align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 22px 30px 22px;
    width: 320px;
    // height: 230px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 5px;
    .input input {
      width: 300px;
      background: rgba(255, 255, 255, 0.5);
    }
    .no_margin {
      margin-bottom: 0;
    }
    .item_wrap {
      margin-bottom: 20px;
    }
    .label {
      line-height: 20px;
    }
    .bottom_wrap {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      margin-top: 5px;
      .register_btn {
        //  margin-bottom: 22px;
         color: #409EFF;
      }
    }
  }
}
</style>

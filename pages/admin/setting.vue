<!--  -->
<template>
  <div class='article_wrap'>
     <el-form class="form" :model="formData" :rules="rules" ref="form">
        <el-form-item prop="content" label="个人头像" class="logo_item item">
          <el-upload
            accept=".jpg, .png, .jpeg"
            class="logo-uploader"
            action="/api/blog/upload"
            name="image"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="formData.avatar" :src="formData.avatar" class="logo">
            <i v-else class="el-icon-plus logo-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item prop="username" class="item">
          <div class="label">用户名</div>
          <el-input
            :disabled="true"
            name="username"
            type="text"
            v-model="formData.username"
            autocomplete="on"
            placeholder="请输入用户名（账户）"
            class="input"
          />
        </el-form-item>
        <el-form-item prop="realname" class="item">
          <div class="label">真实姓名</div>
          <el-input
            name="realname"
            type="text"
            v-model="formData.realname"
            autocomplete="on"
            placeholder="请输入真实姓名"
            class="input"
          />
        </el-form-item>
        <el-form-item prop="password" class="item">
          <div class="label">密码</div>
          <el-input
            auto-complete="new-password"
            name="password"
            :type="pwdType"
            @keyup.enter.native="handleRegister"
            v-model="formData.password"
            autocomplete="on"
            placeholder="密码"
            class="input"
          ></el-input>
        </el-form-item>
        <el-form-item prop="passwordConfirm" class="item">
          <div class="label">确认密码</div>
          <el-input
            auto-complete="new-password"
            name="passwordConfirm"
            :type="pwdType"
            @keyup.enter.native="handleRegister"
            v-model="formData.passwordConfirm"
            autocomplete="on"
            placeholder="再次输入密码"
            class="input"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" :loading="isLoading">提交</el-button>
        </el-form-item>
     </el-form>
  </div>
</template>

<script>
import { updateUser } from '@/api/index'
import { mapState } from 'vuex'
import MyEditor from '@/components/MyEditor.vue'
export default {
  layout: 'adminLayout',
  components: {
    MyEditor
  },
  data() {
    const validateUseraccount = (rule, value, callback) => {
      if (!value || value.trim().length < 1) {
        callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      const reg = /^(\w){6,12}$/
      if (!value || value.trim().length < 1) {
        callback()
      } else if (!reg.test(value)) {
        callback(new Error('只能输入6-12位的字母、数字、下划线'))
      } else {
        callback()
      }
    }
    const validatePassCon = (rule, value, callback) => {
      console.log(value, this.formData.password)
      if (value !== this.formData.password) {
        callback(new Error('密码不一致'))
      } else {
        callback()
      }
    }
    return {
      pwdType: 'password',
      blog_id: null,
      formData: {
        username: '',
        realname: '',
        password: '',
        avatar: '',
        passwordConfirm: ''
      },
      originUsername: '',
      rules: {
        username: [
          { required: true, trigger: 'change', validator: validateUseraccount }
        ],
        password: [{ required: false, trigger: 'change', validator: validatePass }],
        passwordConfirm: [{ required: false, trigger: 'blur', validator: validatePassCon }]
      },
      isLoading: false
    }
  },
  computed: {
    ...mapState({
      userInfo: 'userInfo'
    }),
    infoChange() {
      return this.originUsername !== this.formData.username || this.formData.password
    },
    tips() {
      if (this.infoChange) {
        return '用户名和密码更改需重新登陆, 请确认是否继续?'
      } else {
        return '请确认是否更改信息?'
      }
    }
  },
  watch: {
    userInfo: {
      immediate: true,
      handler(val) {
        this.formData.username = val.username
        this.formData.realname = val.realname
        this.formData.avatar = val.avatar
        this.formData.id = val.id
        this.originUsername = val.username
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$confirm(this.tips, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.updateUser()
          }).catch(() => {
          })
        } else {
          return false
        }
      })
    },
    async updateUser() {
      let param = {
        username: this.formData.username,
        realname: this.formData.realname,
        password: this.formData.password,
        avatar: this.formData.avatar,
        id: this.formData.id
      }
      this.loading = true
      let response = await updateUser(param)
      this.loading = false
      if (response && response.errno === 0) {
        if (this.infoChange) {
          this.$store.dispatch('logout')
          this.$router.push('/login')
          this.$message.success('更改成功，请重新登陆')
        } else {
          this.$store.commit('setUser', response.data)
          this.$message.success('更改成功')
        }
      } else {
        this.$message.error(response.message)
      }
    },
    handleAvatarSuccess(res, file) {
      this.formData.avatar = res.data.url
    },
    beforeAvatarUpload(file) {
      const isImage = /(jpeg|png)$/.test(file.type)
      const isLt2M = file.size / 1024 / 1024 <= 3
      if (!isImage) {
        this.$message.error('上传头像图片只能是 JPG或PNG 格式!')
      } else if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 3MB!')
      }
      return isImage && isLt2M
    }
  }
}
</script>
<style lang='scss' scoped>
.article_wrap {
  padding: 30px;
  .form {
    .item {
      width: 400px;
    }
    .logo_item {
      display: flex;
      flex-direction: column;
      ::v-deep label {
        text-align: left;
      }
      ::v-deep .el-form-item__content {
        line-height: 0;
      }
    }
    .logo-uploader {
      ::v-deep .el-upload {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 150px;
        height: 150px;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        &:hover {
           border-color: #409EFF;
        }
        .logo-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 150px;
          height: 150px;
          line-height: 150px;
          text-align: center;
        }
      }
      .logo {
        max-width: 130px;
        max-height: 130px;
      }
    }
  }
}
</style>

<!--  -->
<template>
  <div class='article_wrap'>
     <el-form class="form" :model="formData" :rules="rules" ref="form">
        <el-form-item prop="title" label="标题" class="item is-need">
          <el-input v-model="formData.title" placeholder="请输入标题" maxlength="32"></el-input>
        </el-form-item>
        <el-form-item prop="description" label="描述" class="item">
          <el-input v-model="formData.description" placeholder="请输入描述" type="textarea" rows="3" maxlength="128"></el-input>
        </el-form-item>
        <el-form-item prop="content" label="标题图片" class="logo_item item">
          <el-upload
            accept=".jpg, .png, .jpeg"
            class="logo-uploader"
            action="/api/blog/upload"
            name="image"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="formData.logo" :src="formData.logo" class="logo">
            <i v-else class="el-icon-plus logo-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <div>
          <label class="label is-need">文章内容</label>
          <MyEditor v-model="formData.content"></MyEditor>
        </div>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" :disabled="!allowSubmit" :loading="isLoading">立即创建</el-button>
        </el-form-item>
     </el-form>
  </div>
</template>

<script>
import { createBlog } from '@/api/index'
import MyEditor from '@/components/MyEditor.vue'
export default {
  layout: 'adminLayout',
  components: {
    MyEditor
  },
  data() {
    return {
      rules: {},
      formData: {
        title: '',
        content: '',
        description: '',
        logo: ''
      },
      isLoading: false
    }
  },
  computed: {
    allowSubmit() {
      return this.formData.title.trim().length && this.formData.content.trim().length
    }
  },
  watch: {},
  methods: {
    async onSubmit() {
      this.isLoading = true
      let response = await createBlog(this.formData)
      this.isLoading = false
      if (!response.errno) {
        this.$message.success('创建成功')
        this.formData = {
          title: '',
          content: '',
          description: '',
          logo: ''
        }
      }
    },
    handleAvatarSuccess(res, file) {
      this.formData.logo = res.data.url
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
  },
  created() {

  },
  beforeMount() {}
}
</script>
<style lang='scss' scoped>
.article_wrap {
  padding: 30px;
  .form {
    .item {
      width: 700px;
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
        width: 200px;
        height: 200px;
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
          width: 200px;
          height: 200px;
          line-height: 200px;
          text-align: center;
        }
      }
      .logo {
        max-width: 180px;
        max-height: 180px;
      }
    }
  }
}
</style>

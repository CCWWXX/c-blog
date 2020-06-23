<!--  -->
<template>
  <div class='comment_wrap'>
    <el-divider>发表评论</el-divider>
    <div class="pu_wrap">
      <el-input
        @blur="blur"
        ref="textarea"
        type="textarea"
        :rows="6"
        maxlength="128"
        :placeholder="placeholder"
        v-model="comment">
      </el-input>
      <el-button type="primary" :disabled="!comment.length" class="button" @click="submit" :loading="loading">评论</el-button>
    </div>
    <singleComment v-for="item in commentList" :key="item.id" :commentData="item" @replyThis="replyThis"></singleComment>
  </div>
</template>

<script>
import { createComment, getComment } from '@/api/index'
import singleComment from '@/components/singleComment.vue'
export default {
  components: {
    singleComment
  },
  props: {
    articleId: Number
  },
  data() {
    return {
      placeholder: '请输入内容',
      parentId: null,
      loading: false,
      comment: '',
      commentList: [
        // {
        //   id: 1,
        //   comment_time: '2010-10-5 12:50:30',
        //   avatar: '',
        //   content: 'dasdas',
        //   author: 'xiaoming',
        //   children: [
        //     {
        //       id: 2,
        //       comment_time: '2010-10-5 12:50:30',
        //       avatar: '',
        //       content: 'dasdasdasdasasasa',
        //       author: 'xiaoming'
        //     },
        //     {
        //       id: 3,
        //       comment_time: '2010-10-5 12:50:30',
        //       avatar: '',
        //       content: 'dasdasdasdasasasa',
        //       author: 'xiaoming'
        //     }
        //   ]
        // }
      ]
    }
  },
  computed: {},
  watch: {},
  methods: {
    async submit() {
      this.loading = true
      const params = {
        article_id: this.articleId,
        content: this.comment,
        parent_id: this.parentId ? this.parentId : -1
      }
      let response = await createComment(params)
      this.loading = false
      if (response) {
        if (response.errno === -1 && response.message) {
          return this.$message.error(response.message)
        }
        // 完成回复之后需清除
        this.parentId = null
        this.comment = ''
        this.placeholder = '请输入内容'
        this.getComment()
        return this.$message.success('评论成功')
      }
    },
    blur() {
      // 失焦的时候没有内容重置为回复最顶级
      if (!this.comment) {
        this.parentId = null
        this.placeholder = '请输入内容'
      }
    },
    async getComment() {
      const params = {
        article_id: this.articleId
      }
      let response = await getComment(params)
      if (response.data) {
        this.handleData(response.data)
      }
    },
    handleData(list) {
      let parentList = list.filter(item => {
        return item.parent_id === -1
      })
      let childList = list.filter(item => {
        return item.parent_id !== -1
      })
      for (let val of parentList) {
        val.children = childList.filter(item => {
          return item.parent_id === val.id
        })
      }
      this.commentList = parentList
    },
    replyThis(commentData) {
      this.$refs.textarea.focus()
      this.placeholder = `正在回复${commentData.author}`
      if (commentData.parent_id !== -1) {
        this.parentId = commentData.parent_id
      } else {
        this.parentId = commentData.id
      }
    }
  },
  beforeMount() {
    this.getComment()
  }
}
</script>
<style lang='scss' scoped>
.comment_wrap {
  .el-divider__text {
    font-size: 16px;
  }
  .pu_wrap {
    .button {
      margin: 20px 0;
      margin-left: auto;
      display: block;
      width: 100px;
    }
  }
}
</style>

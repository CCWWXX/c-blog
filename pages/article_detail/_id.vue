<!--  -->
<template>
    <div class="detail_wrap">
      <div class="article_wrap">
        <div class='title'>{{ detail.title }}</div>
        <!--加上class ql-editor才能把缩进空格显示出来-->
        <div class='ql-snow ql-editor' v-html="detail.content"></div>
        <div class="bottom_wrap">
            <span class="icon">
              <i :class="detail.isStar? 'red':''" class="el-icon-star-off stars_icon" @click="starBlog"></i>
              <span class="text">{{ detail.stars }}</span>
            </span>
            <span class="icon">
              <i class="el-icon-chat-dot-round"></i>
              <span class="text">{{ detail.comments }}</span>
            </span>
            <span class="icon">
              <i class="el-icon-view"></i>
              <span class="text">{{ detail.views }}</span>
            </span>
        </div>
      </div>
      <comment v-if="isMount" :articleId="detail.id"></comment>
    </div>
</template>

<script>
import comment from '@/components/comment.vue'
import { mapState } from 'vuex'
import { getDetail, starBlog, checkStar } from '@/api/index'
export default {
  layout: 'mainLayout',
  components: {
    comment
  },
  async asyncData({params, redirect, store}) {
    let response = await getDetail({ id: params.id, newView: 1 })
    if (!response.data) {
      return redirect('/404')
    }
    return {
      detail: response.data
    }
  },
  data() {
    return {
      detail: {},
      isMount: false
    }
  },
  computed: {
    ...mapState({
      userInfo: 'userInfo'
    })
  },
  watch: {},
  methods: {
    async starBlog() {
      let response = await starBlog({ article_id: this.detail.id, status: this.detail.isStar ? 0 : 1 })
      if (!response.errno) {
        if (this.detail.isStar) {
          this.$message.success('已取消点赞')
        } else {
          this.$message.success('点赞成功')
        }
        this.getDetail(0, !this.detail.isStar)
      } else {
        this.$message.success('操作失败')
      }
    },
    async getDetail(newView = 0, isStar = false) {
      let response = await getDetail({ id: this.$route.params.id, newView: newView })
      if (!response.data) {
        return this.$router.push('/404')
      }
      this.detail = response.data
      this.detail.isStar = isStar
    },
    // 服务端渲染无法传递cookie，需cookie验证的需单独拿出来
    async checkStar() {
      let response = await checkStar({ article_id: this.detail.id })
      if (response.data) {
        this.$set(this.detail, 'isStar', !!response.data.isStar)
      }
    }
  },
  beforeMount() {
    this.checkStar()
  },
  mounted() {
    this.$nextTick(() => {
      // 里面用的插件需要mount之后才能使用
      // 异步获取数据渲染应该就不需要
      this.isMount = true
    })
  }
}
</script>
<style lang='scss' scoped>
.detail_wrap {
  margin: 0 auto;
  // width: calc(100% - 360px);
  width: 1000px;
  .article_wrap {
    margin-top: 30px;
    padding: 40px;
    .title {
      font-weight: 500;
      font-size: 25px;
      text-align: center;
      margin-bottom: 20px;
    }
    .content {
      // text-align: center;
    }
    .bottom_wrap {
      margin-top: 50px;
      text-align: right;
      color: #303133;
      .icon {
        margin-left: 10px;
        font-size: 18px;
        .text {
          font-size: 15px;
        }
        .stars_icon {
          cursor: pointer;
        }
        .red {
          color: #ef2208;
        }
      }
    }
  }
}
</style>

<!--  -->
<template>
  <div class='singleComment'>
    <div class="left">
        <el-avatar size="large" :src="defaultUrl"></el-avatar>
    </div>
    <div class="right">
      <div class="top">
        <span class="text">{{ commentData.author }}</span>
        <span class="date text">{{ $dayjs().from(commentData.comment_time) }}</span>
      </div>
      <div class="content">{{ commentData.content }}</div>
      <div class="reply" @click="replyThis">回复</div>
      <singleComment v-for="item in commentData.children" :key="item.id" :commentData="item" @replyThis="replyThis"></singleComment>
    </div>
  </div>
</template>

<script>
export default {
  name: 'singleComment',
  components: {},
  props: {
    commentData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      defaultUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    }
  },
  computed: {},
  watch: {},
  methods: {
    replyThis() {
      this.$emit('replyThis', this.commentData)
    }
  },
  created() {

  },
  mounted() {
  }
}
</script>
<style lang='scss' scoped>
.singleComment {
  display: flex;
  .left {
    .el-avatar {
      width: 35px;
      height: 35px;
    }
  }
  .right {
    margin-left: 10px;
    .top {
      font-size: 12px;
      color: #7d7d7d;
      .text {
        height: 18px;
        line-height: 18px;
      }
      .date {
        color: #c7c7c7;
      }
    }
    .content {
      font-size: 14px;
      margin-top: 10px;
    }
    .reply {
      cursor: pointer;
      margin-top: 10px;
      margin-bottom: 20px;
      font-size: 14px;
      color: #7c7c7c;
    }
  }
}
</style>

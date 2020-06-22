<template>
  <div class="index_wrap">
      <div class="card_wrap">
        <el-card shadow="hover" class="card" v-for="(item, index) in list" :key="index" @click.native="showDetail(item.id)">
            <div class="blog_card">
              <div class="img_wrap">
                <img :src="item.logo" class="img">
              </div>
              <div class="right_wrap">
                <div class="title">{{ item.title }}</div>
                <div class="content">{{ item.description }}</div>
                <div class="bottom_wrap">
                  <div class="left">
                      <el-avatar size="small" :src="item.author_avatar || defaultUrl"></el-avatar>
                      <span class="text">{{ item.author }}</span>
                      <span class="date text">{{ $dayjs().from(item.createtime) }}</span>
                  </div>
                  <div class="right">
                      <span class="icon">
                        <i :class="item.isStar? 'red':''" class="el-icon-star-off"></i>
                        <span class="text">{{ item.stars }}</span>
                      </span>
                      <span class="icon">
                        <i class="el-icon-chat-dot-round"></i>
                        <span class="text">{{ item.comments }}</span>
                      </span>
                      <span class="icon">
                        <i class="el-icon-view"></i>
                        <span class="text">{{ item.views }}</span>
                      </span>
                  </div>
                </div>
              </div>
            </div>
        </el-card>
    </div>
    <el-pagination
      @current-change="currentChange"
      v-if="total > pageSize"
      background
      :page-size="pageSize"
      :current-page="page"
      layout="prev, pager, next"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getList } from '@/api/index'
export default {
  name: 'index',
  layout: 'mainLayout',
  // async asyncData(context) {
  //   let response = await getList()
  //   if (response.data) {
  //     return {
  //       list: response.data
  //     }
  //   }
  // },
  data() {
    return {
      defaultUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      list: [],
      page: 1,
      pageSize: 10,
      total: 0
    }
  },
  head() {
    return {
      title: `c-blog`
    }
  },
  computed: {
    ...mapState({
      isLogin: 'isLogin'
    })
  },
  methods: {
    currentChange(page) {
      this.page = page
      this.getList()
    },
    showDetail(id) {
      window.open(`article_detail/${id}`)
    },
    async getList(params = {}, reset = false) {
      if (reset) {
        this.page = 1
      }
      params.page = this.page
      params.pageSize = this.pageSize
      this.$nuxt.$loading.start()
      let response = await getList(params)
      this.$nuxt.$loading.finish()
      if (response.data) {
        if (!response.data.listData.length) {
          this.$message.warning('找不到匹配数据')
        }
        this.list = response.data.listData
        this.total = response.data.total
      }
    }
  },
  destroyed() {
    this.$EventListener.$off('searchThis')
  },
  mounted() {
    this.$EventListener.$on('searchThis', searchData => {
      if (searchData) {
        this.getList({keyword: searchData}, true)
      } else {
        this.getList({}, true)
      }
    })
    // this.$nuxt.$loading需要等页面初始化之后
    this.$nextTick(() => {
      this.getList()
    })
  },
  watch: {
    isLogin: {
      handler() {
        this.getList()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.index_wrap {
 width: 100%;
 padding: 40px;
 box-sizing: border-box;
 .card_wrap {
  .card {
    cursor: pointer;
      margin: 0 auto;
      width: 800px;
      height: 210px;
      ::v-deep .el-card__body {
        height: 100%;
        box-sizing: border-box;
      }
      .blog_card {
        display: flex;
        height: 100%;
        box-sizing: border-box;
        .img_wrap {
          min-width: 284px;
          width: 284px;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          .img{
            max-width: 100%;
            max-height: 100%;
          }
        }
        .right_wrap {
          height: 100%;
          flex: 1;
          margin-left: 20px;
          position: relative;
          .title {
              color: #282828;
              font-size: 24px;
              font-weight: 500;
              margin-bottom: 10px;
          }
          .content {
              word-break: break-all;
              color: #7d7d7d;
              font-size: 16px;
              height: 83px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 4;
              overflow: hidden;
          }
          .bottom_wrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 25px;
            .left {
              display: flex;
              align-items: center;
              font-size: 12px;
              color: #7d7d7d;
              span {
                margin-left: 10px;
              }
              .text {
                height: 18px;
                line-height: 18px;
              }
              .date {
                color: #c7c7c7;
              }
            }
            .icon {
              margin-left: 10px;
              .text {
                font-size: 12px;
              }
              .red {
                color: #ef2208;
              }
            }
          }
        }
      }
      &:not(:last-child) {
        margin-bottom: 40px;
      }
  }
 }
}
</style>

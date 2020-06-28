<!--  -->
<template>
  <div class='manage_wrap'>
    <el-table :data="list" size="medium">
      <el-table-column label="博客标题" width="180" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建日期" width="220">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.createtime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" width="250" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span class="description">{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="180">
        <template slot-scope="scope">
          <div class="btn_wrap">
            <el-button
              size="medium"
              type="primary"
              @click="editThis(scope.row)">编辑</el-button>
            <el-button
              size="medium"
              type="danger"
              @click="deleteThis(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
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
import { getList, deleteBlog } from '@/api/index'
export default {
  layout: 'adminLayout',
  components: {},
  data() {
    return {
      list: [],
      page: 1,
      pageSize: 30,
      total: 0
    }
  },
  computed: {},
  watch: {},
  methods: {
    editThis(row) {
      this.$router.push({
        path: '/admin/blog',
        query: {
          blog_id: row.id
        }
      })
    },
    deleteThis(row) {
      this.$confirm('此操作将永久删除该博客, 请确认是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.$nuxt.$loading.start()
        let response = await deleteBlog({ id: row.id })
        this.$nuxt.$loading.finish()
        if (response && response.errno === 0) {
        // 如果当前页面只有一条则删除后重置返回第一页
          this.getList(this.list.length === 1)
          this.$message.success(response.message)
        } else {
          this.$message.error(response.message)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    currentChange(page) {
      this.page = page
      this.getList()
    },
    async getList(reset = false) {
      if (reset) {
        this.page = 1
      }
      const params = {
        page: this.page,
        pageSize: this.pageSize,
        keyword: this.searchData,
        isAdmin: 1
      }
      this.$nuxt.$loading.start()
      let response = await getList(params)
      this.$nuxt.$loading.finish()
      if (response.data) {
        if (!response.data.listData.length) {
          this.$message.warning('暂无数据')
        }
        this.list = response.data.listData
        this.total = response.data.total
      }
    }
  },
  created() {

  },
  mounted() {
    // this.$nuxt.$loading需要等页面初始化之后
    this.$nextTick(() => {
      this.getList()
    })
  }
}
</script>
<style lang='scss' scoped>
.manage_wrap {
  padding: 30px 0 30px 30px;
  flex-direction: column;
  max-width: 840px;
  .btn_wrap {
    display: flex;
  }
}
</style>

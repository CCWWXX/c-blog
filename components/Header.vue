<!--  -->
<template>
  <div div class='topBar'>
      <div class="right_wrap">
        <div class="search_wrap" v-if="isIndex">
          <el-input v-model="searchData" placeholder="请输入搜索内容" @keydown.native.enter="searchThis">
            <el-button slot="append" icon="el-icon-search" @click="searchThis"></el-button>
          </el-input>
        </div>
        <el-dropdown trigger="hover" @command="select" placement="bottom" v-if="isLogin">
          <span class="el-dropdown-link">
            <el-avatar size="large" :src="defaultUrl"></el-avatar>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              :class="item.path === currentPath &&　item.name !== '注销'? 'active drop_item' : 'drop_item'"
              :divided="item.name === '注销'"
              v-for="(item, index) in dropDownList"
              :key="index"
              :command="item.path"
            >
                <nuxt-link :to="item.path" v-if="item.name !== '注销'">{{item.name}}</nuxt-link>
                <div :to="item.path" v-else @click="logout">{{item.name}}</div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div v-else class="login_wrap">
          <nuxt-link to="/login" class="link_item">登陆</nuxt-link>
          <span class="line">&nbsp;/&nbsp;</span>
          <nuxt-link to="/register" class="link_item">注册</nuxt-link>
        </div>
    </div>
    <div class="left_wrap">
        <img src='../assets/img/logo.png' @click="intoHome">
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  components: {},
  data() {
    return {
      searchData: '',
      defaultUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      currentPath: '',
      dropDownList: [
        {
          name: '个人设置',
          id: '0',
          path: '/admin/setting'
        },
        {
          name: '系统管理',
          id: '1',
          path: '/admin/blog'
        },
        {
          name: '注销',
          id: '2',
          path: '/'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      isLogin: 'isLogin'
    }),
    isIndex() {
      return this.$route.fullPath === '/'
    }
  },
  watch: {},
  methods: {
    select(command) {
      this.currentPath = command
    },
    logout() {
      this.$store.dispatch('logout')
      if (/^\/admin/.test(this.$route.path)) {
        return this.$router.push('/')
      }
    },
    intoHome() {
      this.$router.push('/')
    },
    searchThis() {
      this.$EventListener.$emit('searchThis', this.searchData)
    }
  },
  beforeMount() {
    this.$store.dispatch('getUserInfo')
  }
}
</script>
<style lang='scss' scoped>
.drop_item:hover {
  a {
    color: #409eff !important;
  }

}
.active {
  a {
    color: #409eff !important;
  }
}
.el-dropdown-menu {
  a {
    width: 100%;
    height: 100%;
  }
}
.topBar {
  background: #fff;
  height: 66px;
  border-bottom: 1px solid #ededed;
  z-index: 99;
    .left_wrap {
      display: flex;
      align-items: center;
      height: 100%;
      img {
        cursor: pointer;
        max-width: 60px;
        max-height: 60px;
        vertical-align: middle;
        margin-left: 20px;
      }
    }
    .right_wrap {
      float: right;
      display: flex;
      height: 66px;
      align-items: center;
      padding-right: 40px;
      box-sizing: border-box;
      .search_wrap {
        height: 35px;
        margin-right: 20px;
        ::v-deep .el-input {
          height: 100%;
          input {
            height: 100%;
            line-height: 100%;
          }
          button {
            width: 40px;
            padding: 0;
            text-align: center;
          }
        }
      }
      .login_wrap {
        display: flex;
        align-items: center;
        height: 30px;
        .line {
          color: #9aabbd !important;
        }
        .link_item {
            line-height: 100%;
            color: #409eff !important;
            &:hover {
              color:#40b6ff !important;
            }
        }
      }
      i {
        font-size: 18px !important;
      }
      //去除element右键时蓝框
      :focus {
        outline: none;
      }
      .el-dropdown {
        cursor: pointer;
        .el-icon-arrow-down {
          font-size: 12px;
        }
      }
      .full_screen {
        margin-right: 20px;
        cursor: pointer;
      }
  }
}
</style>

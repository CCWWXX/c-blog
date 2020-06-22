<!--  -->
<template>
    <div class="menu_wrap">
       <el-menu
          :unique-opened="true"
          :default-active="activeMenu"
          class="menu"
          @open="handleOpen"
          @close="handleClose">
          <div v-for="items in menuList" :key="items.id">
            <el-submenu :index="items.id">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{ items.text }}</span>
              </template>
                <el-menu-item v-for="item in items.children" :key="item.id" :index="item.path">
                  <nuxt-link :to="item.path">{{item.text}}</nuxt-link>
                </el-menu-item>
            </el-submenu>
          </div>
        </el-menu>
    </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      activeMenu: '',
      menuList: [
        {
          text: '内容管理',
          id: '1',
          children: [
            {
              text: '创建/编辑文章',
              path: '/admin/article',
              id: '1-1'
            }
          ]
        }
      ]
    }
  },
  computed: {
  },
  watch: {
    $route: {
      immediate: true,
      handler(val) {
        this.activeMenu = val.fullPath
      }
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath)
    }
  },
  created() {

  },
  beforeMount() {
  }

}
</script>
<style lang='scss' scoped>
.menu_wrap {
  .menu {
    width: 256px;
    height: 100%;
    a {
      display: block;
      height: 100%;
      width: 100%;
    }
  }
}
</style>

<template>
  <div class="main_wrap" id="particles-js">
    <Header/>
    <nuxt/>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import particlesConfig from '@/assets/particles.json'

export default {
  components: {
    Header
  },
  mounted() {
    this.$nextTick(function () {
      window.particlesJS('particles-js', particlesConfig)
    })
  }
}
</script>

<style scoped lang="scss">
#particles-js {
    position: relative;
}
.main_wrap {
  min-width: $min-width;
  color: #282828;
}
</style>

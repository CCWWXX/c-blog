const cdnConfig = require('./cdn.json')
const env =
    process.env.NODE_ENV === 'production'
        ? require('./front-config.json').prod
        : require('./front-config.json').dev
module.exports = {
  // mode: 'spa',
  mode: 'universal', // 服务端渲染
  env,
  /*
  ** Headers of the page
  */
  head: {
    title: 'c-blog',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: cdnConfig.js
    // script: [
    //   { src: require('./utils/lodash.js'), type: 'text/javascript' }
    // ]
  },
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/style-resources'
  ],
  /*
  ** Global CSS
  */
  css: [
    '~assets/css/main.css',
    '~assets/style/common.scss',
    'element-ui/lib/theme-chalk/index.css',
    'quill/dist/quill.snow.css',
    'quill/dist/quill.bubble.css',
    'quill/dist/quill.core.css'
  ],
  /*
  ** Customize the progress-bar color
  */
  router: {
    middleware: ['auth']
  },
  styleResources: {
    scss: [
      '@/assets/vars/*.scss' // 自己项目中的样式文件的路径
    ]
  },
  plugins: [
    {
      src: '~plugins/ElementUI',
      ssr: true
    },
    {
      src: '~plugins/day',
      ssr: false
    },
    {
      src: '~plugins/lodash.js',
      ssr: false
    },
    {
      src: '~/plugins/vue-quill-editor',
      ssr: false
    },
    {
      src: '~/plugins/eventlistener',
      ssr: false
    }
  ],
  loading: { color: '#60aedd' },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** Run ESLINT on save
     */
    extend(config, ctx) {
      if (ctx.Client) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}

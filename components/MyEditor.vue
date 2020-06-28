
<template>
    <!-- <client-only placeholder="Loading..."> -->
      <div class="quill-editor"
          :content="content"
          @change="onEditorChange($event)"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @ready="onEditorReady($event)"
          v-quill:myQuillEditor="editorOption">
      </div>
    <!-- </client-only> -->
</template>

<script>
export default {
  model: {
    prop: 'value'
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.content = val
      }
    }
  },
  props: {
    value: null
  },
  data() {
    return {
      content: '',
      editorOption: {
        // // some quill options
        // modules: {
        //   toolbar: [
        //       ['bold', 'italic', 'underline', 'strike'],
        //       ['blockquote', 'code-block'],
        //       ['link', 'image'],
        //       [{ align: [] }] // 对齐方式
        //   ]
        // }
      }
    }
  },
  mounted() {
    // console.log('app init, my quill insrance object is:', this.myQuillEditor)
  },
  methods: {
    onEditorBlur(editor) {
      // console.log('editor blur!', editor)
    },
    onEditorFocus(editor) {
      // console.log('editor focus!', editor)
    },
    onEditorReady(editor) {
      // console.log('editor ready!', editor)
    },
    onEditorChange({ editor, html, text }) {
      // console.log('editor change!', editor, html, text)
      this.$emit('input', html)
    }
  },
  beforeMount() {
    const Quill = require('quill')
    const { container, ImageExtend, QuillWatch } = require('quill-image-extend-module')
    Quill.register('modules/ImageExtend', ImageExtend)
    // const inputFile = document.querySelector('.quill-image-input')
    // inputFile.setAttribute('accept', '.png,.jpg,.jpeg')
    this.editorOption = {
        // some quill options
      modules: {
        ImageExtend: {
            // 如果不作设置，即{}  则依然开启复制粘贴功能且以base64插入
          name: 'image', // 图片参数名
          size: 3, // 可选参数 图片大小，单位为M，1M = 1024kb
          action: '/api/blog/upload', // 服务器地址, 如果action为空，则采用base64插入图片
          response: res => {
            if (res.errno === -1 && res.message) {
              return this.$message.error(res.message)
            }
            return res.data.url
          },
          headers: xhr => {
              // xhr.setRequestHeader('myHeader','myValue')
          }, // 可选参数 设置请求头部
          sizeError: () => {
            this.$message.error('上传头像图片大小不能超过 3MB!')
          }, // 图片超过大小的回调
          start: () => {}, // 可选参数 自定义开始上传触发事件
          end: () => {}, // 可选参数 自定义上传结束触发的事件，无论成功或者失败
          error: () => {}, // 可选参数 上传失败触发的事件
          success: () => {}, // 可选参数  上传成功触发的事件
          change: (xhr, formData) => {} // 可选参数 每次选择图片触发，也可用来设置头部，但比headers多了一个参数，可设置formData
        },
        toolbar: {
          container: container,
          handlers: {
            image: function (value) {
                // 劫持原来的图片点击按钮事件
              QuillWatch.emit(this.quill.id)
            }
          }
        }
      },
      placeholder: '请输入正文'
    }
  }
}
</script>

<style lang="scss">
  .quill-editor {
    height:400px;
    margin-bottom: 22px;
  }
</style>

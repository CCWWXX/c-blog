import Vue from 'vue'

import VueQuillEditor from 'vue-quill-editor/dist/ssr'
import { Quill } from 'vue-quill-editor'
import { ImageExtend } from 'quill-image-extend-module'
Quill.register('modules/ImageExtend', ImageExtend)
Vue.use(VueQuillEditor)

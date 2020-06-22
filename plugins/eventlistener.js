import Vue from 'vue'
const listener = {}
const eventHub = new Vue()
const EventListener = {
/**
 * @param {any} event 第一个参数是事件对象，第二个参数是接收到消息信息，可以是任意类型
 * @method $on  事件订阅, 监听当前实例上的自定义事件。https://cn.vuejs.org/v2/api/#vm-on
 * @method $off  取消;事件订阅，移除自定义事件监听器。  https://cn.vuejs.org/v2/api/#vm-off  https://github.com/vuejs/vue/issues/3399
 * @method $emit  事件广播, 触发当前实例上的事件。 https://cn.vuejs.org/v2/api/#vm-emit
 * @method $once  事件订阅, 监听一个自定义事件，但是只触发一次，在第一次触发之后移除监听器。 https://cn.vuejs.org/v2/api/#vm-once
 */
  $on(...event) {
    eventHub.$on(...event)
  },
  $off(...event) {
    eventHub.$off(...event)
  },
  $once(...event) {
    eventHub.$once(...event)
  },
  $emit(...event) {
    eventHub.$emit(...event)
  }
}
listener.install = function (Vue) {
  const _EventListener = EventListener
  if (!Vue.prototype.hasOwnProperty('$EventListener')) {
    Object.defineProperty(Vue.prototype, '$EventListener', {
      get: function get() {
        return _EventListener
      }
    })
  }
}
Vue.use(listener)
export default EventListener

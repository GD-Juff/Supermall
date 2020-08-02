import Toast from './Toast'

const plugin = {}

plugin.install = function (Vue) {
  //创建组件构造器
  const toastConstrustor = Vue.extend(Toast)
  //创建组件
  const toast = new toastConstrustor()
  //将组件挂载
  toast.$mount(document.createElement('div'))
  //toast.$el对应的就是div
  document.body.appendChild(toast.$el)
  //
  Vue.prototype.$toast = toast

}

export default plugin




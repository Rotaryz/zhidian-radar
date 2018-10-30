import ToastComponent from 'components/toast/toast'
import LoadingComponent from 'components/loading/loading'
import LoginComponent from 'components/login/login'

const Toast = {}

// 注册Toast
Toast.install = function (Vue) {
  // 生成一个Vue的子类
  // 同时这个子类也就是组件
  const ToastConstructor = Vue.extend(ToastComponent)
  // 生成一个该子类的实例
  const instance = new ToastConstructor()

  // 将这个实例挂载在我创建的div上
  // 并将此div加入全局挂载点内部
  instance.$mount(document.createElement('div'))
  // instance.$el.setAttribute('ref', 'toast')
  document.body.appendChild(instance.$el)
  // 通过Vue的原型注册一个方法
  Vue.prototype.$toast = instance
}

const Loading = {}

Loading.install = function (Vue) {
  const LoadingConstructor = Vue.extend(LoadingComponent)
  const instance = new LoadingConstructor()
  instance.$mount(document.createElement('div'))
  document.body.appendChild(instance.$el)
  Vue.prototype.$loading = instance
}

const Login = {}

Login.install = function (Vue) {
  const LoadingConstructor = Vue.extend(LoginComponent)
  const instance = new LoadingConstructor()
  instance.$mount(document.createElement('div'))
  document.body.appendChild(instance.$el)
  Vue.prototype.$login = instance
}

export default {
  Toast,
  Loading,
  Login
}

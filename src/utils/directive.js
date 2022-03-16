import Vue from 'vue'
Vue.directive('clickoutside', {
  // 初始化指令
  bind (el, binding, vnode) {
    function documentHandler (e) {
      // 判断点击的元素是否是本身，本身则返回
      if (el.contains(e.target)) {
        return false
      }
      // 判断指令中是否绑定了函数
      if (binding.expression) {
        // 如果绑定了函数，就调用那个函数，此处bindind.value 就是handleClose方法
        binding.value(e)
      }
    }
    // 给当前元素绑定个私有变量，方便再unbind中可以解除事件监听
    el._vueClickOutside__ = documentHandler
    document.addEventListener('click', documentHandler)
  },
  update () {},
  unbind (el, binding) {
    // 解除事件监听
    document.removeEventListener('click', el.__vueClickOutside__)
    delete el.__vueClickOutside__
  }
})

Vue.directive('focus', {
  // bind表示这个自定义指令已绑定到dom上，就开始自动执行
  bind (el, binding) {
    console.log('bind')
  },
  // 表示dom插入到页面上的时候自动执行
  // 这些函数都有两个参数，一个是是el
  inserted (el, binding) {
    console.log('inserted')
    console.log(binding)
    el.focus()
  },
  // 表示自定义指令后面的值更新的时候，自动执行
  update () {
    console.log('update')
  }
})

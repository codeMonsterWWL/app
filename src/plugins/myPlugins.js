//vue的插件一定是暴露一个对象
//对象一定有install方法
let myPlugins = {}


myPlugins.install = function (Vue, options) {
  //vue这个参数是自动帮我们注入的，options是Vue.use(myPlugins,{...})时我们自己传入的配置对象
  //有了Vue，我们就可以干很多事情了，Vue.prototype.$bus、Vue.directive、Vue.component、Vue.filter等等...
  //来个变大写的自定义指令
  Vue.directive('upper', (element, binding) => {
    element.innerHTML = binding.value.toUpperCase()
  });

}

export default myPlugins
import Vue from 'vue'
import App from '@/App.vue'

//三级联动组件 ---注册为全局组件
import TypeNav from '@/components/TypeNav'
//引入轮播图组件，注册为全局组件
import Carousel from '@/components/Carousel'
//引入分页器组件，注册为全局组件
import Pagination from '@/components/Pagination'

//引入仓库
import store from '@/store'

// 引入路由
import router from '@/router'

// //测试
// import {reqCategoryList} from '@/api'
// reqCategoryList()

//注册全局组件
Vue.component(TypeNav.name, TypeNav)
Vue.component(Carousel.name, Carousel)
Vue.component(Pagination.name, Pagination)

//引入并注册全局组件
import { Button, MessageBox } from 'element-ui'
Vue.component(Button.name,Button)
//elementUI注册组件的时候，还有一种写法：挂在原型上
// Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;

//引入mockServer.js
import '@/mock/mockServer'

//引入swiper样式
import 'swiper/css/swiper.css'

//统一接收api文件夹暴露的所有的接口（函数）
//统一引入
import * as API from '@/api'
// console.log(API)

//引入懒加载的插件
import VueLazyload from 'vue-lazyload'
//引入懒加载的默认图片
const loadimage = require('@/assets/wwl.gif')
//use的同时可以传配置对象
Vue.use(VueLazyload, {
  //懒加载默认的图片
  loading: loadimage,
})

//引入自定义插件
import myPlugins from '@/plugins/myPlugins'
//安装插件，只要这里一use，就会调用插件的install方法！
Vue.use(myPlugins)

//引入表单校验插件vee-validate
import '@/plugins/validate'  //就引入一下，让代码执行即可

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  //全局事件总线$bus的配置
  beforeCreate() {
    Vue.prototype.$bus = this
    Vue.prototype.$API = API//将API放到vue原型里，这样一来所有的组件身上都有这个$API了
  },
  //注册路由：kv一致省略v，注册后组件身上都拥有$router,$route属性
  router,
  //注册仓库，组件实例的身上会多了$store属性
  store
}).$mount('#app')

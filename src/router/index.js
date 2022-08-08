import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import routes from '@/router/routes'
import store from '@/store'

//先把VueRouter原型对象的push和replace先保存一份
let originPush = VueRouter.prototype.push
let originReplace = VueRouter.prototype.replace

//重写push和replace
//第一个参数：告诉原来的push方法，你往哪里跳，
//第二个参数：成功的回调
//第三个参数：失败的回调
//call和apply：
// 相同点：都可以调用和函数一次，都可以篡改函数上下文
// 不同点：call与apply传递参数，call传递参数用逗号隔开，apply方法执行，传递数组
VueRouter.prototype.push = function (location, resolve, reject) {
  if (resolve && reject) {
    originPush.call(this, location, resolve, reject)
  } else {
    originPush.call(this, location, () => { }, () => { })
  }
}
VueRouter.prototype.replace = function (location, resolve, reject) {
  if (resolve && reject) {
    originReplace.call(this, location, resolve, reject)
  } else {
    originReplace.call(this, location, () => { }, () => { })
  }
}


const router = new VueRouter({
  routes,//kv一致省略v，
  //滚动行为，返回的y为0，代表滚动条在最上方（不写这的话，有个bug，点击图片跳到详情页后，默认老是显示最下面，这显然不合理）
  scrollBehavior(to, from, savedPosition) {
    return { y: 0 }
  }
})

//在这里就可以全局前置守卫了(在路由跳转之前进行判断，是能跳还是不能跳)
router.beforeEach(async (to, from, next) => {
  //to:可以获取目的地  from:可以获取到你从哪里来  
  // console.log('to',to)
  // console.log('from',from)
  //next：放行
  // console.log('next',next)
  //写法不止一种
  //next()//调用next 放行
  //next('/login')//放行到指定目的地
  //next(false)
  // console.log(store.state.user.token)
  //用户登录了 才会用token  未登录不会有token
  let token = store.state.user.token
  let name = store.state.user.userInfo.name
  // console.log(name)
  if (token) {
    //用户已经登录了，还想去login，则休想,就强制把用户留在home页
    if (to.path == '/login' || to.path == "/register") {
      next('/home')
      // console.log('登录了，还想去login|register')
    } else {
      //登录了,但是去的不是login | register
      //登录了并有用户信息：放行
      if (name) {
        next()
        // console.log('登录了，有用户信息，去的不是login|register')
      } else {
        //登录了，但是没有用户信息，在路由跳转之前获取用户信息，然后放行(每次刷新页面都会执行这个)
        try {
          await store.dispatch('getUserInfo')
          next()
          // console.log('登录了，没有用户信息，在路由跳转之前获取用户信息')
        } catch (error) {
          //token失效，重新登录
          await store.dispatch('userLogout')
          next('/login')
          console.log('token失效重新登录')
        }
      }
    }
  } else {
    //未登录:不能去交易相关的界面[trade]、支付相关的【pay、paysuccess】、个人中心[center,center/myorder,center/grouporder]    
    if(to.meta.unLoginCanTo === false){
      //把未登录时想去而未去成的页面的地址存放在地址栏中（路由中）,比如未登录时想去【我的订单】，然后跳到了login，登录后应该直接跳到【我的订单】，这样才合理
      next('/login?redirect='+to.path)//这个to.path就是想去但未去成的地方
    }else{
      next()
    }
  }
})


export default router
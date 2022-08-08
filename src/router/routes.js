//配置路由信息
// import Home from '@/pages/Home'
// import Login from '@/pages/Login'
// import Search from '@/pages/Search'
// import Register from '@/pages/Register'
// import Detail from '@/pages/Detail'
// import AddCartSuccess from '@/pages/AddCartSuccess'
// import ShopCart from '@/pages/ShopCart'
// import Trade from '@/pages/Trade'
// import Pay from '@/pages/Pay'
// import PaySuccess from '@/pages/PaySuccess'
// import Center from '@/pages/Center'
// //引入二级路由组建
// import MyOrder from '@/pages/Center/myOrder'
// import GroupOrder from '@/pages/Center/groupOrder'

/*
当打包构建应用时，JavaScript 包会变得非常大，
影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就会更加高效。
*/

//最复杂的写法
// const home = () => {
//   console.log('访问home组件时，才会调用这个函数')
//   return import('@/pages/Home')
// }
//简化了的写法
// const home = () =>  import('@/pages/Home')
//还可以再简化，直接把箭头函数写在路由配置信息里面去

//配置路由信息
export default [
  {
    path: '/home',
    component: () => import('@/pages/Home'),
    meta: { show: true }//meta是一个配置对象，key只能是meta，不能瞎写
  },
  {
    path: '/pay',
    component: () => import('@/pages/Pay'),
    meta: { show: true, unLoginCanTo: false },
    beforeEnter: (to, from, next) => {
      //必须是从trade到pay
      if (from.path == '/trade') {
        next()
      } else {
        next(false)
      }
    }
  },
  {
    path: '/center',
    component: () => import('@/pages/Center'),
    meta: { show: true, unLoginCanTo: false },
    //二级路由组件
    children: [
      {
        path: 'myorder',//二级路由不能写/，/代表根路由
        component: () => import('@/pages/Center/myOrder'),
        meta: { unLoginCanTo: false }
      },
      {
        path: 'grouporder',
        component: () => import('@/pages/Center/groupOrder'),
        meta: { unLoginCanTo: false }
      },
      {//重定向
        path: '/center',
        redirect: '/center/myorder'
      }
    ]
  },
  {
    path: '/paysuccess',
    component: () => import('@/pages/PaySuccess'),
    meta: { show: true, unLoginCanTo: false }
  },
  {
    path: '/addcartsuccess',
    component: () => import('@/pages/AddCartSuccess'),
    meta: { show: true }
  },
  {
    path: '/trade',
    component: () => import('@/pages/Trade'),
    meta: { show: true, unLoginCanTo: false },
    //路由独享守卫
    beforeEnter: (to, from, next) => {
      //必须是从购物车页面才能跳到trade页面
      if (from.path == '/shopcart') {
        next()
      } else {
        //从其他的路由组件来，就停留在当前，说白了，从哪来回哪去
        next(false)//写成next(from/path)也行  还停留在你之前的位置
      }
    }
  },
  {
    path: '/shopcart',
    component: () => import('@/pages/ShopCart'),
    meta: { show: true }
  },
  {
    path: '/detail/:skuid',
    component: () => import('@/pages/Detail'),
    meta: { show: true },
  },
  {
    path: '/login',
    component: () => import('@/pages/Login')
  },
  {
    path: '/search/:keyword?',
    name: 'search',
    component: () => import('@/pages/Search'),
    meta: { show: true },
    // 路由组件能不能传递props数据？
    //props配置项的作用，让路由更加方便的接收的参数，就不用一直$route.params.keyword，用props接收到参数后，直接keyword就完事
    //1.布尔值写法：
    // props: true
    //2.对象写法：额外给路由组件传递一些props
    // props: { a: 1, b: 2 }
    //3.函数写法（最最常用！！！）:可以把params参数、query参数，通过props传递给路由组件
    props: ($route) => {
      return { keyword: $route.params.keyword, k: $route.query.k }
    }
  },
  {
    path: '/register',
    component: () => import('@/pages/Register')
  },
  //重定向，在项目跑起来的时候，访问‘/’的时候，立马定向到首页（home页）,不然一打开项目，初始路径为‘/’，匹配不到任何的页面，不行啊
  {
    path: '/',
    redirect: 'home'
  },

]
<template>
  <div>
    <!-- <h1 v-upper='msg'></h1>  测试自定义插件中的自定义指令 -->
    <!-- <button @click="show">输出$route</button>  --> <!-- $route是此时<router-view></router-view>里展示的路由 -->
    <Header />
    <router-view></router-view>
    <!-- 在Home、Search显示，在登录、注册不显示 -->
    <!-- <Footer v-show="$route.path=='/home' || $route.path=='/search'"/> 这个方法太写起来太麻烦，用路由元信息-->
    <Footer v-show="$route.meta.show"/>
    
  </div>
</template>

<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'
export default {
  name:'',
  data() {
    return {
      msg:'qwer'
    }
  },
  components:{
    Header,
    Footer
  },
  // methods: {  //$route是此时<router-view></router-view>里展示的路由
  //   show(){
  //     console.log(this.$route)
  //   }
  // },
  mounted(){
    //性能优化，app只挂载一次，挂载完了就把数据保存到store中了，性能好
    //只派发一个action，获取商品分类的三级列表的数据
     this.$store.dispatch("categoryList");
  }
}
</script>

<style>

</style>
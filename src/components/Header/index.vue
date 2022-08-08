<template>
  <header class="header">
    <!-- 头部的第一行 -->
    <div class="top">
      <div class="container">
        <div class="loginList">
          <p>尚品汇欢迎您！</p>
          <!-- 没有用户名，未登录，显示请登录 -->
          <p v-if="!userName">
            <span>请</span>
            <router-link to="/login">登录</router-link>
            <router-link to="/register" class="register">免费注册</router-link>
          </p>
          <p v-if="userName">
            <a>{{ userName }}</a>
            <a class="register" @click="logout">退出登录 </a>
          </p>
        </div>
        <div class="typeList">
          <router-link to="/center/myorder">我的订单</router-link>
          <router-link to="/shopcart">我的购物车</router-link>
          <a href="###">我的尚品汇</a>
          <a href="###">尚品汇会员</a>
          <a href="###">企业采购</a>
          <a href="###">关注尚品汇</a>
          <a href="###">合作招商</a>
          <a href="###">商家后台</a>
        </div>
      </div>
    </div>
    <!--头部第二行 搜索区域-->
    <div class="bottom">
      <h1 class="logoArea">
        <router-link class="logo" to="/home">
          <img src="./images/logo.png" alt="" />
        </router-link>
      </h1>
      <div class="searchArea">
        <form action="###" class="searchForm">
          <input
            type="text"
            id="autocomplete"
            class="input-error input-xxlarge"
            v-model="keyword"
          />
          <button
            class="sui-btn btn-xlarge btn-danger"
            type="button"
            @click="goSearch"
          >
            搜索
          </button>
        </form>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      keyword: "",
    };
  },
  mounted() {
    //通过全局事件总线清除keyword
    this.$bus.$on("clearKeyword", () => {
      this.keyword = "";
    });
  },
  methods: {
    //搜索按钮的回调函数，向Search跳转,因为这个跳转不是的跳转，不和从home到登录/注册似的单纯的跳转，所以这个跳转用编程式路由导航
    goSearch() {
      //路由传递参数，搜索，得把用户输入的关键词传给Search组件啊，谁接收参数，就得在这个路由的配置的地方声明
      //第一种：字符串形式
      // this.$router.push("/search/" + this.keyword + "?k=" +this.keyword.toUpperCase());
      //第二种：模板字符串
      // this.$router.push(`/search/${this.keyword}?k=${this.keyword.toUpperCase()}`)
      //第三种：对象写法，前两种在实际项目中都不用，哈哈哈哈，麻烦死了
      // this.$router.push({
      //   name:'search',
      //   params:{keyword:this.keyword},
      //   query:{k:this.keyword}
      // })
      /*-----------------------------------------------------------------*/
      //面试题1：路由传参（对象写法）path能否和params参数一起使用？
      //答：路由跳转传参时，对象的写法可是是name、path形式，但是需要注意的是，path这种写法不能与params参数一起使用
      // this.$router.push({
      //   path:'/search',
      //   params:{keyword:this.keyword},
      //   query:{k:this.keyword}
      // })

      //面试题2:如何指定params参数可传可不传？
      //比如：配置路由时，params参数已经占位了，但是路由跳转的时候就不传递params参数,此时url会出问题
      //答：在配置路由的时候在占位的后面加上一个问好
      //  this.$router.push({
      //   name:'search',
      //   query:{k:this.keyword}
      // })

      //面试题3：问号写上了，params参数可以传递也可以不传递了，但是如果传递的是空串，如何解决？
      //答：使用undefined解决
      // this.$router.push({
      //   name: "search",
      //   params:{keyword:'' || undefined},
      //   query: { k: this.keyword },
      // });

      //面试题4：路由组件能不能传递props数据？
      //答：可以的 ，三种写法

      //如果有query参数，也带过去
      if (this.$route.query) {
        let location = {
          name: "search",
          params: { keyword: this.keyword || undefined },
        };
        location.query = this.$route.query;
        this.$router.push(location);
      }
    },
    //退出登录
    //1.需要发请求，通知服务器退出登录（清除一些数据：token）
    //2.清除项目中的数据（userInfo、token）
    async logout() {
      try {
        await this.$store.dispatch("userLogout");
        //退出成功，回到首页
        this.$router.push('/home')
      } catch (error) {
        alert(error.message)
      }
    },
  },
  beforeDestroy() {
    this.$bus.$off("clearKeyword");
  },
  computed: {
    //用户名信息，计算出来，上边写v-if简洁点
    userName() {
      return this.$store.state.user.userInfo.name;
    },
  },
};
</script>

<style lang='less' scoped>
.header {
  & > .top {
    background-color: #eaeaea;
    height: 30px;
    line-height: 30px;

    .container {
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;

      .loginList {
        float: left;

        p {
          float: left;
          margin-right: 10px;

          .register {
            border-left: 1px solid #b3aeae;
            padding: 0 5px;
            margin-left: 5px;
          }
        }
      }

      .typeList {
        float: right;

        a {
          padding: 0 10px;

          & + a {
            border-left: 1px solid #b3aeae;
          }
        }
      }
    }
  }

  & > .bottom {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;

    .logoArea {
      float: left;

      .logo {
        img {
          width: 175px;
          margin: 25px 45px;
        }
      }
    }

    .searchArea {
      float: right;
      margin-top: 35px;

      .searchForm {
        overflow: hidden;

        input {
          box-sizing: border-box;
          width: 490px;
          height: 32px;
          padding: 0px 4px;
          border: 2px solid #ea4a36;
          float: left;

          &:focus {
            outline: none;
          }
        }

        button {
          height: 32px;
          width: 68px;
          background-color: #ea4a36;
          border: none;
          color: #fff;
          float: left;
          cursor: pointer;

          &:focus {
            outline: none;
          }
        }
      }
    }
  }
}
</style>
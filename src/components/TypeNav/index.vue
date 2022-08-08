<template>
  <div class="type-nav">
    <div class="container">
      <div @mouseleave="leaveShow" @mouseenter="enterShow">
        <h2 class="all">全部商品分类</h2>
        <!-- 三级联动  -->
        <!-- 过渡动画 ,必须包一个transition标签-->
        <transition name="sort">
          <div class="sort" v-show="show">
            <!-- 利用事件的委派+编程式导航实现路由的跳转与传递参数 -->
            <div class="all-sort-list2" @click="goSearch">
              <!-- 一级分类 -->
              <div
                class="item"
                v-for="(c1, index) in categoryList"
                :key="c1.categoryId"
                :class="{ cur: currentIndex == index }"
              >
                <h3 @mouseenter="changeIndex(index)">
                  <a
                    :data-categoryName="c1.categoryName"
                    :data-category1ID="c1.categoryId"
                    >{{ c1.categoryName }}</a
                  >
                </h3>
                <!-- 二级、三级分类 -->
                <div
                  class="item-list clearfix"
                  :style="{ display: currentIndex == index ? 'block' : 'none' }"
                >
                  <div
                    class="subitem"
                    v-for="c2 in c1.categoryChild"
                    :key="c2.categoryId"
                  >
                    <dl class="fore">
                      <dt>
                        <a
                          :data-categoryName="c2.categoryName"
                          :data-category2ID="c2.categoryId"
                          >{{ c2.categoryName }}</a
                        >
                      </dt>
                      <dd>
                        <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                          <a
                            :data-categoryName="c3.categoryName"
                            :data-category3ID="c3.categoryId"
                            >{{ c3.categoryName }}</a
                          >
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
//  引入lodash，这个写法是把lodash全部的功能都引入，lodash的功能有很多，数组去重、找最大值。。。。。
// import _ from "lodash"
import throttle from "lodash/throttle.js"; //应该按需引入

export default {
  name: "TypeNav",
  data() {
    return {
      //存储用户鼠标移上哪一个一级分类
      currentIndex: -1,
      show: true,
    };
  },
  //组件挂载完毕，可以向服务器发送请求
  mounted() {
    //通知vuex发送请求，获取数据，存储到仓库当中
    //把派发action的动作放到app里面了
    //需求:TypeNav在search页面默认是不显示的,鼠标放上去才显示,所以当组件在search页面挂载完毕时,让show变为false
    if (this.$route.path != "/home") {
      this.show = false;
    }
  },
  computed: {
    ...mapState({
      //当使用这个计算属性时，右侧函数会立即执行一次
      //注入一个参数state，其实为大仓库中的数据
      categoryList: (state) => state.home.categoryList.slice(0, 16),
    }),
  },
  methods: {
    //鼠标进入修改响应式数据currentIndex属性
    //throttle回调函数别用箭头函数，可能会出现上下问this指向问题
    changeIndex: throttle(function (index) {
      //鼠标所在的一级分类的索引值
      this.currentIndex = index;
    }, 50),
    goSearch(event) {
      //最好的方案是编程式导航+事件委派
      //存在的一些问题:事件委派是把全部的子节点(h3,dt,dl,em...)的事件委派位父节点,
      //我们要的是点击a标签才会进行路由跳转, 怎么确定点击的一定是a标签呢?
      //存在的另外一个问题,即使你能确定点击的是a标签,如何区分是一二三级呢

      //第一个问题: 把子节点当中的a标签,加上自定义属性data-categoryName,其余子节点是没有的
      let element = event.target;
      //获取到当前触发这个事情的节点,需要带有data-categoryName这样的节点一定是a标签
      //节点有一个属性dataset,可以获取到节点的自定义属性和属性值
      let { categoryname, category1id, category2id, category3id } =
        element.dataset; //把categorname解构出来,注意我们写的是大写，但是浏览器自动给我们变为小写，这里千万注意
      //如果标签的身上拥有categoryname,则一定是a标签
      if (categoryname) {
        //整理路由跳转的参数
        //要去的地方都是search，固定的，直接写死
        let location = { name: "search" };
        //categoryName这个参数是唯一的，因为不管是一级二级三级分类，每个分类的名字都不一样，直接写
        let query = { categoryName: categoryname };
        //categoryId可就不一样了，一级二级三级这三个分类的第一个标签的id都是1，得动态的区别，所以动态添加
        if (category1id) {
          query.category1Id = category1id;
        } else if (category2id) {
          query.category2Id = category2id;
        } else if (category3id) {
          query.category3Id = category3id;
        }
        //如果有params参数，也带过去
        if (this.$route.params) {
          location.params = this.$route.params
          //整理完参数(此时location和query是两个对象,需要合在一起)
          location.query = query;
          // console.log(location)  此时location是完整的,要跳转的目的地+要携带的参数
          this.$router.push(location);
        }
      }
    },
    //当鼠标移入的时候,展示商品分类列表
    enterShow() {
      if (this.$route.path != "/home") {
        this.show = true;
      }
    },
    leaveShow() {
      this.currentIndex = -1; //鼠标一移除,取消  高亮效果
      //当鼠标移出的时候,商品分类列表隐藏
      if (this.$route.path != "/home") {
        this.show = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }

          // &:hover {
          //   .item-list {
          //     display: block;
          //   }
          // }
        }
        // .item:hover{
        //   background-color: skyblue;
        // }
        .cur {
          background-color: skyblue;
        }
      }
    }
    //过渡动画样式
    //过渡动画开始状态(进入)
    .sort-enter {
      height: 0px;
    }
    //过渡动画结束状态(进入)
    .sort-enter-to {
      height: 461px;
    }
    //定义动画时间,速率
    .sort-enter-active {
      transition: all 0.2s linear;
    }
  }
}
</style>
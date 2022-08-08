<template>
  <div>
    <!-- 商品分类三级列表 -->
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread：面包屑，带有x的结构的小标签-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 分类的面包屑 -->
            <li class="with-x" v-show="searchParams.categoryName">
              {{ searchParams.categoryName
              }}<i @click="removeCategoryName">×</i>
            </li>
            <!-- 关键字的面包屑 -->
            <li class="with-x" v-show="searchParams.keyword">
              {{ searchParams.keyword }}<i @click="removeKeyword">×</i>
            </li>
            <!-- 点击红色字体（品牌名字）的面包屑 -->
            <li class="with-x" v-show="searchParams.trademark">
              {{ searchParams.trademark.split(":")[1]
              }}<i @click="removeTrademark">×</i>
            </li>
            <!-- 平台售卖属性的面包屑 -->
            <!-- props数组里有几个元素，就展示几个面包屑 -->
            <li
              class="with-x"
              v-for="(attrValue, index) in searchParams.props"
              :key="index"
            >
              {{ attrValue.split(":")[1] }}<i @click="removeAttr(index)">×</i>
            </li>
          </ul>
        </div>

        <!--selector-->
        <SearchSelector />

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <!-- 排序结构 -->
              <ul class="sui-nav">
                <!-- <li :class="{active:searchParams.order.includes('1')}"> 这么写有点不好，封装为计算属性 -->
                <li :class="{ active: isOne }" @click="changeOrder('1')">
                  <a
                    >综合<span v-show="isOne"
                      ><span v-show="isAsc">↑</span
                      ><span v-show="isDesc">↓</span></span
                    ></a
                  >
                </li>
                <li :class="{ active: isTwo }" @click="changeOrder('2')">
                  <a
                    >价格<span v-show="isTwo"
                      ><span v-show="isAsc">↑</span
                      ><span v-show="isDesc">↓</span></span
                    ></a
                  >
                </li>
              </ul>
            </div>
          </div>
          <!-- 销售产品列表 -->
          <div class="goods-list">
            <ul class="yui3-g">
              <li
                class="yui3-u-1-5"
                v-for="(goods, index) in goodsList"
                :key="goods.id"
              >
                <div class="list-wrap">
                  <div class="p-img">
                    <!-- 在路由跳转的时候切记别忘记带上点击图片的id -->
                    <router-link :to="`/detail/${goods.id}`">
                      <img v-lazy="goods.defaultImg" />
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥ </em>
                      <i>{{ goods.price }}</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a
                      target="_blank"
                      href="item.html"
                      title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】"
                      >{{ goods.title }}</a
                    >
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页器 -->
          <Pagination
            :pageNo="searchParams.pageNo"
            :pageSize="searchParams.pageSize"
            :total="total"
            :continues="5"
            @getPageNo="getPageNo"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import SearchSelector from "./SearchSelector/SearchSelector";
export default {
  name: "Search",
  components: {
    SearchSelector,
  },
  data() {
    return {
      //带给服务器的参数
      searchParams: {
        //一级分类的id
        category1Id: "",
        //二级分类的id
        category2Id: "",
        //三级分类的id
        category3Id: "",
        //分类的名字
        categoryName: "",
        //搜索框里用户输入的关键字
        keyword: "",
        //排序：初始值是综合降序
        order: "1:desc",
        //分页器的参数：代表当前是第几页
        pageNo: 1,
        //代表每一页展示数据的个数
        pageSize: 5,
        //平台售卖属性操作带的参数
        props: [],
        //品牌
        trademark: "",
      },
    };
  },
  //当组件挂载完毕之前执行一次，先于mounted，说白了就是在发请求之前把参数整理好，然后带着参数去向服务器获取对应的数据
  beforeMount() {
    //将用户在 home页点击的商品分类的类名和id  与  在搜索框输入的keyword  的值 赋值给searchParams对应同名的属性
    Object.assign(this.searchParams, this.$route.query, this.$route.params);
    // console.log(this.searchParams)
    // console.log(this.$route)
  },
  //组件挂载完毕，mounted只执行一次，
  mounted() {
    //在发请求之前带给服务器参数，（searchParams 参数发生变化，有数值带给服务器）
    this.getData();
    //通过全局事件总线接收到子组件传过来的点击的品牌的信息
    this.$bus.$on("trademarkInfo", (trademark) => {
      // console.log("我是父组件，我接受到了", trademark);
      //整理品牌字段的参数   格式：  品牌: "ID:品牌名称"
      this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`;
      // console.log(this.searchParams);
      //整理好参数了，就发请求呗
      this.getData();
    });
    //收集平台属性
    this.$bus.$on("attrInfo", (attr, attrValue) => {
      // console.log("父组件收到了",attr,attrValue)
      //按照api文档的参数格式整理，注意看props这个参数的格式是数组里面抱着一个字符串
      let info = `${attr.attrId}:${attrValue}:${attr.attrName}`;
      //数组去重
      if (!this.searchParams.props.includes(info)) {
        //props中没有info，再push进去，有的话，就不push了
        this.searchParams.props.push(info);
        //再次发请求
        this.getData();
      }
    });
  },
  computed: {
    //mapGetters里面的写法传递是数组，因为getters是没有划分模块的（state是划分了模块的，划分为home和search）
    ...mapGetters(["goodsList"]),
    //获取search模块展示产品一共多少条数据
    ...mapState({
      total: (state) => state.search.searchList.total,
    }),
    isOne() {
      return this.searchParams.order.includes("1");
    },
    isTwo() {
      return this.searchParams.order.includes("2");
    },
    isAsc() {
      return this.searchParams.order.includes("asc");
    },
    isDesc() {
      return this.searchParams.order.includes("desc");
    },
  },
  methods: {
    //封装为一个函数，调函数，即发请求
    //向服务器发请求，获取search模块的数据（根本参数不同，返回不同的数据，进行展示）
    getData() {
      this.$store.dispatch("getSearchList", this.searchParams);
    },
    //删除分类名的面包屑
    removeCategoryName() {
      //把分类名置空，还需向服务器发送请求
      //这个接口的参数都是可有可无的，不是必须要有的，所以相比于置空，不如直接undefined，
      //如果属性值为空串，还是会把相应的字段带给服务器，但是如果置为undefined，则这个字段就不会带给服务器了，性能优化了一点点
      this.searchParams.categoryName = undefined;
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3Id = undefined;
      //this.getData();//其实没必要写这句话了，watch监听路由变化了
      //地址栏也需要改：路由跳转，不带参数的自己跳自己
      //  this.$router.push('search')//此时有bug，用户输入的keyword(params参数)也就被删了，一棒子全打死了,
      if (this.$route.params) {
        this.$router.push({ name: "search", params: this.$route.params });
      }
    },
    //删除关键字的面包屑
    removeKeyword() {
      //给服务器带的参数searchParams的keyword置空
      this.searchParams.keyword = undefined;
      //再次发请求
      // this.getData();其实没必要写这句话了，watch监听路由变化了
      //通知header组件，清除keyword
      this.$bus.$emit("clearKeyword");
      //进行路由跳转
      if (this.$route.query) {
        //留下通过点击分类标签的路径，删除keyword的路径
        this.$router.push({ name: "search", query: this.$route.query });
      }
    },
    //删除红色字体品牌的面包屑
    removeTrademark() {
      this.searchParams.trademark = "";
      //再次发请求
      this.getData();
    },
    //删除售卖属性的面包屑
    removeAttr(index) {
      //删除数组中的元素，得拿到点击删除的元素的索引值
      // console.log(index)
      //删除
      this.searchParams.props.splice(index, 1);
      //删除完了还得再发请求呢，展示剩下的面包屑对应的数据
      this.getData();
    },
    //排序的操作
    changeOrder(flag) {
      //flag形参：是一个标记，代表用户点击的是综合（1）还是价格（2）
      let originOrder = this.searchParams.order; //格式:例：“1：asc”
      //获取原始的状态（点击之前的状态）
      let originFlag = originOrder.split(":")[0];
      let originSort = originOrder.split(":")[1];
      // console.log("原本的flag"+originFlag,"用户点击的flag"+flag)
      //准备一个新的order值
      let newOrder = "";
      //这里得分情况讨论，可能点击的是现在正在高亮的，也可能点击的是现在非高亮的
      if (originFlag == flag) {
        //能进if，我就能确定用户点击的一定是当前正在高亮的,所以需要反转升/降序
        // newOrder = `${flag}:${originSort=="desc"?"asc":"desc"}`  //老师的写法，下边的if else是我自己的写法，最通俗易懂的写法
        if (originSort == "desc") {
          newOrder = `${flag}:${"asc"}`;
        } else {
          newOrder = `${flag}:${"desc"}`;
        }
        // console.log(newOrder)
      } else {
        //能进else，说明用户点击的是当前非高亮状态的
        newOrder = `${flag}:${"desc"}`; //无论点击价格还是综合，默认都是先变为降序（这里没有为什么，就是想这么设计），再次点击才反转为升序
        // console.log(newOrder)
      }
      //将newOrder赋值给searchParams的order
      this.searchParams.order = newOrder;
      //再次发请求
      this.getData();
    },
    //自定义事件的回调函数，获取当前是第几页
    getPageNo(pageNo) {
      // console.log('父组件拿到当前页码了',pageNo)
      //整理参数
      this.searchParams.pageNo = pageNo;
      //再次发请求
      this.getData();
    },
  },
  //现在有一个bug，我在home页通过点击【手机】这个分类，进入到search，然后我从再想搜索oppo的，此时不会再发请求了，因为发请求的语句写在了mounted里面，而组件只挂载一次，解决办法：监听路由的变化，路由一变，说明用户又进一步搜索了，得再次发请求，获取用户想要的数据！
  watch: {
    //监听路由的变化,如果发生变化，则再次发起请求，
    $route(newValue, oldValue) {
      //每次请求之前，应该把相应的一二三级分类的id置空，让他接收下一次响应的一二三级id
      this.searchParams.category1Id = "";
      this.searchParams.category2Id = "";
      this.searchParams.category3Id = "";
      //再次发请求之前，照样得先把参数整理好，然后带着新整理好的参数去向服务器请求数据
      Object.assign(this.searchParams, this.$route.query, this.$route.params);
      //console.log(this.searchParams);
      //再次发起请求
      this.getData();
    },
  },
  beforeDestroy() {
    // console.log("trademarkInfo被解绑了");
    this.$bus.$off("trademarkInfo");
    // console.log("attrInfo被解绑了");
    this.$bus.$off("attrInfo");
  },
};
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>
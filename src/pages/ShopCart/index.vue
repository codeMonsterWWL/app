<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul
          class="cart-list"
          v-for="(cart, index) in cartInfoList"
          :key="cart.id"
        >
          <li class="cart-list-con1">
            <input
              type="checkbox"
              name="chk_list"
              :checked="cart.isChecked == 1"
              @change="changeChecked(cart, $event)"
            />
          </li>
          <li class="cart-list-con2">
            <img :src="cart.imgUrl" />
            <div class="item-msg">
              {{ cart.skuName }}
            </div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ cart.skuPrice }}</span>
          </li>
          <li class="cart-list-con5">
            <!-- 加、减和input框这三个按钮绑定的时同一个单击响应函数，通过传不同的参数来区分开我是点击的哪个按钮来触发的回调函数 -->
            <a
              href="javascript:void(0)"
              class="mins"
              @click="handler('minus', -1, cart)"
              >-</a
            >
            <input
              autocomplete="off"
              type="text"
              :value="cart.skuNum"
              minnum="1"
              class="itxt"
              @change="handler('change', $event.target.value * 1, cart)"
            />
            <a
              href="javascript:void(0)"
              class="plus"
              @click="handler('add', 1, cart)"
              >+</a
            >
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ cart.skuNum * cart.skuPrice }}</span>
          </li>
          <li class="cart-list-con7">
            <a class="sindelet" @click="deleteCartById(cart)">删除</a>
            <br />
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input
          class="chooseAll"
          type="checkbox"
          :checked="isAllChecked && cartInfoList.length > 0"
          @click="updateAllCartChecked"
        />
        <span>全选</span>
      </div>
      <div class="option">
        <a @click="deleteAllCheckedCart">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择 <span>0</span>件商品</div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ totalPrice }}</i>
        </div>
        <div class="sumbtn">
          <router-link class="sum-btn" to="/trade">结算</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import throttle from "lodash/throttle.js";
export default {
  name: "ShopCart",
  mounted() {
    //不止派发一次，封装成函数，再调用函数，比较方便
    this.getData();
  },
  methods: {
    //获取个人购物车的列表数据
    getData() {
      this.$store.dispatch("getCartList");
    },
    //修改商品的个数(加了节流)
    handler: throttle(async function (type, num, cart) {
      //type:为了区分点击的是哪个按钮
      //num有两层含义：对于input来说，是用户在input中输入的数值，对于加减按钮来说，num就是变化的量，就是带给服务器的数据了
      //cart是遍历出来的商品，命名为cart了
      //最终的目的是向服务器发请求，修改数量
      switch (type) {
        case "add":
          num = 1;
          break;
        case "minus":
          num = cart.skuNum > 1 ? -1 : 0; //如果原本的数量小于1了，就让变化量为0，发给服务器，意味着让数量原封不动
          break;
        case "change":
          //解决用户输入的最终的数值是非法的（负数、带有汉字）
          if (isNaN(num) || num < 1) {
            num = 0;
          } else {
            //正常情况中还会有小数的情况,得parseInt转换一下，因为接口的设计是需要我们带给服务器变化的值，所以用输入的值减去原来的值，得出差值，再带给服务器
            num = parseInt(num) - cart.skuNum;
          }
          break;
      }
      //派发action
      try {
        //代表修改成功，得再发请求获取服务器最新的数据进行展示,要不然只是修改了数据库里面的数据了但是得刷新页面才能展示出来最新的数据，所以发个请求获取数据库的数据就可以了
        await this.$store.dispatch("addOrUpdateShopCart", {
          skuId: cart.skuId,
          skuNum: num,
        });
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    }, 1000),
    //删除商品的回调
    async deleteCartById(cart) {
      try {
        await this.$store.dispatch("deleteCartListBySkuId", cart.skuId);
        //如果删除成功，再次发请求获取最新的数据进行展示
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
    //修改商品的选中状态
    changeChecked(cart, event) {
      //带给服务器的isChecked参数应该为0或者1（接口这么设计的）
      //console.log(event.target.checked)//但是这里返回的是布尔值
      try {
        //修改成功，再次获取最新的数据
        let checked = event.target.checked ? "1" : "0";
        this.$store.dispatch("changeChecked", {
          skuId: cart.skuId,
          isChecked: checked,
        });
        this.getData();
      } catch (error) {
        //如果失败，弹窗
        alert(error.message);
      }
    },
    //删除选中的商品,这个回调函数没办法收集到一些有用的数据
    async deleteAllCheckedCart() {
      try {
        //派发一个action
        await this.$store.dispatch("deleteAllCheckedCart");
        //再次发请求，展示最新的数据
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
    //全选按钮
    async updateAllCartChecked(event) {
      try {
        let checked = event.target.checked ? "1" : "0";
        //派发action
        await this.$store.dispatch("updateAllCartIsChecked", checked);
        //再次发请求
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
  },
  computed: {
    ...mapGetters(["cartList"]),
    //购物车的数据
    cartInfoList() {
      return this.cartList.cartInfoList || [];
    },
    //计算勾选了的商品总价
    totalPrice() {
      let sum = 0;
      this.cartInfoList
        .filter((item) => item.isChecked == 1)
        .forEach((cart) => {
          sum = sum + cart.skuNum * cart.skuPrice;
        });
      return sum;
    },
    //判断底部全选的按钮（全部产品都选中，它就勾上）
    /* every() 方法使用指定函数检测数组中的所有元素：
    如果数组中检测到有一个元素不满足，则整个表达式返回 false ，且剩余的元素不会再进行检测。
    如果所有元素都满足条件，则返回 true。
    注意： every() 不会对空数组进行检测。
    注意： every() 不会改变原始数组。*/
    isAllChecked() {
      return this.cartInfoList.every((item) => item.isChecked == 1);
    },
  },
};
</script>


<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
//该模块：API进行统一管理
import requests from './request'

import mockRequests from './mockRequest'



//三级联动接口
//    /api/product/getBaseCategoryList    get请求   无参数
export const reqCategoryList = () => requests.get('/product/getBaseCategoryList') //这是axios.get('')的写法


//获取首页banner轮播图的接口 ,
export const reqGetBannerList = () => mockRequests.get('/banner')

//获取floor组件的数据
export const reqFloorList = () => mockRequests.get('/floor')

//获取search模块的数据 地址/api/list  请求方式post
//有参数
//这个接口（获取search模块的数据），给服务器传递参数params，至少是一个空对象
export const reqGetSearchInfo = (params) => requests({  //axios({})对象的写法，因为这里requests就是封装过后的axios
  url: '/list',
  method: 'post',
  data: params
})

//获取产品详情信息的接口  url：/api/item/{ skuId }   get请求  参数（一个）必选
export const reqGoodsInfo = (skuId) => requests({
  url: `/item/${skuId} `,
  method: 'get'
})

//将商品添加到购物车/更新某一个产品的个数  /api/cart/addToCart/{ skuId }/{ skuNum }   post
export const reqAddOrUpdateShopCart = (skuId, skuNum) => requests({
  url: `/cart/addToCart/${skuId}/${skuNum}`,
  method: 'post'
})

//获取购物车列表数据的接口  /api/cart/cartList   get请求  没有参数 
export const reqCartList = () => requests.get('/cart/cartList ')

//删除购物车的商品   /api/cart/deleteCart/{skuId}   delete请求     参数：skuId
export const reqDeleteCartById = (skuId) => requests({
  url: `/cart/deleteCart/${skuId} `,
  method: 'delete'
})


//切换商品选中状态  /api/cart/checkCart/{skuId}/{isChecked}    get请求    isChecked：0代表取消  1代表选中
export const reqChangeIsChecked = (skuId, isChecked) => requests({
  url: `/cart/checkCart/${skuId}/${isChecked}`,
  method: 'get'
})

//注册时获取验证码  /api/user/passport/sendCode/{phone}    get请求
export const reqGetCode = (phone) => requests({
  url: `/user/passport/sendCode/${phone} `,
  method: 'get'
})

//注册  /api/user/passport/register  post   phone code  password
export const reqUserRegister = (data) => requests({
  url: '/user/passport/register',
  data: data,
  method: 'post'
})


//登录接口  /api/user/passport/login    post  phone，password
//地址中没有参数，就得带对象过去
export const reqUserLogin = (data) => requests({
  url: '/user/passport/login ',
  method: 'post',
  data: data
})

//获取用户信息（需要带着用户的token向服务器要用户信息,这个接口没带参数，所以把token写在headers里面）    /api/user/passport/auth/getUserInfo     get
export const reqUserInfo = () => requests({
  url: '/user/passport/auth/getUserInfo  ',
  method: 'get'
})

//退出登录  /api/user/passport/logout
export const reqLogout = () => requests({
  url: '/user/passport/logout',
  method: 'get'
})

//获取收件人地址信息  /api/user/userAddress/auth/findUserAddressList   get请求 不用带参数 
export const reqAddressInfo = () => requests({
  url: '/user/userAddress/auth/findUserAddressList',
  method: 'get'
})

//获取商品清单   /api/order/auth/trade   get
export const reqOrderInfo = () => requests.get('/order/auth/trade ')


//提交支付订单         /api/order/auth/submitOrder?tradeNo={tradeNo}  post请求
export const reqSubmitOrder = (tradeNo, data) => requests({
  url: `/order/auth/submitOrder?tradeNo=${tradeNo}`,
  data: data,
  method: 'post'
})

//根据订单号获取订单支付信息  /api/payment/weixin/createNative/{orderId}   get
export const reqPayInfo = (orderId) => requests({
  url: `/payment/weixin/createNative/${orderId}`,
  method: 'get'
})

//获取订单支付的状态  /api/payment/weixin/queryPayStatus/{orderId}  get请求
export const reqPayStatus = (orderId) => requests({
  url: `/payment/weixin/queryPayStatus/${orderId}`,
  method: 'get'
})

//获取我的订单列表（用于展示个人中心） /api/order/auth/{page}/{limit}  get
export const reqMyOrderList = (page, limit) => requests({
  url: `/order/auth/${page}/${limit}`,
  method: 'get'
})
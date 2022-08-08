import { reqGoodsInfo, reqAddOrUpdateShopCart } from "@/api"
//封装游客身份模块uuid：生成一个随机串（不能再变了）
import {getUUID} from '@/utils/uuid_token'
const state = {
  goodInfo: {},//看接口文档，返回的是对象还是数组
  //游客临时身份
  uuid_token:getUUID()
}

//mutations是唯一修改state的地方
const mutations = {
  GETGOODSINFO(state, result) {
    state.goodInfo = result
  }
}
//action用户处理派发action的地方，可以书写异步语句、自己逻辑的地方
const actions = {
  //获取产品详情的action
  async getGoodsInfo({ commit }, skuId) {
    let result = await reqGoodsInfo(skuId)
    if (result.code == 200) {
      commit('GETGOODSINFO', result.data)
    }
  },
  //将商品添加到购物车
  async addOrUpdateShopCart({ commit }, { skuId, skuNum }) {
    let result = await reqAddOrUpdateShopCart(skuId, skuNum)
    //console.log(result)//并没有返回其他的数据，只返回code==200，代表添加成功，因此不需要三连环存储数据, 但是得告诉组件是成功还是失败了，成功了就返回成功的promise，失败了就返回一个失败的promise
    //当前的这个函数返返回的是promise
    if(result.code==200){
      //代表成功，返回一个ok，就代表返回了一个成功的promise
      return 'ok'
    }else{
      //代表失败，返回一个失败的promise对象
      return Promise.reject(new Error('添加失败'))
    }
  },
}

const getters = {
  //路径导航简化的数据
  categoryView(state) {
    //goodInfo初始值是空对象，空对象打点categoryView就是undefined，所以控制台回报错，说白了categoryView计算出来至少得是个空对象，后面加上||{}就解决了
    return state.goodInfo.categoryView || {}
  },
  //简化产品信息的数据
  skuInfo(state) {
    return state.goodInfo.skuInfo || {}
  },
  //产品售卖属性的简化
  spuSaleAttrList(state) {
    return state.goodInfo.spuSaleAttrList || []
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
import { reqAddressInfo,reqOrderInfo } from '@/api'
const state = {
  address:[],
  orderInfo:{}
}

const mutations = {
  GETUSERADDRESS(state,result){
    state.address = result
  },
  GETORDERINFO(state,result){
    state.orderInfo = result
  }
}

const actions = {
  //获取用户地址信息
  async getUserAddress({ commit }) {
    let result = await reqAddressInfo()
    if(result.code==200){
      commit('GETUSERADDRESS',result.data)
    }
  },
  //获取商品清单数据
  async getOrderInfo({commit}){
    let result = await reqOrderInfo()
    if(result.code==200){
      commit('GETORDERINFO',result.data)
    }
  }
}

const getters = {

}

export default {
  state,
  mutations,
  actions,
  getters
}
import { reqCategoryList, reqGetBannerList, reqFloorList } from '@/api'


//home组件的小仓库
const state = {
  //state中数据的默认初始值不要瞎写，服务器返回的是对象，初始值就写成空对象，服务器返回的是数组，初始值就写成空数组
  categoryList: [],
  //轮播图的数据，因为mockjs模拟的数据返回的是一个数组，所以这里写成空数组
  bannerList: [],
  //Floor的数据，
  floorList: []
}

//mutations是唯一修改state的地方
const mutations = {
  CATEGORYLIST(state, result) {
    state.categoryList = result
  },
  GETBANNERLIST(state, result) {
    // console.log('在修改仓库中bannerList数据')
    state.bannerList = result
  },
  GETFLOORLIST(state, result) {
    state.floorList = result
  }
}
//action用户处理派发action的地方，可以书写异步语句、自己逻辑的地方
const actions = {
  //通过API里面的接口函数调用，向服务器发送请求，获取服务器的数据
  async categoryList({ commit }) {
    let result = await reqCategoryList()
    if (result.code === 200) {
      commit("CATEGORYLIST", result.data)
    }
  },
  //获取首页轮播图的数据
  async getBannerList({ commit }) {
    // console.log('在向服务器发起ajax请求，获取轮播图的数据')
    let result = await reqGetBannerList()
    if (result.code == 200) {
      commit('GETBANNERLIST', result.data)
    }
  },
  //获取floor数据
  async getFloorList({ commit }) {
    let result = await reqFloorList()
    if (result.code == 200) {
      commit('GETFLOORLIST', result.data)
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
import { reqGetSearchInfo } from "@/api"

//search组件的小仓库
const state = {
  searchList: {}//注意返回的数据的格式
}
const mutations = {
  GETSEARCHLIST(state, result) {
    state.searchList = result
  }
}
const actions = {
  //获取search模块的数据
  async getSearchList({ commit }, params = {}) {//默认参数，默认是一个空对象，传了就用你传的，没传就默认是一个空对象
    //params这个形参：是当用户派发action的时候，第二个参数传递过来的，至少是一个空对象
    let result = await reqGetSearchInfo(params)//至少传递一个空对象 
    if (result.code == 200) {
      commit('GETSEARCHLIST', result.data)
    }
  }
}
//getters，计算属性，在项目当中，为了简化数据而生
//可以把我们将来组件当中用到的数据简化一下，好处是组件捞取仓库中的数据时变得方便了
const getters = {
  //这个state是当前仓库的小state，并非大仓库的state
  goodsList(state) {
    //如果服务器的数据回来了，没问题，goodsList就是一个数组，
    //假如网络不给力，则return state.searchList.goodsList返回的是undefined
    //这里面的新的属性的属性值至少是一个数组，以防万一
    return state.searchList.goodsList || []
  },
  trademarkList(state) {
    return state.searchList.trademarkList || []
  },
  attrsList(state) {
    return state.searchList.attrsList || []
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
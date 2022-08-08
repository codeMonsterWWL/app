import { reqCartList, reqDeleteCartById, reqChangeIsChecked } from "@/api"

const state = {
  cartList: []
}

const mutations = {
  GETCARTLIST(state, result) {
    state.cartList = result
  }
}

const actions = {
  //获取购物者列表的数据
  async getCartList({ commit }) {
    let result = await reqCartList()
    if (result.code == 200) {
      commit('GETCARTLIST', result.data)
    }
  },
  //删除购物车的商品
  async deleteCartListBySkuId({ commit }, skuId) {
    //该接口不返回数据，因此不需要三连环，但是组件得知道是删除成功还是失败了，所以这个函数得返回成功或失败的promise来告诉组件是删除成功还是失败 
    let result = await reqDeleteCartById(skuId)
    if (result.code = 200) {
      return 'ok'
    } else {
      return Promis.reject(new Error('删除失败！'))
    }
  },
  //修改购物车中商品的选中状态
  async changeChecked({ commit }, { skuId, isChecked }) {
    let result = await reqChangeIsChecked(skuId, isChecked)
    if (result.code == 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('修改失败'))
    }
  },
  //删除全部勾选的商品
  deleteAllCheckedCart({ dispatch, getters }) {
    //console.log(context)//我们之前只用了context中的commit，但是context里面的东西可多了去了，还可以再派发action（因为context里面有dispath），context里面还有state（当前仓库的数据）,还有getters（计算属性）
    //console.log(getters.cartList.cartInfoList)//购物车里的商品数据
    let PromiseAll = []
    getters.cartList.cartInfoList.forEach(item => {
      if (item.isChecked == 1) {
        let promise = dispatch('deleteCartListBySkuId', item.skuId)//每次执行deleteCartListBySkuId函数，执行删除操作，返回的都是一个promise 
        //将每一次返回的promise添加到数组当中
        PromiseAll.push(promise)
      }
    });
    //只要数组里的全部promise都成功，则返回结果为成功
    //如果有一个失败，则返回失败的结果
    return Promise.all(PromiseAll)
  },
  //全选按钮
  updateAllCartIsChecked({ dispatch, state }, checked) {
    //全选按钮的状态是啥，就让上边的一群小弟的状态是啥（看全选按钮的脸色行事儿！）3
    let promiseAll = []
    state.cartList[0].cartInfoList.forEach(item => {
      let promise = dispatch('changeChecked', { skuId: item.skuId, isChecked: checked })
      promiseAll.push(promise)
    });
    //组件那边等着这返回结果是成功还是失败呢，如果成功了组件还得再次发请求获取最新的数据une，所以返回promiseAll的Promise.all的结果
    return Promise.all(promiseAll)
  }
}

const getters = {
  cartList(state) {
    return state.cartList[0] || []
  },
}

export default {
  state,
  mutations,
  actions,
  getters
}
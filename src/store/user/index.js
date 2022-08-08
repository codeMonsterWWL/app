//登录与注册的模块
import { reqGetCode, reqUserRegister, reqUserLogin, reqUserInfo, reqLogout } from '@/api'
import { setToken,getToken,removeToken } from '@/utils/token'
const state = {
  code: '',
  token: getToken(),
  userInfo: ''
}

const mutations = {
  GETCODE(state, result) {
    state.code = result
  },
  USERLOGIN(state, token) {
    state.token = token
  },
  GETUSERINFO(state, result) {
    state.userInfo = result
  },
  CLEAR(state){
    //把仓库中关于用户信息的清空
    state.token = ''
    state.userInfo = {}
    //本地存储中的token清空
    removeToken()
  }
}

const actions = {
  //获取验证码
  async getCode({ commit }, phone) {
    //正常是后台把验证码发送到手机上，但是这个项目的后台为了省钱，没这么做
    let result = await reqGetCode(phone)
    if (result.code == 200) {
      commit('GETCODE', result.data)
      return 'ok'
    } else {
      return Promise.reject(new Error('获取验证码失败！'))
    }
  },
  //注册
  async userRegister({ commit }, user) {
    let result = await reqUserRegister(user)
    //console.log(result)//返回的data为空（注册成功只是让后台把账户存放到数据库，不需要返回数据，但是得告诉组件这里是成功还是失败了）
    if (result.code == 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('注册失败！'))
    }
  },
  //登录(token)
  async userLogin({ commit }, data) {
    let result = await reqUserLogin(data)
    //服务器下发的token，是用户唯一标识符，和uuid很像 
    //将来经常通过token向服务器要用户的信息进行展示
    if (result.code == 200) {
      //用户已经登录成功且获取到了token
      commit('USERLOGIN', result.data.token)
      //持久化存储token
      // token: localStorage.getItem('TOKEN'),未登录时，本地存储中没有TOKEN，所以仓库中的token为NAN，然后登录成功后，获取到了token并将token存储在本地存储了，此时刷新页面，localStorage.getItem('TOKEN')生效，此时仓库中的token有值（奏效），刷新页面，home组件重新mounted，home的mounted中重新派发getUserInfo这个action，因为仓库中token有值，所以写在请求拦截器中的headers中包含token，带着token成功执行了reqUserInfo接口，就能重新获取到userInfo，home页就能接着展示用户信息，就解决了页面刷新后home页丢失用户信息的bug
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('失败'))
    }
  },
  //获取用户信息
  async getUserInfo({ commit }) {
    let result = await reqUserInfo()
    if (result.code == 200) {
      commit('GETUSERINFO', result.data)
      return 'ok'
    }else{
      return Promise.reject(new Error('获取信息失败'))
    }
  },
  //退出登录
  async userLogout({commit}) {
    //向服务器发一次请求,通知服务器清除token
    let result = await reqLogout()
    //自己这边也得把token清楚了，action里面不能操作state，所以得提交mutation
    if(result.code==200){
      commit('CLEAR')
      return 'ok'
    }else{
      return Promise.reject(new Error('失败'))
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
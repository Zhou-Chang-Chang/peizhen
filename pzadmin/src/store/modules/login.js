const state = {
  // state 应该是函数
  token: "",
  userInfo: {
    avatar: "",
    name: "",
  },
};

const mutations = {
  setToken(state, token) {
    // 简化参数
    state.token = token;
  },
  setUserInfo(state, userInfo) {
    // 简化参数
    state.userInfo = userInfo;
  },

  logout(state) {
    state.token = '';
    state.userInfo = {
      avatar: "",
      name: "",
    }
  }
};

// 正确导出方式
export default {
  namespaced: true, // 推荐添加命名空间
  state,
  mutations,
};

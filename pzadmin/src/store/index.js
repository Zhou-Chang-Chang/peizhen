
import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import menu from '@/store/modules/menu.js'
import login from "./modules/login";
// 创建一个新的 store 实例
const store = createStore({
  modules: {
    menu,
    login,
  },
  plugins: [
    createPersistedState({
      key: "my-app-store", // 本地存储的 key 名
      paths: ["login"], // 👈 指定要持久化的模块,// 不设置 paths 表示持久化整个 state
      storage: window.localStorage, // 默认 localStorage，可改成 sessionStorage
    }),
  ],
});

export default store





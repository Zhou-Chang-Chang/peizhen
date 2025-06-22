import './assets/main.css'
import pinia from '@/stores'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import api from '@/api'
const app = createApp(App)
app.config.globalProperties.$api = api

app.use(pinia)
app.use(router)

import { useUserStore } from '@/stores'
const userStore = useUserStore()
router.beforeEach((to, from, next) => {
  const token = userStore.token
  const whiteList = ['/login'] // 不需要登录权限的路由
  if (token) {
    // 用户已登录
    if (to.path === '/login') {
      next('/') // 登录状态访问登录页，跳首页
    } else {
      next() // 访问其他页，放行
    }
  } else {
    // 用户未登录
    if (whiteList.includes(to.path)) {
      next() // 在白名单，放行
    } else {
      next('/login') // 否则跳转登录页
    }
  }
})

app.mount('#app')

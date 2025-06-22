import axios from 'axios' // 引入 axios 用于发起 HTTP 请求
// import { ElMessage } from 'element-plus' // 引入 Element Plus 的消息组件用于错误提示
import router from '@/router' // 引入 Vue Router 实例，用于路由跳转
import { useUserStore } from '@/stores' // 引入 Pinia 的用户状态管理

const baseURL = 'https://v3pz.itndedu.com/v3pz'

// 创建 Axios 实例，统一配置 baseURL 和超时时间
const instance = axios.create({
  baseURL, // 基础路径
  timeout: 10000, // 超时时间：10秒
  headers: {
    terminal: 'h5', // 必需 Header
  },
})

// 请求拦截器：自动添加 token   (每次请求前执行)
instance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    const token = userStore.token
    //如果用户已登录，自动在请求头中携带token
    if (token) {
      config.headers['h-token'] = token // 将 token 加入请求头
    }
    return config // 返回修改后的配置对象
  },
  (error) => Promise.reject(error),
)

// 响应拦截器：统一处理错误   （每次响应后执行）
instance.interceptors.response.use(
  (res) => {
    // // 业务失败提示 //如果后端返回的 code 为 0，表示业务成功
    if (res.data.code !== 10000) {
      // ElMessage.error(res.data.message || '请求失败')
      return Promise.reject(res.data)
    }
    return res.data //业务成功
  },
  (err) => {
    // 401：token 失效 （如果响应状态码为 401，表示未授权或登录失效）
    // ElMessage.error('登录已过期，请重新登录')
    if (err.response && err.response.status === 401) {
      const userStore = useUserStore()

      userStore.logout() // 清除用户信息
      router.push('/login') // 跳转到登录页

      //   //location.href = '/login' // 跳转到登录页
      // } else {
      //   ElMessage.error(err.response?.data?.message || '服务异常')
    }
    return Promise.reject(err)
  },
)

export default instance // 默认导出 Axios 实例

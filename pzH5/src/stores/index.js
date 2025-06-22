import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate'

const pinia = createPinia()

// 注册插件
pinia.use(piniaPersist)

export default pinia

//仓库统一导出
export * from '@/stores/modules/user'

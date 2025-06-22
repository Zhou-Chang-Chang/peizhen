import { createApp } from 'vue'
import '@/style.css'
import "element-plus/dist/index.css";
import App from './App.vue'
import router from './router'  // 引入 router
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import store from '@/store/index.js'
import paneHeader from '@/components/paneHeader.vue'
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.component("paneHeader", paneHeader);
app.use(router) // 使用 router
app.use(store);
app.mount("#app");

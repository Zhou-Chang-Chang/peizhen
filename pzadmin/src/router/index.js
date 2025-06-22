import { createRouter, createWebHistory } from "vue-router";
import store from '@/store'
//  定义路由表
const routes = [
  {
    path: "/",
    component: () => import("@/views/index.vue"),
    redirect: "/dashboard",
    name: "home",
    children: [
      {
        path: "dashboard",
        meta: { id: "1", name: "控制台", icon: "Platform", path: "/dashboard" },
        component: () => import("@/views/Layout/dashboard/index.vue"),
      },
      {
        path: "auth",

        meta: { id: "2", name: "权限管理", icon: "Grid" },
        children: [
          {
            path: "",
            alias: ["admin"],
            meta: {
              id: "1",
              name: "账号管理",
              icon: "Avatar",
              path: "/auth/admin",
            },
            component: () => import("@/views/Layout/auth/admin/index.vue"),
          },
          {
            path: "group",
            meta: {
              id: "2",
              name: "菜单管理",
              icon: "Menu",
              path: "/auth/group",
            },
            component: () => import("@/views/Layout/auth/group/index.vue"),
          },
        ],
      },
      {
        path: "vppz",
        meta: { id: "3", name: "陪诊", icon: "Grid" },
        children: [
          {
            path: "",
            alias: ["order"], //alias 是一个用于设置 路径别名 的配置项，它允许你使用多个路径访问同一个组件或页面。
            meta: {
              id: "1",
              name: "陪护管理",
              icon: "Avatar",
              path: "/vppz/order",
            },
            component: () => import("@/views/Layout/vppz/order/index.vue"),
          },
          {
            path: "staff",
            meta: {
              id: "2",
              name: "订单管理",
              icon: "Menu",
              path: "/vppz/staff",
            },
            component: () => import("@/views/Layout/vppz/staff/index.vue"),
          },
        ],
      },
    ],
  },
  { path: "/login", component: () => import("@/views/Login/index.vue") },
];

//  创建路由实例
const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 模式（去掉 #）
  routes,
});



//路由前置守卫
router.beforeEach((to, from, next) => {
  const token = store.state.login.token;
  if (token) {
    if (to.path === "/login") {
      next("/"); // 登录状态访问 login -> 跳首页
    } else {
      next();
    }
  } else {
    if (to.path !== "/login") {
      next("/login"); // 未登录访问其他页 -> 跳登录
    } else {
      next();
    }
  }
});



//  导出路由
export default router;

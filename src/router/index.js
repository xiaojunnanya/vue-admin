import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import Layout from "@/layout";
export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index"),
      },
    ],
  },
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },
  {
    path: "/auth-redirect",
    component: () => import("@/views/login/auth-redirect"),
    hidden: true,
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404"),
    hidden: true,
  },
  {
    path: "/401",
    component: () => import("@/views/error-page/401"),
    hidden: true,
  },
  {
    path: "/",
    component: Layout,
    redirect: "/complex-table",
  },
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: "/",
    component: Layout,
    name: "ComplexTable",
    meta: {
      icon: "table",
    },
    children: [
      {
        path: "complex-table",
        component: () => import("@/views/table/complex-table"),
        name: "ComplexTable",
        meta: { title: "考核方案" },
      },
    ],
  },
  {
    path: "/",
    component: Layout,
    name: "task",
    meta: {
      icon: "component",
    },
    children: [
      {
        path: "task",
        component: () => import("@/views/table/task"),
        name: "task",
        meta: { title: "我的任务" },
      },
    ],
  },
  {
    path: "/",
    component: Layout,
    name: "approve",
    meta: {
      icon: "component",
    },
    children: [
      {
        path: "approve",
        component: () => import("@/views/table/approve"),
        name: "approve",
        meta: { title: "我的审批" },
      },
    ],
  },
  {
    path: "/",
    component: Layout,
    name: "ComplexProject",
    meta: {
      icon: "table",
    },
    children: [
      {
        path: "complex-project",
        component: () => import("@/views/table/complex-project"),
        name: "ComplexProject",
        meta: { title: "考核项目" },
      },
    ],
  },
  {
    path: "/",
    component: Layout,
    name: "unit",
    meta: {
      icon: "table",
    },
    children: [
      {
        path: "unit",
        component: () => import("@/views/table/unit"),
        name: "unit",
        meta: { title: "单位" },
      },
    ],
  },
  {
    path: "/",
    component: Layout,
    name: "ranking",
    meta: {
      icon: "chart",
    },
    children: [
      {
        path: "ranking",
        component: () => import("@/views/table/ranking"),
        name: "ranking",
        meta: { title: "排行榜" },
      },
    ],
  },
  {
    path: "/",
    component: Layout,
    name: "user",
    meta: {
      icon: "peoples",
    },
    children: [
      {
        path: "user",
        component: () => import("@/views/table/user"),
        name: "user",
        meta: { title: "用户管理" },
      },
    ],
  },
  {
    path: "/",
    component: Layout,
    name: "setting",
    meta: {
      icon: "component",
    },
    children: [
      {
        path: "setting",
        component: () => import("@/views/table/setting"),
        name: "setting",
        meta: { title: "设置" },
      },
    ],
  },
  { path: "*", redirect: "/404", hidden: true },
];

const createRouter = () =>
  new Router({
    mode: "history", // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;

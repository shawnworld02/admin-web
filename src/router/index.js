/*
 * @Author: Shawn_Liang 102449877+shawnworld02@users.noreply.github.com
 * @Date: 2022-07-13 14:02:58
 * @LastEditors: Shawn_Liang 102449877+shawnworld02@users.noreply.github.com
 * @LastEditTime: 2022-07-14 10:44:43
 * @FilePath: /admin-web/src/router/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/components/Login.vue"),
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("@/components/Home.vue"),
    redirect: "/welcome",
    children: [
      {
        path: "/welcome",
        name: "Welcome",
        component: () => import("@/components/Welcome.vue"),
      },
      {
        path: "/users",
        name: "Users",
        component: () => import("@/components/users/Users"),
      },
      {
        path: "/rights",
        name: "Rights",
        component: () => import("@/components/rights/Rights"),
      },
      {
        path: "/roles",
        name: "Roles",
        component: () => import("@/components/roles/Roles"),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === "/login") return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem("token");
  if (!tokenStr) return next("/login");
  next();
});

export default router;

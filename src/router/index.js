import { createRouter, createWebHistory } from "vue-router";
import MainView from "../views/MainView.vue";
import AttractionView from "../views/AttractionView.vue";
import PlanView from "../views/PlanView.vue";
import HotplaceView from "../views/HotplaceView.vue";
import JoinView from "../views/JoinView.vue";
import LoginView from "../views/LoginView.vue";
import MypageView from "../views/MypageView.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main",
      component: MainView,
    },
    {
      path: "/attraction",
      name: "attraction",
      component: AttractionView,
    },
    {
      path: "/plan",
      name: "plan",
      component: PlanView,
    },
    {
      path: "/hotplace",
      name: "hotplace",
      component: HotplaceView,
    },
    {
      path: "/join",
      name: "join",
      component: JoinView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/mypage",
      name: "mypage",
      component: MypageView,
    },
    {
      path: "/board",
      name: "board",
      // component: TheBoardView,
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/BoardView.vue"),
      redirect: { name: "article-list" },
      children: [
        {
          path: "list",
          name: "article-list",
          component: () => import("@/components/board/BoardList.vue"),
        },
        {
          path: "view/:articleno",
          name: "article-view",
          component: () => import("@/components/board/BoardDetail.vue"),
        },
        {
          path: "write",
          name: "article-write",
          component: () => import("@/components/board/BoardWrite.vue"),
        },
        {
          path: "modify/:articleno",
          name: "article-modify",
          component: () => import("@/components/board/BoardModify.vue"),
        },
      ],
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("../views/AdminView.vue"),
      redirect: { name: "member-list" },
      children: [
        {
          path: "list",
          name: "member-list",
          component: () => import("@/components/admin/AdminList.vue"),
        },
        {
          path: "view/:userId",
          name: "member-view",
          component: () => import("@/components/admin/AdminDetail.vue"),
        },
      ],
    },
  ],
});

export default router;

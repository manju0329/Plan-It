import { createRouter, createWebHistory } from "vue-router";
import { userStore } from "@/stores/userPiniaStore";
import MainView from "../views/MainView.vue";
import AttractionView from "../views/AttractionView.vue";
import PlanView from "../views/PlanView.vue";
import HotplaceView from "../views/HotplaceView.vue";
import JoinView from "../views/JoinView.vue";
import LoginView from "../views/LoginView.vue";
import MypageView from "../views/MypageView.vue";

const onlyAuthUser = async (to, from, next) => {
  const store = userStore();
  const checkUserInfo = store.checkUserInfo;
  const checkToken = store.checkToken;
  let token = sessionStorage.getItem("access-token");
  console.log("로그인 처리 전", checkUserInfo, token);

  if (checkUserInfo != null && token) {
    console.log("토큰 유효성 체크하러 가자!!!!");
    await store.getUserInfo(token);
  }
  if (!checkToken || checkUserInfo === null) {
    store.isLogin = false;
    alert("로그인이 필요한 페이지입니다.");
    router.push("/login");
  } else {
    next();
  }
};

const onlyAdminUser = async (to, from, next) => {
  const store = userStore();
  const checkUserInfo = store.checkUserInfo;
  const checkToken = store.checkToken;
  let token = sessionStorage.getItem("access-token");
  console.log("로그인 처리 전", checkUserInfo, token);

  if (checkUserInfo != null && token) {
    console.log("토큰 유효성 체크하러 가자!!!!");
    await store.getUserInfo(token);
  }

  console.log(checkUserInfo.userRole);
  if (checkUserInfo.userRole !== "admin") {
    alert("관리자만 접근할 수 있는 페이지입니다.");
    router.push("/");
  } else {
    next();
  }
};

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
      component: () => import("../views/AttractionView.vue"),
      redirect: { name: "attraction-list" },
      children: [
        {
          beforeEnter: onlyAuthUser,
          path: "list",
          name: "attraction-list",
          component: () => import("@/components/attraction/attraction.vue"),
        },
      ],
    },

    {
      beforeEnter: onlyAuthUser,
      path: "/plan",
      name: "plan",
      component: PlanView,
    },
    {
      beforeEnter: onlyAuthUser,
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
      beforeEnter: onlyAuthUser,
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
          beforeEnter: onlyAuthUser,
          path: "list",
          name: "article-list",
          component: () => import("@/components/board/BoardList.vue"),
        },
        {
          beforeEnter: onlyAuthUser,
          path: "view/:articleno",
          name: "article-view",
          component: () => import("@/components/board/BoardDetail.vue"),
        },
        {
          beforeEnter: onlyAuthUser,
          path: "write",
          name: "article-write",
          component: () => import("@/components/board/BoardWrite.vue"),
        },
        {
          beforeEnter: onlyAuthUser,
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
          beforeEnter: onlyAdminUser,
          path: "list",
          name: "member-list",
          component: () => import("@/components/admin/AdminList.vue"),
        },
        {
          beforeEnter: onlyAdminUser,
          path: "view/:userId",
          name: "member-view",
          component: () => import("@/components/admin/AdminDetail.vue"),
        },
      ],
    },
  ],
});

export default router;

import { createRouter, createWebHistory } from "vue-router";
import { userStore } from "@/stores/userPiniaStore";
import MainView from "../views/MainView.vue";
import AttractionView from "../views/AttractionView.vue";
import PlanView from "../views/PlanView.vue";
import HotplaceView from "../views/HotplaceView.vue";
import HotplaceRegisterView from "../views/HotplaceView.vue";
import JoinView from "../views/JoinView.vue";
import LoginView from "../views/LoginView.vue";
import MypageView from "../views/MypageView.vue";
import Swal from "sweetalert2";

const msg = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: true,
});

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
    msg.fire({
      icon: "error",
      title: "로그인이 필요한 페이지입니다.",
    });
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
    msg.fire({
      icon: "error",
      title: "관리자만 접근할 수 있는 페이지입니다.",
    });
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
          path: "list",
          name: "attraction-list",
          component: () => import("@/components/attraction/Attraction.vue"),
        },
      ],
    },
    {
      path: "/hotplace",
      name: "hotplace",
      component: HotplaceView,
    },
    {
      beforeEnter: onlyAuthUser,
      path: "/hotplace/:hotplaceno",
      name: "hotplace-view",
      component: () => import("@/components/hotplace/HotPlaceDetail.vue"),
    },
    {
      beforeEnter: onlyAuthUser,
      path: "/hotplace/write",
      name: "hotplace-write",
      component: () => import("@/views/HotPlaceRegister.vue"),
    },
    {
      beforeEnter: onlyAuthUser,
      path: "/hotplace/plan/write",
      name: "hotplace-plan-write",
      component: () => import("@/components/plan/hotplace/planHotPlaceWrite.vue"),
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
      path: "/plan",
      name: "plan",
      component: () => import("../views/PlanView.vue"),
      redirect: { name: "plan-list" },
      children: [
        {
          beforeEnter: onlyAuthUser,
          path: "list",
          name: "plan-list",
          component: () => import("@/components/plan/planList.vue"),
          beforeEach: onlyAuthUser(),
        },
        {
          beforeEnter: onlyAuthUser,
          path: "list/:planId",
          name: "plan-view",
          component: () => import("@/components/plan/planDetail.vue"),
        },
        {
          beforeEnter: onlyAuthUser,
          path: "write",
          name: "plan-write",
          component: () => import("@/components/plan/write/planWrite.vue"),
        },        
        {
          beforeEnter: onlyAuthUser,
          path: "modify",
          name: "plan-modify",
          component: () => import("@/components/plan/modify/planModify.vue"),
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

<script setup>
import { RouterLink, RouterView } from "vue-router";
import { computed } from "vue";
import { userStore } from "@/stores/userPiniaStore";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
const msg = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: true,
});
const router = useRouter();
const ustore = userStore();
const isLogin = computed(() => ustore.isLogin);
const isAdmin = computed(() => {
  return ustore.userInfo.userRole == "admin";
});

async function logout() {
  console.log("hi");
  console.log("로그아웃 -> " + ustore.userInfo.userId);
  await ustore.userLogout(ustore.userInfo.userId);
  msg.fire({
    icon: "success",
    title: "로그아웃 되었습니다.",
  });
  router.push("/"); // 메인 페이지로 이동
}
</script>

<template>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="description" content="" />
    <meta name="author" content="" />
    <title>Agency - Start Bootstrap Theme</title>
    <!-- Favicon-->
    <link rel="icon" type="image/x-icon" href="./assets/favicon.ico" />
    <!-- Font Awesome icons (free version)-->
    <!-- Google fonts-->
    <link
      href="https://fonts.googleapis.com/css?family=Montserrat:400,700"
      rel="stylesheet"
      type="text/css"
    />
    <link
      href="https://fonts.googleapis.com/css?family=Roboto+Slab:400,100,300,700"
      rel="stylesheet"
      type="text/css"
    />
  </head>
  <body id="page-top">
    <!-- Navigation-->
    <nav
      class="navbar navbar-expand-lg navbar-dark fixed-top"
      id="mainNav"
      style="height: 10vh; background-color: white"
    >
      <div class="container">
        <a class="navbar-brand" href="/">PLAN-IT</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarResponsive"
          aria-controls="navbarResponsive"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          Menu
          <i class="fas fa-bars ms-1"></i>
        </button>
        <div class="collapse navbar-collapse" id="navbarResponsive">
          <ul class="navbar-nav text-uppercase ms-auto py-4 py-lg-0">
            <li class="nav-item">
              <a class="nav-link" href="/attraction">Attraction</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/plan">Plan</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/hotplace">Hotplace</a>
            </li>
            <li class="nav-item">
              <router-link :to="{ name: 'board' }" class="nav-link">Board</router-link>
            </li>
            <li v-if="isLogin" class="nav-item">
              <a v-if="isAdmin" class="nav-link" href="/admin/list">Admin</a>
              <a v-if="!isAdmin" class="nav-link" href="/mypage">Mypage</a>
            </li>
            <li class="nav-item">
              <a v-if="!isLogin" class="nav-link" href="/login">Login</a>
              <a v-if="isLogin" class="nav-link" href="#" v-on:click="logout()">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </body>
</template>

<style scoped></style>

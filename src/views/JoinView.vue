<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const moveLogin = () => {
  router.push("/login");
};
const register = () => {};
</script>

<template>
  <div class="container-fluid pt-5" style="height: 75vh">
    <section class="container" style="height: 300px">
      <div
        class="container w-50 mt-5 p-3 border border-1 border-secondary rounded-4"
      >
        <div class="masthead-subheading mt-3" style="text-align: center">
          JOIN
        </div>
        <form id="form-login" method="POST" action="">
          <input type="hidden" name="action" value="join" />
          <div class="form-floating m-3">
            <input
              type="text"
              class="form-control"
              id="id"
              placeholder="Enter email"
              name="id"
            />
            <label for="id">ID</label>
          </div>
          <div class="form-floating m-3">
            <input
              type="password"
              class="form-control"
              id="password"
              placeholder="Enter password"
              name="password"
            />
            <label for="pwd">Password</label>
          </div>
          <div class="form-floating m-3">
            <input
              type="text"
              class="form-control"
              id="name"
              placeholder="Enter name"
              name="name"
            />
            <label for="name">Name</label>
          </div>
          <div class="form-floating m-3">
            <input
              type="text"
              class="form-control"
              id="email"
              placeholder="Enter email"
              name="email"
            />
            <label for="email">Email</label>
          </div>

          <div class="form-floating m-3 d-flex justify-content-end">
            <button
              type="button"
              class="btn btn-outline-secondary m-3"
              id="btn-login"
              @click="moveLogin()"
            >
              취소
            </button>
            <button
              type="button"
              class="btn btn-outline-secondary m-3"
              id="btn-go-to-index"
              @click="register()"
            >
              가입하기
            </button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<style scoped></style>

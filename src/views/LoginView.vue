<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const moveJoin = () => {
  router.push("/join");
};
</script>

<template>
  <div class="container-fluid pt-5" style="height: 75vh">
    <section class="container" style="height: 300px">
      <div
        class="container w-50 mt-5 p-3 border border-1 border-secondary rounded-4"
      >
        <div class="masthead-subheading mt-3" style="text-align: center">
          LOGIN
        </div>
        <form id="form-login" method="POST" action="">
          <input type="hidden" name="action" value="login" />
          <div class="form-floating m-3">
            <input
              type="text"
              class="form-control"
              id="id"
              placeholder="Enter id"
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
          <div class="form-floating m-3 d-flex justify-content-end">
            <button
              type="button"
              class="btn btn-outline-secondary m-3"
              id="btn-login"
            >
              로그인
            </button>
            <button
              type="button"
              class="btn btn-outline-secondary m-3"
              id="btn-go-to-index"
              @click="moveJoin()"
            >
              회원가입
            </button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<style scoped></style>

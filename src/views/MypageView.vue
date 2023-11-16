<script setup>
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { userStore } from "@/stores/userPiniaStore";
import { deleteMember } from "@/api/member";

const router = useRouter();
const ustore = userStore();

const userInfo = reactive({
  userId: ustore.userInfo.userId,
  userName: ustore.userInfo.userName,
  userPw: ustore.userInfo.userPw,
  userEmail: ustore.userInfo.userEmail,
});

async function modify() {
  await ustore.modifyUserInfo(userInfo);
  router.push({ name: "mypage" });
}

async function onDelete() {
  deleteMember(ustore.userInfo.userId);
  await ustore.userLogout(ustore.userInfo.userId);
  router.push("/");
}
</script>

<template>
  <div class="container-fluid pt-5" style="height: 75vh">
    <section class="container" style="height: 300px">
      <div class="container w-50 mt-5 p-3 border border-1 border-secondary rounded-4">
        <div class="masthead-subheading mt-3" style="text-align: center">MYPAGE</div>
        <form id="form-login" @submit.prevent="onSubmit">
          <div class="form-floating m-3">
            <input
              type="text"
              class="form-control"
              id="id"
              placeholder="Enter email"
              name="id"
              v-model="userInfo.userId"
              readonly
              style="border: none"
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
              v-model="userInfo.userPw"
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
              v-model="userInfo.userName"
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
              v-model="userInfo.userEmail"
            />
            <label for="email">Email</label>
          </div>

          <div class="form-floating m-3 d-flex justify-content-end">
            <button
              type="submit"
              class="btn btn-outline-secondary m-3"
              id="btn-go-to-index"
              @click="modify()"
            >
              수정하기
            </button>
            <button type="button" class="btn btn-outline-secondary m-3" @click="onDelete()">
              회원탈퇴
            </button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<style scoped></style>

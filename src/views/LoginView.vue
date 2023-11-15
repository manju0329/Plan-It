<script setup>
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { userStore } from "@/stores/userPiniaStore";

const router = useRouter();
const ustore = userStore();

const user = reactive({
  userId: "",
  userPw: "",
});
const error = reactive({
  message: "",
});

//쿠키에서 저장된 아이디가 있으면 가져오는 함수
async function getIDByCookie() {
  const cookies = document.cookie;
  const cookieArray = cookies.split("; ");
  console.log(cookieArray);
  for (let i = 0; i < cookieArray.length; i++) {
    const cookie = cookieArray[i].split("=");
    const key = cookie[0];
    const value = cookie[1];

    if (key === "id") {
      user.id = value;
    }
  }
}

//아이디를 쿠키에 저장하는 함수
async function storeIDByCookie(id) {
  const cookies = document.cookie;
  const cookieArray = cookies.split("; ");
  document.cookie = `id=${id}`;
}

async function signIn() {
  console.log("clicked!!!");

  await ustore.userConfirm(user);
  let token = sessionStorage.getItem("access-token");
  console.log("1. confirm() token >> " + token);
  if (ustore.isLogin) {
    await ustore.getUserInfo(token);
    router.push("/"); // 메인 페이지로 이동
  } else {
    error.message = "아이디 또는 비밀번호가 잘못되었습니다.";
  }
}

const moveJoin = () => {
  router.push("/join");
};
</script>

<template>
  <div class="container-fluid pt-5" style="height: 75vh">
    <section class="container" style="height: 300px">
      <div class="container w-50 mt-5 p-3 border border-1 border-secondary rounded-4">
        <div class="masthead-subheading mt-3" style="text-align: center">LOGIN</div>
        <form id="form-login" @submit.prevent>
          <input type="hidden" name="action" value="login" />
          <div class="form-floating m-3">
            <input
              type="text"
              class="form-control"
              id="id"
              placeholder="Enter id"
              name="id"
              v-model="user.userId"
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
              v-model="user.userPw"
            />
            <label for="pwd">Password</label>
          </div>
          <div class="form-floating m-3 d-flex justify-content-end">
            <button
              type="button"
              class="btn btn-outline-secondary m-3"
              id="btn-login"
              @click="signIn()"
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

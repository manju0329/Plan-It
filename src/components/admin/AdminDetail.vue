<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { detailMember, deleteMember } from "@/api/member";

const route = useRoute();
const router = useRouter();

const { userId } = route.params;

const member = ref({});

onMounted(() => {
  getMember();
});

const getMember = () => {
  // API 호출
  detailMember(
    userId,
    ({ data }) => {
      console.log(data);
      member.value = data;
      console.log(member);
    },
    (error) => {
      console.log(error);
    }
  );
};

function moveList() {
  router.push({ name: "member-list" });
}

function onDeleteMember() {
  // API 호출
  deleteMember(userId, moveList());
}
</script>

<template>
  <div class="container">
    <div class="row justify-content-center mt-5">
      <div class="container w-50 mt-5 p-3 border border-1 border-secondary rounded-4">
        <div class="masthead-subheading mt-3" style="text-align: center">MEMBER INFO</div>
        <div class="col-lg-10 text-start mt-5">
          <div class="row">
            <div class="form-floating m-3">
              <input
                type="text"
                class="form-control"
                id="id"
                name="id"
                :value="member.userId"
                readonly
              />
              <label for="id">ID</label>
            </div>
            <div class="form-floating m-3">
              <input
                type="text"
                class="form-control"
                id="password"
                placeholder="Enter password"
                name="password"
                :value="member.userPw"
                readonly
              />
              <label for="pwd">Password</label>
            </div>
            <div class="form-floating m-3">
              <input
                type="text"
                class="form-control"
                id="name"
                name="name"
                :value="member.userName"
                readonly
              />
              <label for="name">Name</label>
            </div>
            <div class="form-floating m-3">
              <input
                type="text"
                class="form-control"
                id="email"
                name="email"
                :value="member.userEmail"
                readonly
              />
              <label for="email">Email</label>
            </div>
            <div class="form-floating m-3">
              <input
                type="text"
                class="form-control"
                id="joindate"
                name="joindate"
                :value="member.joinDate"
                readonly
              />
              <label for="joindate">JoinDate</label>
            </div>
            <div class="form-floating m-3">
              <input
                type="text"
                class="form-control"
                id="role"
                name="role"
                :value="member.userRole"
                readonly
              />
              <label for="role">Role</label>
            </div>
            <div class="divider mt-3 mb-3"></div>
            <div class="d-flex justify-content-end">
              <button type="button" class="btn btn-outline-primary mb-3" @click="moveList">
                이전으로
              </button>
              <button
                type="button"
                class="btn btn-outline-danger mb-3 ms-1"
                @click="onDeleteMember"
              >
                탈퇴
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

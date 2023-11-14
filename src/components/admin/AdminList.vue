<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { listMember } from "@/api/member";

import MemberListItem from "@/components/admin/AdminListItem.vue";
import PageNavigation from "@/components/common/PageNavigation.vue";

const router = useRouter();

const members = ref([]);
const currentPage = ref(1);
const totalPage = ref(0);
const { VITE_ARTICLE_LIST_SIZE } = import.meta.env;
const param = ref({
  pgno: currentPage.value,
  spp: VITE_ARTICLE_LIST_SIZE,
  key: "",
  word: "",
});

onMounted(() => {
  getMemberList();
});

const getMemberList = () => {
  console.log("멤버에서 글목록 얻어오자!!!", param.value);
  // API 호출
  listMember(
    param.value,
    ({ data }) => {
      members.value = data;
      currentPage.value = data.currentPage;
      totalPage.value = data.totalPageCount;
    },
    (error) => {
      console.log(error);
    }
  );
};

const onPageChange = (val) => {
  currentPage.value = val;
  param.value.pgno = val;
  getMemberList();
};
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10 mt-5">
        <table class="table table-hover">
          <thead>
            <tr class="text-center">
              <th scope="col">아이디</th>
              <th scope="col">이름</th>
              <th scope="col">이메일</th>
              <th scope="col">가입일</th>
              <th scope="col">권한</th>
            </tr>
          </thead>
          <tbody>
            <MemberListItem
              v-for="member in members"
              :key="member.userId"
              :member="member"
            ></MemberListItem>
          </tbody>
        </table>
      </div>
      <PageNavigation
        :current-page="currentPage"
        :total-page="totalPage"
        @pageChange="onPageChange"
      ></PageNavigation>
    </div>
  </div>
</template>

<style scoped></style>

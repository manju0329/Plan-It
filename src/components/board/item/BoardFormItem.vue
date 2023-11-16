<script setup>
import { ref, watch } from "vue";
import { registArticle, getModifyArticle, modifyArticle } from "@/api/board";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "@/stores/userPiniaStore";

const router = useRouter();
const route = useRoute();
const ustore = userStore();
const props = defineProps({ type: String });

const isUseId = ref(false);

const article = ref({
  articleNo: 0,
  subject: "",
  content: "",
  userId: "",
  userName: "",
  hit: 0,
  registerTime: "",
});

if (props.type === "modify") {
  let { articleno } = route.params;
  console.log(articleno + "번글 얻어와서 수정할거야");
  // API 호출 -> 수정할 글 정보 가져오기
  getModifyArticle(articleno, ({ data }) => {
    console.log("가져온 글 : ", data);
    article.value = data;
  });
  isUseId.value = true;
}

const subjectErrMsg = ref("");
const contentErrMsg = ref("");
watch(
  () => article.value.subject,
  (value) => {
    let len = value.length;
    if (len == 0 || len > 30) {
      subjectErrMsg.value = "제목을 확인해 주세요!!!";
    } else subjectErrMsg.value = "";
  },
  { immediate: true }
);
watch(
  () => article.value.content,
  (value) => {
    let len = value.length;
    if (len == 0 || len > 500) {
      contentErrMsg.value = "내용을 확인해 주세요!!!";
    } else contentErrMsg.value = "";
  },
  { immediate: true }
);

function onSubmit() {
  // event.preventDefault();

  if (subjectErrMsg.value) {
    alert(subjectErrMsg.value);
  } else if (contentErrMsg.value) {
    alert(contentErrMsg.value);
  } else {
    props.type === "regist" ? writeArticle() : updateArticle();
  }
}

function writeArticle() {
  console.log(props);
  console.log("글등록하자!!", article.value);
  console.log("-----------------");
  // API 호출
  console.log(ustore.userInfo.userId);
  article.subject = article.value.subject;
  article.content = article.value.content;
  article.value.userId = ustore.userInfo.userId;
  console.log("write : ", article.value);
  registArticle(article.value);
}

function updateArticle() {
  console.log(article.value.articleNo + "번글 수정하자!!", article.value);
  // API 호출
  modifyArticle(article.value, moveList());
}

function moveList() {
  router.push({ name: "article-list" });
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div class="mb-3">
      <label for="subject" class="form-label">제목 : </label>
      <input type="text" class="form-control" v-model="article.subject" />
    </div>
    <div class="mb-3">
      <label for="content" class="form-label">내용 : </label>
      <textarea class="form-control" v-model="article.content" rows="10"></textarea>
    </div>
    <div class="form-floating m-3 d-flex justify-content-end">
      <button type="submit" class="btn btn-outline-secondary mb-3" v-if="type === 'regist'">
        글작성
      </button>
      <button type="submit" class="btn btn-outline-secondary mb-3" v-else>글수정</button>
      <button type="button" class="btn btn-outline-secondary mb-3 ms-1" @click="moveList">
        목록
      </button>
    </div>
  </form>
</template>

<style scoped></style>

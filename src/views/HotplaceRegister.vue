<script setup>
import { ref, onMounted, reactive } from "vue";
import { userStore } from "@/stores/userPiniaStore";
import { planStore } from "@/stores/planPiniaStore";
import { useRouter } from "vue-router";
import { writehotplaceFile, writehotplace } from "@/api/hotplace";
const router = useRouter();
const ustore = userStore();
const pstore = planStore();
const serviceKey = import.meta.env.VITE_OPEN_API_SERVICE_KEY;
const contentList = ref([]);
const realContent = ref([]);
const selectedContentId = ref(null);

const image = reactive({
  file: null,
  preview: null,
});
const onInputImg = (e) => {
  image.file = e.target.files[0];
  image.preview = URL.createObjectURL(image.file);
  console.log(image);
};

const hotplace = ref({
  content: " ",
  contentId: "",
  contentName: "",
  gugunCode: "",
  sidoCode: "",
  title: " ",
  userId: "",
});

onMounted(async () => {
  contentList.value = pstore.plans;
  console.log(contentList);
  realContent.value = await fetchContent();
  hotplace.value.userId = ustore.userInfo.userId;
});

// 공공데이터 contentTypeId 호출
async function fetchContent() {
  const result = {}; // 배열이 아닌 객체로 초기화
  console.log(contentList.value.length);
  for (var i = 0; i < contentList.value.length; i++) {
    try {
      const url = `https://apis.data.go.kr/B551011/KorService1/detailCommon1?MobileOS=ETC&MobileApp=AppTest&_type=json&areacodeYN=Y&contentId=${contentList.value[i].contentId}&defaultYN=Y&firstImageYN=Y&addrinfoYN=Y&overviewYN=Y&serviceKey=${serviceKey}`;
      console.log(url);
      const response = await fetch(url);
      const data = await response.json();

      const resultJson = data.response.body.items.item[0];
      //realContent에 contentId를 key로 하는 객체를 추가
      result[i] = {
        title: resultJson.title,
        content: resultJson.contentid,
        sido: resultJson.areacode,
        gugun: resultJson.sigungucode,
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }
  return result;
}

function back() {
  window.history.go(-1);
}

async function onSubmit() {
  const info = realContent.value[selectedContentId.value];
  hotplace.value.contentId = info.content;
  hotplace.value.contentName = info.title;
  hotplace.value.gugunCode = info.gugun;
  hotplace.value.sidoCode = info.sido;
  console.log(hotplace.value);

  const num = await writehotplace(hotplace.value);
  console.log(num);
  const formData = new FormData();
  formData.append("upfile", image.file);
  formData.append("hotplaceNo", num);
  await writehotplaceFile(formData);
  router.push("/hotplace");
}
</script>

<template>
  <div style="height: 12vh"></div>
  <div class="container">
    <div class="row">
      <div class="col-md-7">
        <div class="mb-3 flex">
          <h4
            class="modal-title fw-bold mb-4"
            style="text-align: center; border-bottom: 3px solid #ffc800"
          >
            후기 등록
          </h4>
        </div>
        <form @submit.prevent="onSubmit">
          <div class="mb-3 flex">
            <div>
              <div class="form-floating m-3">
                <select
                  v-model="selectedContentId"
                  class="form-select"
                  id="contentSelect"
                  style="
                    border-radius: 0;
                    border: none;
                    border-bottom: 1px solid lightgray !important;
                  "
                >
                  <option
                    v-for="(content, index) in realContent"
                    :key="index"
                    :value="index"
                    style="padding: 1%"
                  >
                    {{ content.title }}
                  </option>
                </select>
                <label for="contentSelect">장소</label>
              </div>

              <div class="form-floating m-3">
                <input
                  type="text"
                  class="form-control"
                  id="id"
                  placeholder="Enter email"
                  name="id"
                  v-model="hotplace.title"
                  style="
                    border-radius: 0;
                    border: none;
                    border-bottom: 1px solid lightgray !important;
                  "
                />
                <label for="id">제목</label>
              </div>

              <div class="form-floating m-3">
                <input
                  type="text"
                  class="form-control"
                  id="id"
                  placeholder="Enter email"
                  name="id"
                  :value="ustore.userInfo.userId"
                  readonly
                  style="
                    border-radius: 0;
                    border: none;
                    border-bottom: 1px solid lightgray !important;
                  "
                />
                <label for="id">작성자</label>
              </div>
              <div class="form-floating m-3">
                <input
                  type="textfield"
                  class="form-control"
                  id="email"
                  placeholder="Enter email"
                  name="email"
                  v-model="hotplace.content"
                  style="
                    border-radius: 0;
                    border: none;
                    border-bottom: 1px solid lightgray !important;
                    height: 20vh;
                  "
                />
                <label for="email">내용</label>
              </div>

              <div
                class="form-floating m-3 p-4"
                style="
                  border-radius: 0;
                  border: none;
                  border-bottom: 1px solid lightgray !important;
                "
              >
                <input
                  type="file"
                  class="form-control"
                  id="file"
                  name="file"
                  @change="onInputImg"
                  style="border: none"
                />
                <label for="file" class="mb-2">파일 업로드</label>
              </div>

              <div class="form-floating m-3 d-flex justify-content-end">
                <button
                  type="button"
                  class="btn btn-outline-secondary m-3"
                  id="btn-login"
                  @click="back"
                >
                  이전으로
                </button>
                <button type="submit" class="btn btn-outline-secondary m-3" id="btn-go-to-index">
                  등록하기
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="col-lg-5">
        <div
          class="d-flex justify-content-center align-items-center"
          style="width: 100%; height: 100%"
        >
          <img :src="image.preview" class="img-fluid" @click="test" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h4 {
  border-bottom: 5px solid #ffc800;
  color: black;
}
</style>

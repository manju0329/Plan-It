<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { findOne, like, dislike, isLike, getFiles } from "@/api/hotplace";
import { userStore } from "@/stores/userPiniaStore";

const ustore = userStore();
const route = useRoute();
const router = useRouter();

const hotplaceNo = ref(route.params.hotplaceno);
const hotplace = ref({});
const flag = ref(false);

var folder = ref("231120");
var file = ref("0e59bc9f-f446-48bc-90fc-b98840fb83de.png");

const loadData = async () => {
  try {
    const response = await findOne(hotplaceNo.value);

    hotplace.value = response.data.hotplace;
    console.log(hotplace.value);
    hotplace.value.date = hotplace.value.date.slice(0, 10);
    file.value = hotplace.value.path;
    folder.value =
      hotplace.value.date.slice(2, 4) +
      hotplace.value.date.slice(5, 7) +
      hotplace.value.date.slice(8, 10);
    console.log(file.value + " " + folder.value);

    const cnt = await isLike({
      userId: ustore.userInfo.userId,
      hotplaceNo: hotplace.value.hotplaceNo,
    });
    console.log(cnt.data.cnt);
    if (cnt.data.cnt != 0) flag.value = true;
    console.log(flag);
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  loadData();
});

const back = () => {
  router.push({ name: "hotplace" });
};

const toggle1 = async () => {
  flag.value = true;
  await like({
    userId: ustore.userInfo.userId,
    hotplaceNo: hotplaceNo.value,
  });
  hotplace.value.recommendation = hotplace.value.recommendation + 1;
};

const toggle2 = async () => {
  console.log("toggle2");
  flag.value = false;
  await dislike({
    userId: ustore.userInfo.userId,
    hotplaceNo: hotplaceNo.value,
  });
  hotplace.value.recommendation = hotplace.value.recommendation - 1;
};
</script>
<template>
  <div style="height: 15vh"></div>
  <div class="container">
    <div class="row">
      <div class="col-md-7">
        <div class="mb-3 flex">
          <h4
            class="modal-title fw-bold mb-4"
            style="text-align: center; border-bottom: 3px solid #ffc800"
          >
            {{ hotplace.title }}
          </h4>
          <div class="d-flex justify-content-end" style="position: relative; width: 98%">
            <img
              src="@/assets/img/heart-svgrepo-com.svg"
              style="width: 20px; height: 20px; display: inline; margin-right: 5px"
            />
            <p style="position: relative; display: inline">
              {{ hotplace.recommendation }}
            </p>
          </div>
          <div>
            <div class="form-floating m-3">
              <input
                type="text"
                class="form-control"
                id="id"
                placeholder="Enter email"
                name="id"
                v-model="hotplace.userId"
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
                type="text"
                class="form-control"
                id="password"
                placeholder="Enter password"
                name="password"
                v-model="hotplace.date"
                style="
                  border-radius: 0;
                  border: none;
                  border-bottom: 1px solid lightgray !important;
                "
              />
              <label for="pwd">작성일</label>
            </div>
            <div class="form-floating m-3">
              <input
                type="text"
                class="form-control"
                id="name"
                placeholder="Enter name"
                name="name"
                v-model="hotplace.contentName"
                style="
                  border-radius: 0;
                  border: none;
                  border-bottom: 1px solid lightgray !important;
                "
              />
              <label for="name">장소</label>
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
            <div class="form-floating m-3 d-flex justify-content-end">
              <button
                type="button"
                class="btn btn-outline-secondary m-3"
                id="btn-back"
                @click="back()"
                style="
                  border-radius: 0;
                  border: none;
                  border-bottom: 1px solid lightgray !important;
                "
              >
                이전으로
              </button>
              <button
                v-if="!flag"
                type="button"
                class="btn btn-outline-secondary m-3"
                id="btn-back"
                @click="toggle1()"
                style="
                  border-radius: 0;
                  border: none;
                  border-bottom: 1px solid lightgray !important;
                "
              >
                좋아요
              </button>
              <button
                v-if="flag"
                type="button"
                class="btn btn-outline-secondary m-3"
                id="btn-back"
                @click="toggle2()"
                style="
                  background-color: lightgray;
                  color: white;
                  border-radius: 0;
                  border: none;
                  border-bottom: 1px solid lightgray !important;
                "
              >
                좋아요
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-5 mt-5 text-center">
        <div class="d-flex justify-content-center align-items-center" style="height: 85%">
          <img
            :src="`http://localhost:8080/enjoytrip/hotplace/${folder}/${file}`"
            class="img-fluid"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 필요한 스타일링을 여기에 추가 */
</style>

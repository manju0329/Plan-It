<script setup>
import planWriteList from "./planHotPlaceWriteList.vue";
import planWriteMap from "./planHotPlaceWriteMap.vue";
import planWriteSearch from "./planHotPlaceWriteSearch.vue";
import planWriteAttr from "./planHotPlaceWriteAttr.vue";
import { useRouter } from "vue-router";
import { ref, computed, onMounted, reactive, withModifiers } from "vue";
import { useQuery } from "@tanstack/vue-query";
import Swal from "sweetalert2";
import { userStore } from "@/stores/userPiniaStore";
import { planStore } from "@/stores/planPiniaStore";
import { writeNewPlan, nameCheck } from "@/api/plan";
import { V_ON_WITH_MODIFIERS } from "@vue/compiler-dom";

const ustore = userStore();
const router = useRouter();
const pstore = planStore();

const select = ref({
  sido: "",
  gugun: "",
  type: "",
  search: "",
});

//알림창 설정
// 예시 : Swal.fire({
//   title: 'Are you sure?',
//   text: "You won't be able to revert this!",
//   icon: 'warning',
//   showCancelButton: true,
//   confirmButtonColor: '#3085d6',
//   cancelButtonColor: '#d33',
//   confirmButtonText: 'Yes, delete it!'
// }).then((result) => {
//   if (result.isConfirmed) {
//     Swal.fire(
//       'Deleted!',
//       'Your file has been deleted.',
//       'success'
//     )
//   }
// })
const msg = Swal.mixin({
  toast: true,
  position: "center",
  showConfirmButton: true,
});

const msg2 = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});
const totalPage = ref(1);
const page = ref(1);
const perPage = 12;

const startDate = ref("");
const endDate = ref("");
const minDate = ref(getFormattedDate(new Date()));
const minDateEnd = ref("");

// 날짜를 'YYYY-MM-DD' 형식의 문자열로 변환하는 함수
function getFormattedDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const startSelect = (event) => {
  startDate.value = event.target.value;
  console.log(startDate.value);
  minDateEnd.value = startDate.value;
};

const endSelect = (event) => {
  console.log(event.target.value);
  endDate.value = event.target.value;
};

const planCategory = ref(-1);
const categorySelect = (event) => {
  console.log(event.target.value);
  planCategory.value = event.target.value;
};

const path = ref([]);
const PathInfo = (array) => {
  console.log("전달받은 경로 : ");
  console.log(array);
  path.value.splice(0);
  path.value = array;
  console.log(path.value);
  console.log(path.value[0]);
};

const totp = (t) => Math.ceil(t);

// const props = defineProps({
//   moveMap: {
//     type: Object,
//     default: () => ({
//       mapx: "",
//       mapy: "",
//     }),
//   },
// });
const newXY = ref([]);
const mapClick = (array) => {
  newXY.value.splice(0);
  newXY.value.push(array.mapx);
  newXY.value.push(array.mapy);
  console.log("mapXY :" + array.mapx);
  console.log(newXY[0] + " " + newXY[1]);
};

const newAttr = ref({});
const planList = ref([]);
const addPlan = (data) => {
  //const tmp = {};
  console.log("추가할 장소 : ");
  console.log(data);
  newAttr.value.title = data.title;
  newAttr.value.mapx = data.mapx;
  newAttr.value.mapy = data.mapy;
  newAttr.value.contentid = data.contentid;
  newAttr.value.image = data.firstimage;
  newAttr.value.addr = data.addr1;
  // tmp.title = data.title;
  // tmp.mapx = data.mapx;
  // tmp.mapy = data.mapy;
  // tmp.contentid = data.contentid;
  console.log("newAttr : ");
  console.log(newAttr);
  // planList.push(tmp);
  // console.log("list : ")
  // console.log(planList);
};

const planName = ref("");
const writePlan = () => {
  if (planName.value == "") {
    console.log("No planName");
    msg.fire({
      icon: "error",
      title: "여행 제목을 입력해주세요.",
    });
  } else if (startDate.value == "") {
    msg.fire({
      icon: "error",
      title: "여행 시작 날짜를 선택해주세요.",
    });
  } else if (endDate.value == "") {
    msg.fire({
      icon: "error",
      title: "여행 종료 날짜를 선택해주세요.",
    });
  } else if (planCategory.value == -1) {
    msg.fire({
      icon: "error",
      title: "여행 카테고리를 선택해주세요.",
    });
  } else if (planList.value.length == 0) {
    msg.fire({
      icon: "error",
      title: "계획에 추가된 관광지가 없습니다.",
      width: "30%",
    });
  } else {
    let cnt = -1;
    nameCheck(planName.value)
      .then((data) => {
        // 성공 시 로직
        console.log("성공", data);
        if (data > 0) {
          msg.fire({
            icon: "error",
            title: "중복된 여행 제목입니다!",
          });
        } else {
          console.log(planName.value);
          console.log("추가될 플랜리스트 : ");
          console.log(planList.value);
          console.log(planList.value.length);
          for (let i = 0; i < planList.value.length; i++) {
            console.log(planList.value[i].Target);
            //userId : ustore.userInfo.userId
            planList.value[i].planId = 0;
            planList.value[i].planName = planName.value;
            planList.value[i].userId = ustore.userInfo.userId;
            planList.value[i].categoryId = planCategory.value;
            planList.value[i].startDate = startDate.value;
            planList.value[i].endDate = endDate.value;
          }
          console.log(planList.value);
          writeNewPlan(
            planList.value,
            () => {
              msg
                .fire({
                  icon: "success",
                  title: "여행을 등록했습니다!",
                })
                .then(router.push({ name: "plan-list" }));
            },
            (error) => {
              console.log(error);
            }
          );
        }
      })
      .catch((error) => {
        // 실패 시 로직
        console.error("에러", error);
      });
    console.log(cnt);
  }
};

const newList = (list) => {
  console.log("전달된 플랜리스트 : ");
  planList.value = list;
  console.log(planList);
  console.log(list);
  console.log(planList.value);
  console.log(typeof planList.value);
  console.log(Array.isArray(planList.value));
  console.log(Array.isArray(list));
};

const delData = ref(0);
const deleteList = (data) => {
  console.log("삭제한 관광지 :");
  console.log(data);
  delData.value = data;
};

const changeSido = (sido) => {
  select.value.sido = sido;
  page.value = 1;
};
const changeGugun = (gugun) => {
  select.value.gugun = gugun;
  page.value = 1;
};
const changeType = (type) => {
  select.value.type = type;
  page.value = 1;
};

const sidocode = computed(() => select.value?.sido);
const guguncode = computed(() => select.value?.gugun);
const typecode = computed(() => select.value?.type);
const search = computed(() => select.value?.search);
const enabled = computed(
  () =>
    (!!select.value?.sido && !!select.value?.gugun && !!select.value?.type) ||
    (!!select.value?.search && select.value?.search.length >= 2)
);

const { data: list } = useQuery({
  queryKey: ["attraction", sidocode, guguncode, typecode, search, page],
  queryFn: () =>
    fetchAttraction(sidocode.value, guguncode.value, typecode.value, search.value, page.value),
  enabled,
});

// 공공데이터 서비스 키
const serviceKey = import.meta.env.VITE_API_SERVICE_KEY;

// // 공공데이터 여행지 호출
async function fetchAttraction(areaCode, gugunCode, contentTypeId, keyword, page) {
  let searchUrl = keyword
    ? `https://apis.data.go.kr/B551011/KorService1/searchKeyword1?serviceKey=${serviceKey}&contentTypeId=${contentTypeId}&areaCode=${areaCode}&sigunguCode=${gugunCode}&MobileOS=ETC&MobileApp=TestApp&_type=json&numOfRows=${perPage}&keyword=${keyword}&pageNo=${page}`
    : `https://apis.data.go.kr/B551011/KorService1/areaBasedList1?serviceKey=${serviceKey}&contentTypeId=${contentTypeId}&areaCode=${areaCode}&sigunguCode=${gugunCode}&MobileOS=ETC&MobileApp=TestApp&_type=json&numOfRows=${perPage}&pageNo=${page}`;
  const response = await fetch(searchUrl);
  const data = await response.json();
  const item = await data.response.body.items.item;

  totalPage.value = ((await data.response.body.totalCount) - 1) / perPage + 1;
  if (!item || item.length == 0) {
    if (!keyword) {
      console.log("검색 결과 없읍니다요");
      msg2.fire({
        icon: "info",
        title: "검색 결과가 없습니다",
      });
    }
    return [];
  }
  return data.response.body.items.item;
}

onMounted(async () => {
  if (pstore.hotplacePlan != null) {
    console.log("start!");
    // Assuming hotplacePlan is an array of items in pstore
    for (const hotplaceItem of pstore.hotplacePlan) {
      try {
        // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint you want to use
        const response = await fetch(
          `https://apis.data.go.kr/B551011/KorService1/detailCommon1?MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${hotplaceItem.contentId}&defaultYN=Y&firstImageYN=Y&addrinfoYN=Y&mapinfoYN=Y&serviceKey=${serviceKey}`
        );
        const res = await response.json();
        const data = res.response.body.items.item;
        console.log(data[0]);
        planList.value.push({
          contentTitle: data[0].title,
          mapX: data[0].mapx,
          mapY: data[0].mapy,
          contentId: data[0].contentid,
          image: data[0].firstimage,
          addr: data[0].addr1,
        });
      } catch (error) {
        console.error(`Error fetching data for hotplaceItem ${hotplaceItem.id}: ${error.message}`);
      }
    }
    console.log(planList.value);
  }
});
</script>

<template>
    <div class="container text-center mt-3">
      <div class="alert alert-info" role="alert">자유롭게 계획하는 공간</div>
        <div class="plan-container">
        <planWriteSearch
          :select="select"
          @changeSido="changeSido"
          @changeGugun="changeGugun"
          @changeType="changeType"
        />
        <div class="containter">
          <div class="row">
            <div class="col-md-3">
              <planWriteAttr :list="list" @mapClick="mapClick" @addPlan="addPlan" />
            </div>
            <div class="col-md-6">
              <planWriteMap
                :list="list"
                :newXY="newXY"
                :delData="delData"
                :planList="planList"
                @PathInfo="PathInfo"
              />
            </div>
            <div class="col-md-3">
              <planWriteList
                :newAttr="newAttr"
                :path="path"
                @newList="newList"
                @deleteList="deleteList"
              />
            </div>
          </div>
        </div>
        <div>
          <form class="form-inline">
            <div class="form-group">
              <div class="input-group">
                <select v-model="planCategory" class="form-control" @change="categorySelect">
                  <option value="-1">&nbsp;&nbsp;&nbsp;&nbsp;카테고리</option>
                  <option value="1">레포츠</option>
                  <option value="2">낚시</option>
                  <option value="3">체험/축제</option>
                  <option value="4">여가</option>
                  <option value="5">맛집</option>
                </select>
                <input
                  type="date"
                  :min="minDate"
                  v-model="startDate"
                  @input="startSelect"
                  data-placeholder="시작날짜"
                  class="form-control"
                  required
                />
                &nbsp;&nbsp;~ &nbsp;&nbsp;
                <input
                  type="date"
                  :min="minDateEnd"
                  v-model="endDate"
                  @input="endSelect"
                  data-placeholder="종료날짜"
                  class="form-control"
                  required
                />
                <input
                  type="text"
                  class="form-control"
                  v-model="planName"
                  id="planName"
                  placeholder="   계획 이름"
                />
                <button type="submit" class="btn btn-warning" @click.self.prevent="writePlan">
                  추가하기
                </button>
              </div>
            </div>
            <div class="path">
              전체 소요시간 :
              {{ path.length == 0 ? 0 : planList.length < 2 ? 0 : Math.round(path[0].duration / 60) }}
              분 <br />
              전체 거리 : {{ path.length == 0 ? 0 : planList.length < 2 ? 0 : path[0].distance }} M
            </div>
          </form>
        </div>
    </div>
  </div>
  
</template>

<style scoped>
.path {
  display: flex;
  justify-content: right;
  align-items: right;
  text-align: center;
  padding: 10px;
  margin-top: 0;
  box-sizing: border-box;
  border-radius: 20px;
  border: solid 5px;
  border-color: #fcba03;
}
.form-group {
  width: 50%;
  margin-right: 12%;
  margin-left: 0;
}
.form-inline {
  width: 100%;
  margin-left: 6%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.input-group {
  width: 100%;
  margin-left: 13%;
}

.plan-container {
  display: flex;
  justify-content: left;
  align-items: left;
  flex-direction: column;
  margin-top: 10vh;
}
input[type="date"] {
  position: relative;
  padding: 10px;
  text-align: center;
  font-size: 100%;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  position: absolute;
  width: 100%;
  height: 100%;
  background: transparent;
  color: transparent;
  cursor: pointer;
}

input[type="date"]::before {
  content: attr(data-placeholder);
  width: 100%;
  height: 100%;
}

input[type="date"]::before {
  color: gray;
}
input[type="date"]:valid::before {
  display: none;
}
</style>

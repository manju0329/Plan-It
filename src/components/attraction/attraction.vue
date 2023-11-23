<script setup>
import { ref, computed, watch } from "vue";
import { useQuery } from "@tanstack/vue-query";
import AttrMap from "./attractionMap.vue";
import AttrSearch from "./attractionSearch.vue";
import Swal from 'sweetalert2';
import AttrDetailList from "./attractionDetailList.vue";

const select = ref({
  sido: "",
  gugun: "",
  type: "",
  search: "",
});

const msg = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer : 3000,
  timerProgressBar : true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

const totalPage = ref(1);
const page = ref(1);
const perPage = 12;

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
  console.log(newXY[0] +  " " + newXY[1]);
}

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
    (!!select.value?.search && select.value?.search.length >= 2),
);

const { data: list } = useQuery({
  queryKey: ["attraction", sidocode, guguncode, typecode, search, page],
  queryFn: () =>
    fetchAttraction(
      sidocode.value,
      guguncode.value,
      typecode.value,
      search.value,
      page.value,
    ),
  enabled,
});
watch(list, (newValue) =>{
  console.log("change");
  console.log(newValue);
}, {deep : true});
// 공공데이터 서비스 키
const serviceKey =import.meta.env.VITE_API_SERVICE_KEY;

// // 공공데이터 여행지 호출
async function fetchAttraction(
  areaCode,
  gugunCode,
  contentTypeId,
  keyword,
  page,
) {
  let searchUrl = keyword
    ? `https://apis.data.go.kr/B551011/KorService1/searchKeyword1?serviceKey=${serviceKey}&contentTypeId=${contentTypeId}&areaCode=${areaCode}&sigunguCode=${gugunCode}&MobileOS=ETC&MobileApp=TestApp&_type=json&numOfRows=${perPage}&keyword=${keyword}&pageNo=${page}`
    : `https://apis.data.go.kr/B551011/KorService1/areaBasedList1?serviceKey=${serviceKey}&contentTypeId=${contentTypeId}&areaCode=${areaCode}&sigunguCode=${gugunCode}&MobileOS=ETC&MobileApp=TestApp&_type=json&numOfRows=${perPage}&pageNo=${page}`;
  const response = await fetch(searchUrl);
  const data = await response.json();
  const item = await data.response.body.items.item;

  totalPage.value = ((await data.response.body.totalCount) - 1) / perPage + 1;
  console.log(item);
  if ((!item || item.length == 0)) {
    if(!keyword){
      console.log("검색 결과 없읍니다요");    
      msg.fire({
      icon : 'info',
      title : '검색 결과가 없습니다'
      })
    }
    return []
  };
  return data.response.body.items.item;
}

const mytriplist = ref([]);
const max = ref(0);
const addMytriplist = (value) => {
  console.log(value);
  mytriplist.value.push(value);
};

const initMytriplist = () => {
  mytriplist.value = [];
};

const changeMax = (value) => {
  max.value = value;
};
</script>
<template>
  <div class="trip-container">
    <AttrSearch
      :select="select"
      @changeSido="changeSido"
      @changeGugun="changeGugun"
      @changeType="changeType"
    />
    <div class="container">
      <div class="row">
        <div class="col-md-8">
        <AttrMap
        :list="list"
        :newXY="newXY"
        /></div>
       <div class="col-md-4">
        <AttrDetailList
          :list="list"
          :max="max"
          @mapClick="mapClick"
          v-if="list?.length !== 0"
        />
        </div>
      </div>
    </div>
    <div>
      <!-- <AttrDetailList
        :list="list"
        :max="max"
        v-if="list?.length !== 0"
      /> -->
    </div>
  </div>
</template>
<style scoped>
.trip-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 10vh;
}

.paging {
  margin-top: 30px;
}
</style>

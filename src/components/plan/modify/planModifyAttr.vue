<!-- 플랜 작성 - 관광지 조회 컴포넌트 -->
<script setup>
import { ref, computed } from "vue";
import Modal from "../../common/Modal.vue";
import noImage from "@/assets/img/noImage.jpg";
const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  max: {
    type: Number,
    default: 0,
  },
});


const detailView = ref({
  title : "",
  addr1 : "",
  addr2 : "",
  image : "",
});

const emit = defineEmits(["addMytriplist", 'mapClick', 'addPlan']);

const click = function(target) {
  emit('mapXY', target);
}
var isModalViewed = ref(false);

const modalView = (data) => {
  console.log("data : " , data);
  detailView.value.title = data.title;
  detailView.value.addr1 = data.addr1;
  detailView.value.addr2 = data.addr2;
  detailView.value.image = data.firstimage;
  console.log(detailView);
}

// 계획추가버튼:
// planWrite로 데이터 전송 -> 다시 PlanWriteList에게 전송
// -> 카드 만들기 + 만들어진 카드 array 바탕으로 경로계산
const addPlan = (data) => {
  console.log("계획추가 : " + data.title);
  emit("addPlan", data);
}

const typelist = [
  { code: "12", name: "관광지" },
  { code: "14", name: "문화시설" },
  { code: "15", name: "축제공연행사" },
  { code: "25", name: "여행코스" },
  { code: "28", name: "레포츠" },
  { code: "32", name: "숙박" },
  { code: "38", name: "쇼핑" },
  { code: "39", name: "음식점" },
];

const addMytriplist = (data) => {
  emit("addMytriplist", data);
};

const mapClick = (data) => {
   const mapx = data.mapx; const mapy = data.mapy;
   const mapXY = {mapx, mapy};
  console.log("mapClick", mapXY);
  emit("mapClick", mapXY);
}

const list = computed(() => props.list);
console.log("list : " , props.list);
</script>
<template>
  <div class="container">
    <transition name="fade">
      <Modal v-if="isModalViewed" @close-modal="isModalViewed = false">
        <div id="title">{{detailView.title}}</div><br>
        <img :src="`${detailView.image}` || noImage" style="width:500px;"/><br>
        <div id="content">{{ detailView.addr1 }}
        {{ detailView.addr2 }}</div>
      </Modal>
    </transition>

    <v-container fluid class="scroll">
      <v-row style="display: flex; flex-direction: column; align-items: start; ">
        <v-col v-for="info in list" :key="info.contentid">
          <v-card
            @click="mapClick(info)">
              <v-img
            class="align-end text-white"
            height="100" width="250"
            :src="info.firstimage || noImage"
            cover
            />
            <v-card-title>{{ info.title }}</v-card-title>
            <v-card-actions>
              <v-btn color="orange" size="small" @click="isModalViewed = true, modalView(info)">상세정보</v-btn>
              <v-btn color="orange" size="small" style="margin-left:15%" @click="addPlan(info)">계획에 추가하기</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <!-- <attrDetail
      v-for="info in list"
      :key="info.contentid"
      :info="info"
      :max="max"
      /> -->
    </v-container>
  </div>
</template>
<style scoped>
#title{
  align-items: center;
  text-align: center;
  font-size: large;
  font-weight: bold;
}

#content{
  padding-top: 3%;
  align-items: center;
  text-align: center;
}
.fade-enter-from {opacity: 0;} /*시작시 스타일 */
.fade-enter-active {transition: all 0.5s;} /* 시작시 스타일 */
.fade-enter-to {opacity: 1;} /*끝날때 스타일 */
.fade-leave-from {opacity: 1;} /*시작시 스타일 */
.fade-leave-active {transition: all 0.5s;} /* 시작시 스타일 */
.fade-leave-to {opacity: 0;} /*끝날때 스타일 */
.container {
  margin-top: 0px;
  margin-left : -2%;
  height: 60vh;
}
.v-container{
  height: 60vh;
}
.v-application--wrap {
  min-height: unset;
}
.v-col-md-8{
  padding : 0;
}
.scroll {
   overflow-y: scroll
}
.v-card{
  margin-bottom: 10px;
}
.v-card-title{
  font-size: small;
}


.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  padding : 10%;
  box-sizing: border-box;
}

.modal-content {
  background: gray;
  padding: 20px;
  border-radius: 8px;
}
</style>

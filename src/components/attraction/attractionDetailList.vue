<script setup>
import { ref, computed } from "vue";
import attrDetail from "./attractionDetail.vue";
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

const emit = defineEmits(["addMytriplist", 'mapClick']);

const click = function(target) {
  emit('mapXY', target);
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
   
    <v-container fluid class="scroll">
      <v-row style="display: flex; flex-direction: column; align-items: end; ">
        <v-col v-for="info in list" :key="info.contentid" cols="1" md="8" lg="8">
          <v-card
            @click="mapClick(info)">
              <v-img
            class="align-end text-white"
            height="100" width="250"
            :src="info.firstimage || noImage"
            cover
            />
            <v-card-title>{{ info.title }}</v-card-title>
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
.container {
  margin-top: 0px;
  margin-left : 8%;
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
</style>

<script setup>
import { computed, ref } from "vue";
import { useQuery } from "@tanstack/vue-query";

const props = defineProps({
  select: {
    type: Object,
    default: () => ({
      sido: "",
      gugun: "",
    }),
  },
});

const emit = defineEmits(["changeSido", "changeGugun"]);

const select = ref(props.select);

const sidocode = computed(() => select.value?.sido);
const enabled = computed(() => !!select.value?.sido);

const { data: sidolist } = useQuery({
  queryKey: ["sido"],
  queryFn: fetchOption,
});

const { data: gugunlist } = useQuery({
  queryKey: ["gugun", sidocode],
  queryFn: () => fetchGuGunOption(sidocode.value),
  enabled,
});

// 공공데이터 서비스 키
const serviceKey = import.meta.env.VITE_API_SERVICE_KEY;

// 지역코드
const areaUrl =
  "https://apis.data.go.kr/B551011/KorService1/areaCode1?serviceKey=" +
  serviceKey +
  "&numOfRows=20&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json";

// 공공데이터 시도 코드 호출
async function fetchOption() {
  const sidoUrl = `https://apis.data.go.kr/B551011/KorService1/areaCode1?serviceKey=${serviceKey}&MobileOS=ETC&MobileApp=AppTest&_type=json`;
  const response = await fetch(sidoUrl);
  const data = await response.json();
  return data.response.body.items.item;
}

// 공공데이터 구군 코드 호출
async function fetchGuGunOption(areaCode) {
  const gugunUrl = `https://apis.data.go.kr/B551011/KorService1/areaCode1?serviceKey=${serviceKey}&MobileOS=ETC&MobileApp=AppTest&_type=json&areaCode=${areaCode}`;

  const response = await fetch(gugunUrl);
  const data = await response.json();
  return data.response.body.items.item;
}

const changeSido = (sido) => {
  emit("changeSido", sido);
};
const changeGugun = (gugun) => {
  emit("changeGugun", gugun);
};
</script>

<template>
  <div class="select-container" style="width: 100%">
    <input type="hidden" name="action" value="search" />
    <div class="col" style="margin-left: 2vw">
      <v-select
        :model-value="select.sido"
        @update:modelValue="changeSido"
        :items="sidolist"
        item-title="name"
        item-value="code"
        :rules="[(v) => !!v || '시도를 선택해주세요']"
        label="시도"
        required
      ></v-select>
      <v-select
        :model-value="select.gugun"
        @update:modelValue="changeGugun"
        :items="gugunlist"
        item-title="name"
        item-value="code"
        :rules="[(v) => !!v || '구군을 선택해주세요']"
        label="구군"
        required
      ></v-select>
    </div>
  </div>
</template>
<style scoped>
.search-container {
  display: flex;
  gap: 10px;
}

.select-container {
  width: 70vw;
  display: flex;
  gap: 10px;
  margin: auto;
  margin-top: 30px;
}

.search-form {
  width: 70vw;
  display: flex;
  gap: 10px;
  margin: auto;
  margin-top: 30px;
}
</style>

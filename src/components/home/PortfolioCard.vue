<script setup>
import PortfolioModal from "@/components/home/PortfolioModal.vue";
import { onMounted, ref } from "vue";

import noImage from "@/assets/img/noImage.jpg";
const emit = defineEmits();
const props = defineProps(["contentId"]);
const serviceKey = import.meta.env.VITE_API_SERVICE_KEY;

var isModalViewed = ref(false);
const content = ref({});
const modalId = "#modal" + content.contentid;

onMounted(async () => {
  content.value = await fetchContent();
  console.log(content.value);
});

// 공공데이터 contentTypeId 호출
async function fetchContent() {
  try {
    const url = `https://apis.data.go.kr/B551011/KorService1/detailCommon1?MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${props.contentId}&defaultYN=Y&firstImageYN=Y&addrinfoYN=Y&overviewYN=Y&serviceKey=${serviceKey}`;
    const response = await fetch(url);
    const data = await response.json();
    // 성공적으로 데이터를 받아왔을 경우에만 값을 반환
    return data.response.body.items.item[0];
  } catch (error) {
    // 에러가 발생한 경우 에러를 처리하거나 적절히 반환
    console.error("Error fetching data:", error);
    throw error;
  }
}

const handleCardClick = () => {
  // console.log("Clicked on item:", props.contentId);
  emit("card-clicked", content.value);
};
</script>

<template>
  <div class="col-lg-4 col-sm-6 mb-4">
    <div class="portfolio-item" @click="handleCardClick">
      <a class="portfolio-link">
        <div class="portfolio-hover">
          <div class="portfolio-hover-content">
            <i class="fas fa-plus fa-3x"></i>
          </div>
        </div>
        <img
          class="img-fluid"
          :src="content.firstimage || noImage"
          alt="..."
          style="width: 100%; height: 300px"
        />
      </a>
      <div class="portfolio-caption" style="min-height: 150px">
        <div class="portfolio-caption-heading">{{ content.title }}</div>
        <div class="portfolio-caption-subheading text-muted">
          {{ content.addr1 }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

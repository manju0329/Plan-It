<script setup>
import PortfolioCard from "@/components/home/PortfolioCard.vue";
import PortfolioModal from "@/components/home/PortfolioModal.vue";
import { findTop } from "@/api/hotplace";
import { ref, onMounted, reactive, watch } from "vue";

const numberList = ref([]);
const state = reactive({
  isModalViewed: false,
  content: null,
});

onMounted(async () => {
  const response = await findTop();
  numberList.value = response.list;
  console.log(numberList.value);
});

const handleCardClicked = (clickedItem) => {
  state.isModalViewed = true;
  state.content = clickedItem;
  console.log("Card clicked in parent. Item:", clickedItem);
  console.log(state.isModalViewed);
  // 부모 컴포넌트에서 클릭된 item을 처리할 로직을 추가할 수 있습니다.
};

const closeModal = () => {
  state.isModalViewed = false;
};
</script>

<template>
  <section class="page-section bg-light" id="portfolio">
    <div class="container">
      <div class="text-center">
        <h2 class="section-heading text-uppercase">인기 여행지</h2>
        <h3 class="section-subheading text-muted">
          우리 동네 인기 여행지를 확인해보세요
        </h3>
      </div>
      <div class="row">
        <PortfolioCard
          v-for="item in numberList"
          :key="item"
          :contentId="item"
          @card-clicked="handleCardClicked"
        ></PortfolioCard>

        <PortfolioModal
          v-if="state.isModalViewed"
          @close-modal="closeModal"
          :content="state.content"
        >
        </PortfolioModal>
      </div>
    </div>
  </section>
</template>

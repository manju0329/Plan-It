<script setup>
import { onMounted, ref, defineProps } from "vue";
const emit = defineEmits(["selectedId"]);

const props = defineProps(["content"]);
const folder = ref(""); // Use ref to create a reactive reference
const serviceKey = import.meta.env.VITE_API_SERVICE_KEY;

onMounted(() => {
  console.log(props.content);
  folder.value =
    props.content.date.slice(2, 4) +
    props.content.date.slice(5, 7) +
    props.content.date.slice(8, 10);
  console.log(folder.value);
});

const plusButton = (id, name) => {
  emit("selectedId", {
    id: id,
    name: name,
  });
};
</script>

<template>
  <v-card>
    <router-link
      class="portfolio-link"
      :to="{
        name: 'hotplace-view',
        params: { hotplaceno: content.hotplaceNo },
      }"
    >
      <div class="portfolio-hover">
        <div class="portfolio-hover-content">
          <i class="fas fa-plus fa-3x"></i>
        </div>
      </div>
      <v-img
        class="align-end text-white"
        height="30vh"
        width="100%"
        :src="`http://localhost:8080/enjoytrip/hotplace/${folder}/${content.path}`"
        cover
      />
    </router-link>
    <div
      class="row mt-5"
      style="display: flex; width: 100%; align-items: end; justify-content: space-between"
    >
      <span class="col-md-9" style="width: fit-content; margin: auto 0; margin-left: 20px">{{
        content.title
      }}</span>
      <span
        class="d-flex col-md-3"
        style="position: relative; display: flex; width: fit-content; align-items: center"
      >
        <img
          class="justify-content-end"
          src="@/assets/img/heart-svgrepo-com.svg"
          style="width: 20px; height: 20px; display: inline; margin-right: 5px"
        />
        <p style="position: relative; display: block; margin: auto 0; margin-bottom: 0">
          {{ content.recommendation }}
        </p>
      </span>
    </div>
    <p class="mr-5 mt-1" style="text-align: end">{{ content.contentName }}</p>
    <button
      style="color: orange; font-size: 0.8rem; margin-left: 65%; margin-bottom: 3%"
      @click="plusButton(content.contentId, content.contentName)"
    >
      계획에 추가하기
    </button>
  </v-card>
</template>

<style scoped></style>

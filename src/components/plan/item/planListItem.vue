<script setup>
import {ref, watch, computed, onMounted} from "vue";
const props = defineProps({ 
  plan: {
    type : Object, 
    default: () => ({}) 
  }
});


const selectOption = ref([
  { text: "카테고리", value: 0 },
  { text: "전체", value: -1 },
  { text: "레포츠", value: 1 },
  { text: "낚시", value: 2 },
  { text: "체험/축제", value: 3 },
  { text: "여가", value: 4 },
  { text: "맛집", value: 5 },
]);

let name = "";
const category = (data) => {
  selectOption.value.forEach(item => {
  if(item.value == data){
    name = item.text;
    return item.text;
  }
}
)
}
onMounted(() => {
})

const data =  computed(() => {
  props.plan.categoryId = category(props.plan.categoryId);
  return props.plan;
})

watch(data, (newValue) => {
  category(newValue.categoryId);
})


</script>

<template>
  <tr class="text-center">
    <th scope="row">{{ plan.planId }}</th>
    <td>{{ name }}</td>
    <td class="text-start">
      <router-link
        :to="{ name: 'plan-view', params: { planId: plan.planId } }"
        class="article-title link-dark"
      >
        {{ plan.planName }}
      </router-link>
    </td>
    <td>{{ plan.userId }}</td>
    <td>{{ plan.startDate }} ~ {{ plan.endDate }}</td>
  </tr>
</template>

<style scoped>
a {
  text-decoration: none;
}
</style>

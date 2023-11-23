<!-- 플랜 작성 - 계획 추가 컴포넌트 -->
<script setup>
import { computed, watch, ref, onMounted} from 'vue'; 
import { VueDraggableNext } from 'vue-draggable-next'
import { planStore } from "@/stores/planPiniaStore";

const pstore = planStore();

const props = defineProps({
    newAttr : {
        type : Object,
        default: () => ({}),
    },
    // planList : {
    //     type : Array,
    //     default: () => [],
    // }
    path : {
        type : Array,
        default : () => [],
    }
})

const emit = defineEmits(['newList', 'deleteList']);

const planList = ref([]); // 계획에 들어갈 장소 저장

const addAttr = computed(() => {
    return props.newAttr;
})

const getPath = computed(() => {
    return props.path;
})

const deleteList = ref([]);

const rangeCheck = (event) => {
    if (isOutsideContainer(event)) {
    console.log("out");
    const index = event.oldIndex;
    console.log("삭제한 장소 : ")
    console.log(planList.value[index]);
    console.log(planList.value[index].contentTitle);
    const del = planList.value[index].contentTitle;
    deleteList.value.push(planList.value[index].contentId);
    planList.value.splice(index, 1);
    emit("deleteList", del);
  }
};

const isOutsideContainer = (evt) => {
  const containerRect = evt.from.getBoundingClientRect();
  console.log(evt);
  console.log(evt.originalEvent.clientX);
  console.log(containerRect);
  return (
    evt.originalEvent.clientX < containerRect.left ||
    evt.originalEvent.clientX > containerRect.right ||
    evt.originalEvent.clientY < containerRect.top ||
    evt.originalEvent.clientY > containerRect.bottom
  );
};

// 플랜 변경될때마다 부모에게 전송
const changePlan = (event) => {
    console.log("플랜리스트 변경 !!!!!!!!!")
    console.log("변경된 플랜 : ")
    console.log(event);
    console.log(planList);
    console.log(Array.isArray(planList.value));
    emit("newList", planList.value);
}

// const newList = computed(() => {
//     return props.planList;
// })

//console.log(planList);

watch(getPath, (newValue) => {
    console.log("!!!!!!!!!new Path : ");
    console.log(newValue);
})

watch(addAttr, (newValue) => {
    console.log("newAttr");
    console.log(newValue);
    const tmp = {};
    tmp.contentTitle = newValue.title;
    tmp.mapX = newValue.mapx;
    tmp.mapY = newValue.mapy;
    tmp.contentId = newValue.contentid;
    tmp.image = newValue.image;
    tmp.addr = newValue.addr;

    planList.value.push(tmp);
    console.log(planList);
    console.log(Array.isArray(planList.value));
    // 플랜이 추가될때마다 부모에게 다시 전송
    emit("newList", planList.value);
}, {deep : true}); 

onMounted (() => {  
    if(pstore.plans != null){
        console.log("store plan : ");
        console.log(pstore.plans);
        planList.value = pstore.plans;
  }
    // const tmp1 = {"contentid" : 1, "title" : "tmp1"}; const tmp2 = {"contetnid" : 2, "title" : "tmp2"}
    // planList.value.push(tmp1)
    // planList.value.push(tmp2);
})

// watch(newList, (newValue) => {
//     console.log("new list : " + newValue);
// }, {deep : true});
</script>

<template>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <div class="container">
        <v-container fluid class="scroll">
            <VueDraggableNext  class="dragArea list-gruop w-full" :list="planList" @end="rangeCheck" @change="changePlan">
                <div
                class="list-group-item bg-gray-300 m-1 rounded-md text-center"
                v-for="(attr, index) in planList"
                :key="attr.contentid"
                >
                <v-card :key="attr.contentid">
                    <v-card-title style="font-size:small;">{{ attr.contentTitle }}</v-card-title>
                </v-card>
                <span v-if="index != planList.length - 1">
                    <span class="material-icons">south</span><h6>{{ Math.round(path[index + 1].duration / 60)}} 분</h6>
                </span>
                </div>
            </VueDraggableNext >
        </v-container>
    </div>
</template>

<style scoped>
@font-face {
  font-family: 'Material Icons';
  font-style: normal;
  font-weight: 400;
  src: url(https://example.com/MaterialIcons-Regular.eot); /* For IE6-8 */
  src: local('Material Icons'),
    local('MaterialIcons-Regular'),
    url(https://example.com/MaterialIcons-Regular.woff2) format('woff2'),
    url(https://example.com/MaterialIcons-Regular.woff) format('woff'),
    url(https://example.com/MaterialIcons-Regular.ttf) format('truetype');
}

h6{
    display: inline;
    padding-top : -3%;;
}

.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  color : gray;
  margin-top :10%;
  padding-top : 50px;
  margin-bottom: 0;
  font-style: normal;
  font-size: 24px;  /* Preferred icon size */
  display: inline;
  line-height: 2;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;

  /* Support for all WebKit browsers. */
  -webkit-font-smoothing: antialiased;
  /* Support for Safari and Chrome. */
  text-rendering: optimizeLegibility;

  /* Support for Firefox. */
  -moz-osx-font-smoothing: grayscale;

  /* Support for IE. */
  font-feature-settings: 'liga';
}
.scroll {
   overflow-y: scroll
}
.v-container{
  height: 60vh;
}
</style>
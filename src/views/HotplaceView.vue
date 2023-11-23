<script setup>
import { ref, computed, onMounted, watch, useTransitionState } from "vue";
import { useQuery, useQueryClient, useMutation } from "@tanstack/vue-query";
import { findLike, findCodeAll, findAllList } from "@/api/hotplace";
import HotPlaceSearch from "@/components/hotplace/HotPlaceSearch.vue";
import HotPlaceCard from "@/components/hotplace/HotPlaceCard.vue";
import { userStore } from "@/stores/userPiniaStore";
import { planStore } from "@/stores/planPiniaStore";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const ustore = userStore();
const pstore = planStore();

const select = ref({
  sido: "",
  gugun: "",
});

var isViewed = ref(false);
const changeSido = (sido) => {
  select.value.sido = sido;
  if (select.value.gugun != "") select.value.gugun = "";
};
const changeGugun = (gugun) => {
  select.value.gugun = gugun;
};

const checkChange = async () => {
  isViewed.value = !isViewed.value;
  console.log(isViewed.value);
  if (isViewed.value == true) {
    const data = await findLike({
      userId: ustore.userInfo.userId,
      sido: sidocode.value,
      gugun: guguncode.value,
    });
    list.value = data.data.list;
  } else {
    if (guguncode.value == "" && sidocode.value == "") {
      const response = await findAllList();
      list.value = response.list;
    } else {
      const data = await findCodeAll({
        sido: sidocode.value,
        gugun: guguncode.value,
      });
      list.value = data.data.list;
    }
  }
};

async function moveToPlan() {
  console.log("moveToPlan");
  console.log(selectedIdList.value);
  await pstore.saveHotPlaceInfo(selectedIdList.value);
  router.push({ name: "hotplace-plan-write" });
}

const sidocode = computed(() => select.value?.sido);
const guguncode = computed(() => select.value?.gugun);
var list = ref([]);

onMounted(async () => {
  const response = await findAllList();
  list.value = response.list;
});

watch([sidocode, guguncode], async () => {
  list.value = null;

  if (guguncode.value != "") {
    const data = await findCodeAll({
      sido: sidocode.value,
      gugun: guguncode.value,
    });

    list.value = data.data.list;
    console.log(list.value);
  } else {
    const data = await findCodeAll({
      sido: sidocode.value,
    });

    list.value = data.data.list;
    console.log(list.value);
  }
});

var selectedList = ref([]);
var selectedIdList = ref([]);
const newList = (item) => {
  // item.id가 selectedIdList에 없는 경우에만 추가
  if (!selectedIdList.value.includes(item.id)) {
    selectedList.value = [...selectedList.value, item];
    selectedIdList.value = [...selectedIdList.value, item.id];
  }

  console.log(selectedList.value);
  console.log(selectedIdList.value);
};
const removeItem = (item) => {
  const updatedList = selectedList.value.filter((selectedItem) => selectedItem.id !== item.id);

  const updatedIdList = selectedIdList.value.filter((selectedItemId) => selectedItemId !== item.id);

  selectedList.value = updatedList;
  selectedIdList.value = updatedIdList;
};
</script>

<template>
  <div style="height: 15vh"></div>
  <div class="row bird">
    <div class="col-md-4" style="display: flex; flex-direction: column; align-items: end">
      <HotPlaceSearch
        :select="select"
        @changeSido="changeSido"
        @changeGugun="changeGugun"
        style="margin-bottom: 0"
      />
      <div class="checkbox d-flex justify-content-end">
        <input type="checkbox" v-model="isChecked" @change="checkChange" />내 좋아요 보기
      </div>
      <div
        class="mt-5"
        style="width: 100%; display: flex; flex-direction: column; align-items: end"
      >
        <v-container
          fluid
          class="scroll"
          style="
            display: block;
            width: 94%;
            height: 45vh;
            margin: 0;
            border: 1px solid gray;
            justify-content: end;
          "
        >
          <v-row
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
            "
          >
            <div class="mb-2 mt-2">여행 계획 추가하기</div>
            <v-col v-for="item in selectedList" :key="item" cols="12">
              <v-card style="padding: 10px; display: flex; justify-content: space-between">
                <span>{{ item.name }}</span>
                <img
                  src="../assets/img/close-icon.svg"
                  alt="Close modal"
                  @click="removeItem(item)"
                  style="width: 20px; height: 20px"
                />
              </v-card>
            </v-col>
          </v-row>
        </v-container>
        <button
          class="btn btn-outline-secondary m-3"
          id="btn-back"
          @click="moveToPlan"
          style="border-radius: 0; border: none; border-bottom: 1px solid lightgray !important"
        >
          등록하기
        </button>
      </div>
    </div>
    <div class="col-md-8" style="padding-right: 8%">
      <v-container fluid class="scroll">
        <v-row>
          <v-col v-for="item in list" :key="item" cols="12" md="4" lg="4">
            <HotPlaceCard :content="item" @selectedId="newList"></HotPlaceCard>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>

  <div class="row"></div>
</template>

<style scoped>
.scroll {
  overflow-y: scroll;
}
.v-container {
  height: 80vh;
}
</style>
<style>
.bird span.v-card__underlay {
  display: none;
}
</style>

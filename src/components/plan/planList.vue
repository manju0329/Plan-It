<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { viewPlan, totPlan } from "@/api/plan";

import VSelect from "@/components/common/VSelect.vue";
import planListItem from "./item/planListItem.vue";
import PageNavigation from "@/components/common/PageNavigation.vue";
import { userStore } from "@/stores/userPiniaStore";


const ustore = userStore();
const router = useRouter();

const selectOption = ref([
  { text: "카테고리", value: "" },
  { text: "전체", value: "-1" },
  { text: "레포츠", value: "1" },
  { text: "낚시", value: "2" },
  { text: "체험/축제", value: "3" },
  { text: "여가", value: "4" },
  { text: "맛집", value: "5" },
]);

const plans = ref([]);
const currentPage = ref(1);
const totalPage = ref(0);
const tot = ref(0);
let isChecked = false;
const { VITE_ARTICLE_LIST_SIZE } = import.meta.env;
const param = ref({
  pgno: currentPage.value,
  spp: VITE_ARTICLE_LIST_SIZE,
  categoryId: "",
  userId: "",
  word : "",
});

onMounted(() => {
    getPlanList();
});

const checkChange = () => {
    if(isChecked){
        console.log("check");
        console.log(ustore.userInfo.userId);
        param.value.userId = ustore.userInfo.userId;
        getPlanList();
    }else{
        console.log("uncheck");
        param.value.userId = "";
        getPlanList();
    }
}

const changeCate = (val) => {
  console.log("BoarList에서 선택한 조건 : " + val);
  if(val == -1){
    param.value.categoryId = ""; 
  }else{
    param.value.categoryId = val;
  }
  getPlanList();
};

const getPlanList = () => {
  console.log("서버에서 글목록 얻어오자!!!", param.value);
  // API 호출
  viewPlan(
    param.value,
    ({data}) => {
        console.log(data);
        plans.value = data.plans;
        currentPage.value = data.currentPage;
        totalPage.value = data.totalPageCount;
        tot.value = data.total;
    },
    (error) => {
        console.log(error);
    }
  );

};

const onPageChange = (val) => {
  console.log(val + "번 페이지로 이동 준비 끝!!!");
  currentPage.value = val;
  param.value.pgno = val;
  getPlanList();
};

const moveWrite = () => {
  router.push({ name: "plan-write" });
};
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10 mt-5">
        <div class="row align-self-center mb-2">
          <div class="col-md-2 text-start">
            <button
              type="button"
              class="btn btn-outline-primary btn-sm"
              @click="moveWrite"
            >
              여행추가
            </button>
          </div>
          <div class="col-md-5 offset-5">
            <form class="d-flex box">              
              <VSelect :selectOption="selectOption" @onKeySelect="changeCate" />
              <div class="input-group input-group-sm">
                <input
                  type="text"
                  class="form-control"
                  v-model="param.word"
                  placeholder="검색어..."
                />
                
                <button class="btn btn-dark" type="button" @keyup.enter="getPlanList" @click="getPlanList">검색</button>
              </div>
                    <!-- <VSelect :selectOption="selectOption" class="category" @onKeySelect="changeCate"/>
                    
                    <input
                  type="text"
                  class="form-control search"
                  v-model="param.word"
                  placeholder="검색어"
                  />
                <button class="btn btn-dark search" type="button" @keyup.enter="getPlanList" @click="getPlanList">검색</button>
                    <div class="checkbox">
                        <input type="checkbox" v-model="isChecked" @change="checkChange"> <div class="text">나의 여행 보기</div>
                    </div> -->
            </form>
          </div>
        </div>
        <table class="table table-hover">
          <thead>
            <tr class="text-center">
              <th scope="col">여행번호</th>
              <th scope="col">카테고리</th>
              <th scope="col">제목</th>
              <th scope="col">작성자</th>
              <th scope="col">여행기간</th>
            </tr>
          </thead>
          <tbody>
            <planListItem
              v-for="plan in plans"
              :key="plan.planId"
              :plan="plan"
            ></planListItem>
          </tbody>
        </table>
      </div>
      <div class="footer">

        <div class="total" style="white-space: nowrap;"><h6>total : {{ tot }}</h6></div> 
      <div class="check">
        <h6><input type="checkbox" class="" v-model="isChecked" @change="checkChange"> 나의 여행 보기</h6>
      </div>

      </div>
      <PageNavigation
        :current-page="currentPage"
        :total-page="totalPage"
        @pageChange="onPageChange"
      ></PageNavigation>
    </div>
  </div>
</template>

<style scoped>

  .footer{
    display: flex;
  }

  .total{
    display: flex;
    justify-content: start;
    align-items: left;
    margin-left : 10%;
    width : 10%;
  }    
  
  .check{
    display: flex;
    justify-content: end;
    align-items: right;
    margin-right : 10%;
    margin-left : 50%;
    margin-top : 0%;
    width : 40%;
  }
  
  .checkbox{
        display: flex;
        margin-left : 10px;
        margin-top : 5px;
        margin-right: 0%;
    }

    .checkbox .text{
        font-size: small;
        margin-left: 5%;
        margin-top : 3%;
        white-space: nowrap;
    }
    /* .category{
        display: flex;
        width: 80%;
        padding-right: 10%;
        padding-left: 5%;
      align-items: left;
      justify-content: start;
      text-align: left;
    }
    .search{
      display: flex;
        max-width: 35%;
    }
    .search button{
      width : 200px;
      font-size: small;
      white-space: nowrap;
    }
    .d-flex button{
      width : 300px;
      font-size: small;
      white-space: nowrap;
    }
    .checkbox{
        display: flex;
        margin-left : 10px;
        margin-top : 5px;
        margin-right: 0%;
        width: 40%;
    }

    .checkbox .text{
        font-size: small;
        margin-left: 5%;
        margin-top : 3%;
        white-space: nowrap;
    }

    .box{
      height: 40%;
    }

    .d-flex{
        margin-left : 0%;
        width: 100%;
        height: 80%;
    } */
</style>

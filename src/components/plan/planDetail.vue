<script setup>
import {ref, onMounted} from "vue";
import { useRoute, useRouter } from "vue-router";
import {viewPlanDetail, deletePlan} from "@/api/plan";
import { userStore } from "@/stores/userPiniaStore";
import { planStore } from "@/stores/planPiniaStore";
import planDetailMap from "@/components/plan/planDetailMap.vue";
import noImage from "@/assets/img/noImage.jpg";
import {findById} from "@/api/member";
import Swal from 'sweetalert2';
import { mapKeys } from "lodash";

const route = useRoute();
const ustore = userStore();
const router = useRouter();
const pstore = planStore();

const { planId } = route.params;
const plan = ref([]);
const planInfo = ref({});
const path = ref([]);
const realContent = ref([]);
let userName = "";

onMounted(async() => {
    getPlan();
    console.log(plan);
    console.log(performance)
    console.log(planInfo);
});

const msg = Swal.mixin({
  toast: true,
  position: 'center',
  showConfirmButton: true,
})

async function modify() {
    console.log("수정시작");
    console.log(plan.value);
    await pstore.saveAttractionsDetail(plan.value);
    await pstore.savePlanInfo(planInfo.value);
    router.push({ name: "plan-modify" });
}

const delPlan = (planId) => {
    msg.fire({
                icon : "warning",
                title : "삭제하시겠습니까?",
                showCancelButton: true,
    }).then((result) => {
        if(result.isConfirmed){
            deletePlan(
                planId,
                () => {
                    msg.fire({
                        icon : "success",
                        title : "삭제되었습니다!",
                    }).then(
                        router.push({name : "plan-list"})
                    )
                },
                (error) => {
                    console.log(error);
                }
            )
        }
    })
}

const getPlan = () => {
  console.log(planId + "번글 얻으러 가자!!!");
  viewPlanDetail(
    planId,
    ({data}) => {
        console.log(data);
        plan.value = data;
        planInfo.value = data[0];
        
        findById(
            planInfo.value.userId,
            ({data}) => {
                userName = data.userInfo.userName;
                console.log("findByID!!!!!!!!");
                console.log(data);
            }, (error) => {
                console.log(error);
            }
        )
        console.log(plan.value);
        console.log(planInfo.value);
        console.log(plan.value[0].planId);},
    (error) => {
        console.log(error);
    }
  )
}


async function moveHotplace() {
  console.log("storeTest");
  console.log(plan.value);
  await pstore.saveAttractions(plan.value);
  router.push({ name: "hotplace-write" });
}

const pathInfo = (data) => {
    console.log(data);
    path.value = data.value;
    console.log(path.value[1]);
}

const moveList = () => {
    router.push({name : "plan-list"});
}

</script>

<template>  
    <div class="container">
        <div class="row justify-content-center">
        <div class="col-lg-10 text-start mt-5">
            <div class="row my-2">
            <h2 class="text-title">
                {{ planInfo.planId }} . {{ planInfo.planName }}
            </h2>
            </div>
            <div class="row">
            <div class="col-md-8">
                <div class="clearfix align-content-center">
                <img
                    class="avatar me-2 float-md-start bg-light p-2"
                    src="https://raw.githubusercontent.com/twbs/icons/main/icons/person-fill.svg"
                />
                <p>
                    <span class="fw-bold"></span>{{ userName }} <br />
                </p>
                </div>
            </div>
            <div class="divider mb-3"></div>
                    <section class="page-section content-top">
                        <div class="text-center">
                        <h4 class="section-heading text-uppercase">여행 경로</h4>
                        </div>
                    <div class="content">
                        <planDetailMap
                        :plan="plan"
                        @pathInfo="pathInfo"/>
                    </div>
                    </section> 
            <!-- About-->
            <section class="page-section" id="about">
                <div class="container">
                    <div class="text-center">
                        <h4 class="section-heading text-uppercase">상세 정보</h4>
                    </div>
                    <ul>
                        <!-- 왼쪽 -->
                        <div v-for="(p, index) in plan" class="timeline">
                        <li v-if="index % 2 == 0">
                            <div class="timeline-image"><img class="img" :src="plan[index].image || noImage"  height="150" width="150" alt="..." /></div>
                            <div class="timeline-panel">
                                <div class="timeline-heading">
                                    <h4>{{ index + 1 }}.</h4>
                                    <h4 class="subheading">{{plan[index].contentTitle}}</h4>
                                </div>
                                <div class="timeline-body"><p class="text-muted">{{plan[index].addr}}<br><br><br><br><span v-if="index != plan.length - 1"><h5 class="subheading"> 예상 시간 : {{path[index + 1] == null ? 0 : Math.round(path[index + 1].duration / 60)}}분</h5></span><br></p></div>
                            </div>
                        </li>
                            
                             <!-- 오른쪽 -->

                                <li v-if="index % 2 == 1" class="timeline-inverted">
                            <div class="timeline-image"><img class="img" :src="plan[index].image || noImage" height="150" width="150" alt="..." /></div>
                            <div class="timeline-panel">
                                <div class="timeline-heading">
                                    <h4>{{ index + 1 }}.</h4>
                                    <h4 class="subheading">{{plan[index].contentTitle}}</h4>
                                </div>
                                <div class="timeline-body"><p class="text-muted">{{plan[index].addr}}<br><br><br><br><span v-if="index != plan.length - 1"><h5 class="subheading"> 예상 시간 : {{path[index + 1] == null ? 0 : Math.round(path[index + 1].duration / 60)}}분</h5></span><br></p></div>
                            </div>
                        </li>
                    </div>     
                        <!-- <li>
                            <div class="timeline-image"><img class="rounded-circle img-fluid" src="./assets/img/about/3.jpg" alt="..." /></div>
                            <div class="timeline-panel">
                                <div class="timeline-heading">
                                    <h4>December 2015</h4>
                                    <h4 class="subheading">Transition to Full Service</h4>
                                </div>
                                <div class="timeline-body"><p class="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt ut voluptatum eius sapiente, totam reiciendis temporibus qui quibusdam, recusandae sit vero unde, sed, incidunt et ea quo dolore laudantium consectetur!</p></div>
                            </div>
                        </li>
                        <li class="timeline-inverted">
                            <div class="timeline-image"><img class="rounded-circle img-fluid" src="./assets/img/about/4.jpg" alt="..." /></div>
                            <div class="timeline-panel">
                                <div class="timeline-heading">
                                    <h4>July 2020</h4>
                                    <h4 class="subheading">Phase Two Expansion</h4>
                                </div>
                                <div class="timeline-body"><p class="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt ut voluptatum eius sapiente, totam reiciendis temporibus qui quibusdam, recusandae sit vero unde, sed, incidunt et ea quo dolore laudantium consectetur!</p></div>
                            </div>
                        </li> -->
                    </ul>
                </div>
            </section>
            <div class="divider mt-3 mb-3"></div>
            <div  class="d-flex justify-content-end">
                <button
                type="button"
                class="btn btn-outline-info mb-3 ms-1"
                @click="moveList"
                >
                목록
                </button>
                <div v-if="planInfo.userId == ustore.userInfo.userId">
                    <button
                    type="button"
                    class="btn btn-outline-danger mb-3 ms-1"
                    @click="delPlan(planInfo.planId)"
                    >
                    삭제
                    </button>                    
                    <button
                    type="button"
                    class="btn btn-outline-success mb-3 ms-1"
                    @click="modify"
                    >
                    수정
                    </button>         
                </div>            
                <button
                type="button"
                class="btn btn-outline-warning mb-3 ms-1"
                @click="moveHotplace"
                >
                핫플레이스 등록
                </button>
            </div>
            </div>
        </div>
        </div>
    </div>
</template>

<style scoped>
.content{
    display: flex;
    align-items: center;
    justify-content: center;
}

.img{
    border-radius: 50%;
    margin-top: 2%;
}

.text-center{
    position: relative;
    margin-bottom : 3%;
}

.text-center::before {
    content: ''; /* 가상 요소에 내용을 추가 */
    position: absolute; /* 가상 요소를 부모 요소에 상대적으로 배치 */
    bottom: -3px; /* 부모 요소 상단에 배치 */
    left: 0; /* 부모 요소 왼쪽에 배치 */
    margin-left : 40%;
    width: 20%; /* 부모 요소의 100% 너비를 가짐 */
    height: 1px; /* 선의 높이를 설정 (원하는 높이로 조절 가능) */
    background-color: #fcba03; /* 선의 색상을 설정 */
  }

.content-top{
    position: relative;
}

  /* 새로운 선 스타일 */
  .content-top::before {
    content: ''; /* 가상 요소에 내용을 추가 */
    position: absolute; /* 가상 요소를 부모 요소에 상대적으로 배치 */
    top: 0; /* 부모 요소 상단에 배치 */
    left: 0; /* 부모 요소 왼쪽에 배치 */
    width: 100%; /* 부모 요소의 100% 너비를 가짐 */
    height: 2px; /* 선의 높이를 설정 (원하는 높이로 조절 가능) */
    background-color: #fcba03; /* 선의 색상을 설정 */
  }
</style>
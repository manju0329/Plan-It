<script setup>
import { onMounted, ref, computed, reactive, watch, handleError } from "vue";
import { useQuery, useQueryClient, useMutation } from "@tanstack/vue-query";
import Modal from "../common/Modal.vue";
import http from "../../api/http";
//import { userStore } from "@/pinia/userPiniaStore";
import { toast } from "vue3-toastify";
import Swal from 'sweetalert2';
import noImage from "@/assets/img/noImage.jpg";

let isModalViewed = ref(false);
const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  mytriplist: {
    type: Array,
    default: () => [],
  },  
  newXY: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["initMytriplist", "addMytriplist", "changeMax"]);
const msg = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer : 3000,
  timerProgressBar : true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})
let map = null;
let markers = [];
//const store = userStore();
//const userInfo = computed(() => store.userInfo);

const data = computed(() => {
  return props.list;
});
console.log("data" , props.list);
const clickMap = computed(() => {
  return props.newXY;
})


watch(data, (newValue) => {
  if (newValue.length > 0) {
    makeList(newValue);
  }else{
    console.log("검색결과없음");
    // msg.fire({
    //   icon : 'info',
    //   title : '검색 결과가 없습니다'
    // })
  }
});
console.log("props : " + props.newXY);
watch(clickMap, (newValue) => {
  console.log("change");
  if(newValue.length > 0){
    console.log("newX : ", newValue);
    let moveLatLon = new kakao.maps.LatLng(newValue[1], newValue[0]);
    map.panTo(moveLatLon);
  }
}, {deep : true});

// const getMyTripAll = async () => {
//   const data = await (
//     await http.get(`/attraction/getMyTripAll/${userInfo.value.id}`)
//   ).data;

//   return data;
// };

// const { data: all } = useQuery({
//   queryKey: ["mytripAll", userInfo.value.id],
//   queryFn: getMyTripAll,
// });

// ----------------------
// const getMyTripMax = async () => {
//   const data = await (
//     await http.get(`/attraction/getMyTripMax/${userInfo.value.id}`)
//   ).data;
//   return data || 0;
// };

// const { data: max } = useQuery({
//   queryKey: ["mytripmax", 1], //userInfo.value.id],
//   queryFn: getMyTripMax,
//   onSuccess: (v) => {
//     emit("changeMax", v || 0);
//   },
//   staleTime: Infinity,
//   cacheTime: Infinity,
// });

const loadScript = () => {
  const script = document.createElement("script");
  const kakao=import.meta.env.VITE_API_KAKAO_KEY;
  script.src =
    `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakao}&autoload=false`;
  script.onload = () => window.kakao.maps.load(loadMap);
  document.head.appendChild(script);
};

const loadMap = () => {
  const container = document.getElementById("map"); //지도를 담을 영역의 DOM 레퍼런스
  const options = {
    //지도를 생성할 때 필요한 기본 옵션
    center: new window.kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
    level: 3, //지도의 레벨(확대, 축소 정도)
  };

  map = new window.kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
};

function add(contentid, title) {
  // const { contentid } = dataset;
  const data = {
    content_id: contentid,
    user_id: 1, //userInfo.value.id,
    user_mytrip_no: (max.value || 0) + 1,
  };
  emit("addMytriplist", { ...data, title });
  // mytriplist.value.push({ ...data, title });
  // http.post(`/attraction/addMyTrip`, data);
}

const queryClient = useQueryClient();
const { mutate } = useMutation({
  mutationFn: () => http.post(`/attraction/addMyTripAll`, props.mytriplist),
  onSuccess: async () => {
    queryClient.invalidateQueries({
      queryKey: ["mytripmax", 1],//userInfo.value.id],
    });
    // mytriplist.value = [];
    emit("initMytriplist");
    toast.success(`여행계획이 추가되었습니다.`);
  },
});

const mytripAllAdd = async () => {
  mutate();
};

// 마커 클러스터러를 생성합니다 
// var clusterer = new kakao.maps.MarkerClusterer({
//     map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
//     averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
//     minLevel: 10 // 클러스터 할 최소 지도 레벨 
// });

function displayMarker(positions) {
  setMarkers(null);
  // 마커 이미지의 이미지 주소입니다
  var imageSrc =
    "http://t1.daumcdn.net/mapjsapi/images/marker.png";

  const points = [];

  for (var i = 0; i < positions.length; i++) {
    // 마커 이미지의 이미지 크기 입니다
    var imageSize = new window.kakao.maps.Size(24, 35);

    const iwContent = `
            <div>
             <div class="title">
                  ${positions[i].title}
              </div>
            </div>`;

    // 마커 이미지를 생성합니다
    var markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

    // 마커를 생성합니다
    const marker = new window.kakao.maps.Marker({
      map: map, // 마커를 표시할 지도
      position: positions[i].latlng, // 마커를 표시할 위치
      title: `${positions[i].contentId},${positions[i].title}`, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
      contentId : positions[i].contentId,
      image: markerImage, // 마커 이미지
    });

    // 인포윈도우를 생성합니다
    const infowindow = new window.kakao.maps.InfoWindow({
      content: iwContent,
      // removable: true,
    });

    markers.push(marker);

    window.kakao.maps.event.addListener(marker, "click", () => {
      const result = marker.getTitle().split(","); // result[0] = contentId
      console.log("click : " + result[0] + " " + result[1]);
      isModalViewed = true;

    });
    window.kakao.maps.event.addListener(marker, "mouseover", () => {
      infowindow.open(map, marker);
    });
    window.kakao.maps.event.addListener(marker, "mouseout", () => {
      infowindow.close(map, marker);
    });

    window.kakao.maps.event.addListener(infowindow, "click", () => {
      // add(this.dataset);
      console.log("dhfihdi");
      // infowindow.close(map, marker);
    });

    points.push(positions[i].latlng);
  }

  const bounds = new window.kakao.maps.LatLngBounds();

  for (i = 0; i < points.length; i++) {
    //LatLngBounds 객체에 좌표를 추가합니다
    bounds.extend(points[i]);
  }

  setBounds(bounds);
}

function setBounds(bounds) {
  // LatLngBounds 객체에 추가된 좌표들을 기준으로 지도의 범위를 재설정합니다
  // 이때 지도의 중심좌표와 레벨이 변경될 수 있습니다
  map.setBounds(bounds);
}

function moveCenter(lat, lng) {
  map.setCenter(new window.kakao.maps.LatLng(lat, lng));
}

function makeList(item) {
  if (!item) {
    alert("관련 정보가 존재하지 않습니다!");
    return;
  }

  const positions = item.map((area) => {
    return {
      title: area.title,
      latlng: new window.kakao.maps.LatLng(area.mapy, area.mapx),
      addr1: area.addr1,
      firstimage: area.firstimage,
      contentId: area.contentid,
    };
  });

  // console.log(positions);
  hideMarkers();
  markers = [];
  displayMarker(positions);
  //clusterer.addMarkers(markers);
}

// 배열에 추가된 마커들을 지도에 표시하거나 삭제하는 함수입니다
function setMarkers(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// "마커 감추기" 버튼을 클릭하면 호출되어 배열에 추가된 마커를 지도에서 삭제하는 함수입니다
function hideMarkers() {
  setMarkers(null);
}

function resizeMap() {
  var mapContainer = document.getElementById("map");
  mapContainer.style.width = "100vw";
  mapContainer.style.height = "100vh";
}

function relayout() {
  // 지도를 표시하는 div 크기를 변경한 이후 지도가 정상적으로 표출되지 않을 수도 있습니다
  // 크기를 변경한 이후에는 반드시  map.relayout 함수를 호출해야 합니다
  // window의 resize 이벤트에 의한 크기변경은 map.relayout 함수가 자동으로 호출됩니다
  map.relayout();
}

onMounted(() => {
  if (window.kakao && window.kakao.maps) {
    loadMap();
  } else {
    loadScript();
  }
});
</script>

<template> 
  <Modal v-if="isModalViewed" @close-modal="isModalViewed = false">
    123456
  </Modal>
  <div class="mytrip" v-if="props.mytriplist.length > 0">
    <v-card-title>{{ (max || 0) + 1 }}번 여행계획</v-card-title>
    <v-timeline direction="horizontal">
      <v-timeline-item v-for="(item, index) in props.mytriplist" :key="index">
        <template v-slot:opposite>{{ item.title }} </template>
        {{ index + 1 }}
      </v-timeline-item>
    </v-timeline>
    <v-btn icon="mdi-plus" size="small" @click="mytripAllAdd"></v-btn>
  </div>    
  <div id="map"></div>
</template>

<style scoped>
#map {
  width: 55vw;
  height: 60vh;
  justify-content: left;
  align-items: left;
  margin-left : -3%;
}

.map-container {
  justify-content: left;
  align-items: left;
  width: 100vw;
  height: 100vh;
  margin: auto;
  padding : 0%;
}



.mytrip {
  display: flex;
  align-items: center;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
}
</style>

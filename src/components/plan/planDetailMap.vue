<script setup>
import { onMounted, ref, computed, reactive, watch, handleError } from "vue";
import { useQuery, useQueryClient, useMutation } from "@tanstack/vue-query";
import http from "@/api/http";
//import { userStore } from "@/pinia/userPiniaStore";
import { toast } from "vue3-toastify";

const props = defineProps({
  plan : {
    type : Array,
    default : () => [],
  }
});

const emit = defineEmits(['pathInfo']);

let map = null;
let markers = [];
let star_markers = [];
var polyline = null;
const path = ref([]);
const realContent = ref([]);
//const store = userStore();
//const userInfo = computed(() => store.userInfo);



const planList = computed(() => {
    console.log("computed");
    console.log(props.plan);
  return props.plan;
})

// https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png

watch(planList, (newValue) => {
  console.log("planDetailMap planList");
  console.log(newValue);
  console.log(newValue.length);
  console.log(map);
  if(map != null){
    makeList(newValue);
    getPath(newValue);
  }
  
//   if(polyline != null){
//       console.log("polyline 제거!!!!!!!!");
//       polyline.setMap(null);
//   }

//   if(newValue.length >= 2){
//     getPath(newValue);
//   }
}, {deep : true});

async function getPath(list) {
  console.log("getPath 실행!!!!!!!!!!!");
  console.log(list);
  path.value = [];      console.log(path.value);
    const REST_API_KEY = import.meta.env.VITE_API_KAKAO_REST_KEY;
    console.log(REST_API_KEY);
    // 호출방식의 URL을 입력합니다.
    const url = 'https://apis-navi.kakaomobility.com/v1/directions';

    const headers = {
      Authorization: `KakaoAK ${REST_API_KEY}`,
      'Content-Type': 'application/json'
    };
    console.log(headers.Authorization);
    
    const origin = `${list[0].mapX}, ${list[0].mapY}`; //`127.03694066884887, 37.500779329532776`; 
    const destination = `${list[list.length - 1].mapX}, ${list[list.length - 1].mapY}`;  //`127.02456951141357, 37.504453309602354`;//
    //let list = [];
    let waypoint = "";
    //list.push(way1); list.push(way2);
    console.log(list.length);
    console.log(list[0]);
    //0 | 1 | 2 | 3 | 4
    for(let i = 1; i < list.length - 1; i++){
        if(i == 1){
          waypoint = waypoint.concat(list[i].mapX, ",", list[i].mapY);
        }else{
          waypoint = waypoint.concat("|", list[i].mapX, ",", list[i].mapY);
        }
    } 
    console.log(waypoint);

    console.log(origin + " " + destination);
    const queryParams = new URLSearchParams({
      origin: origin,
      destination: destination,
      waypoints : waypoint,
    });

    const requestUrl = `${url}?${queryParams}`;
    console.log(requestUrl);
    try {
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      console.log(data);
      console.log("전체 소요시간(초) : " + data.routes[0].summary.duration);
      console.log("전체 거리(m) : " + data.routes[0].summary.distance);
      console.log("택시 요금 : " + data.routes[0].summary.fare.taxi);
      const tmp = {};
      tmp.duration = data.routes[0].summary.duration;
      tmp.distance = data.routes[0].summary.distance;
      tmp.fare = data.routes[0].summary.fare.taxi;
      console.log(tmp);
      path.value.push(tmp);
      console.log(path.value);

      const linePath = [];
      data.routes[0].sections.forEach(section => {
        console.log("경유지 거리/시간 : " + section.distance + " " + section.duration);
        const tmp2 = {};
        tmp2.duration = section.duration;
        tmp2.distance = section.distance;
        console.log("tmp2!!!!!!!!!!!!!");
        console.log(tmp2);
        path.value.push(tmp2);
        console.log(path.value);
        section.roads.forEach(router => {
        router.vertexes.forEach((vertex, index) => {
            if (index % 2 === 0) {
              // lat = y, lng = x
              linePath.push(new kakao.maps.LatLng(router.vertexes[index + 1], router.vertexes[index]));
            }
          });
        });
      })
      polyline = new kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 5,
        strokeColor: '#11cff5',
        strokeOpacity: 0.7,
        strokeStyle: 'solid'
      }); 
      polyline.setMap(map);
      emit("pathInfo", path);
    } catch (error) {
      console.error('Error:', error);
    }
}


const loadScript = () => {
  const script = document.createElement("script");
  const kakao=import.meta.env.VITE_API_KAKAO_KEY;
  script.src =
    `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakao}&autoload=false`;
  script.onload = () => window.kakao.maps.load(loadMap);
  document.head.appendChild(script);
};

const loadMap = () => {
  console.log("in loadMap");
  const container = document.getElementById("map"); //지도를 담을 영역의 DOM 레퍼런스
  const options = {
    //지도를 생성할 때 필요한 기본 옵션
    center: new window.kakao.maps.LatLng(37.501247014659334, 127.03975796712898), //지도의 중심좌표.
    level: 3, //지도의 레벨(확대, 축소 정도)
  };

  map = new window.kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
  console.log(map);
  makeList(props.plan);
  getPath(props.plan);
};


// 마커 클러스터러를 생성합니다 
// var clusterer = new kakao.maps.MarkerClusterer({
//     map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
//     averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
//     minLevel: 10 // 클러스터 할 최소 지도 레벨 
// });

function displayMarker(positions) {
  setMarkers(null);
  console.log()
  console.log(realContent);
  // 마커 이미지의 이미지 주소입니다
  var imageSrc =
    "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png";

  const points = [];
    console.log("displayMarker " + positions.length);
  for (var i = 0; i < positions.length; i++) {
    // 마커 이미지의 이미지 크기 입니다
    var imageSize = new window.kakao.maps.Size(37, 37);
    var imgOptions =  {

        spriteSize : new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
        spriteOrigin : new kakao.maps.Point(0, (i*46)+10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
        offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
    }
    const iwContent = `
            <div>
             <div class="title">
                  ${positions[i].title}
              </div>
            </div>`;

    // 마커 이미지를 생성합니다
    var markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);

    // 마커를 생성합니다
    const marker = new window.kakao.maps.Marker({
      map: map, // 마커를 표시할 지도
      position: positions[i].latlng, // 마커를 표시할 위치
      title: positions[i].contentTitle, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
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
      const result = marker.getTitle(); //.split(","); // result[0] = contentId
      //console.log("click : " + result[0] + " " + result[1]);
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
    console.log(area);
    return {
      title: area.contentTitle,
      latlng: new window.kakao.maps.LatLng(area.mapY, area.mapX),
      contentId: area.contentId,
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
  console.log("marker");
  console.log(markers.length);
  for (var i = 0; i < markers.length; i++) {
    console.log(markers[i]);
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
  //getPath();
  console.log(props.plan);
  if (window.kakao && window.kakao.maps) {
    console.log("loadMap");
    loadMap();
  } else {
    console.log("loadScript");
    loadScript();
  }
  console.log("load 완료");
  console.log(map);

});

</script>

<template>    
  <div id="map"></div>
</template>

<style scoped>
#map {
  width: 35vw;
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
</style>

import { localAxios } from "@/util/http-commons";

const local = localAxios();

const url = "/hotplace";

function findTop() {
  return local
    .get(`${url}/top`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error in findTop:", error);
      throw error; // 에러를 다시 던져서 상위 컴포넌트에서도 에러를 처리할 수 있도록 함
    });
}

function getFiles(param, success, fail) {
  local.get(`${url}/download`, { params: param }).then(success).catch(fail);
}

function findAllList() {
  return local
    .get(`${url}/all`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error in findTop:", error);
      throw error; // 에러를 다시 던져서 상위 컴포넌트에서도 에러를 처리할 수 있도록 함
    });
}

function findCodeAll(param) {
  return local.get(`${url}/`, { params: param }).then((response) => {
    return response;
  });
}

function findLike(param) {
  return local.get(`${url}/likeList`, { params: param }).then((response) => {
    return response;
  });
}

function isLike(param) {
  return local.get(`${url}/isLike`, { params: param }).then((response) => {
    return response;
  });
}

function findOne(hotplaceNo) {
  return local.get(`${url}/${hotplaceNo}`).then((response) => {
    return response;
  });
}

function like(param, success, fail) {
  console.log(param);
  local.post(`${url}/likes`, JSON.stringify(param)).then(success).catch(fail);
}

function dislike(param, success, fail) {
  console.log("dislike");
  local.post(`${url}/dislikes`, JSON.stringify(param)).then(success).catch(fail);
}

async function writehotplace(hotplace) {
  try {
    const response = await local.post(`/hotplace/`, hotplace);
    return response.data;
  } catch (error) {
    // 에러 처리를 원하는 대로 추가
    console.error("Error writing hotplace:", error);
    throw error;
  }
}

async function writehotplaceFile(formData, success, fail) {
  await local
    .post(`/hotplace/file`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(success)
    .catch(fail);
}

export {
  writehotplaceFile,
  findTop,
  findAllList,
  findCodeAll,
  findOne,
  findLike,
  like,
  dislike,
  getFiles,
  writehotplace,
  isLike,
};

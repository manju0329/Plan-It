import { localAxios } from "@/util/http-commons";

const local = localAxios();

const url = "/member";

function registMember(userInfo, success, fail) {
  local
    .post(`${url}/register`, JSON.stringify(userInfo.value))
    .then(success)
    .catch(fail);
}

function listMember(param, success, fail) {
  local.get(`/admin/${url}/list`, { params: param }).then(success).catch(fail);
}

function detailMember(userId, success, fail) {
  local.get(`/admin/${url}/info/${userId}`).then(success).catch(fail);
}

function deleteMember(userId, success, fail) {
  local.get(`/admin/${url}/delete/${userId}`).then(success).catch(fail);
}

export { registMember, listMember, detailMember, deleteMember };

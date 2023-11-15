import { localAxios } from "@/util/http-commons";

const local = localAxios();

const url = "/member";

function registMember(userInfo, success, fail) {
  local.post(`${url}/register`, JSON.stringify(userInfo.value)).then(success).catch(fail);
}

async function login(user, success, fail) {
  await local.post(`${url}/login`, JSON.stringify(user)).then(success).catch(fail);
}

async function tokenRegeneration(user, success, fail) {
  api.defaults.headers["refresh-token"] = sessionStorage.getItem("refresh-token"); //axios header에 refresh-token 셋팅
  await local.post(`${url}/refresh`, user).then(success).catch(fail);
}

async function logout(userid, success, fail) {
  await local.post(`${url}/logout/${userid}`).then(success).catch(fail);
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
async function findById(userid, success, fail) {
  local.defaults.headers["access-token"] = sessionStorage.getItem("access-token");
  await local.get(`${url}/${userid}`).then(success).catch(fail);
}

export {
  registMember,
  listMember,
  detailMember,
  deleteMember,
  login,
  tokenRegeneration,
  logout,
  findById,
};

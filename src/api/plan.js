import { localAxios } from "@/util/http-commons";

const local = localAxios();

const url = "/plan";

function viewPlan(param, success, fail) {
  console.log("전송된 param : " + param.userId);
  local
    .get(`${url}` + `/view`, { params: param })
    .then(success)
    .catch(fail);
}

function writeNewPlan(param, success, fail) {
  console.log("전송된 param : ");
  console.log(JSON.stringify(param));
  local
    .post(`${url}` + `/add`, JSON.stringify(param))
    .then(success)
    .catch(fail);
}

function totPlan(param, success, fail) {
  console.log("전송된 param : ");
  console.log(param);
  local.get(`${url}/totPlan`, { params: param }).then(success).catch(fail);
}

function viewPlanDetail(planId, success, fail) {
  console.log("전송된 planId : ");
  console.log(planId);
  local.get(`${url}/view/${planId}`).then(success).catch(fail);
}

function nameCheck(param, success, fail) {
  console.log("전송된 param : " + param);
  return new Promise((resolve, reject) => {
    local
      .get(`${url}/check/${param}`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
  //local.get(`${url}` + `/check`, param).then(success).catch(fail);
}

function deletePlan(planId, success, fail) {
  local.delete(`${url}/delete/${planId}`).then(success).catch(fail);
}

function modifyPlan(param, success, fail) {
  console.log("전송된 param : ");
  console.log(param);
  local
    .post(`${url}` + `/update`, JSON.stringify(param))
    .then(success)
    .catch(fail);
}

export { viewPlan, writeNewPlan, nameCheck, viewPlanDetail, deletePlan, totPlan, modifyPlan };

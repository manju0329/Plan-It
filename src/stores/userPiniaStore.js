import { defineStore } from "pinia";
import jwtDecode from "jwt-decode";
import router from "@/router";
import Swal from "sweetalert2";

const msg = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: true,
});

import { login, tokenRegeneration, logout, findById, modifyMember } from "@/api/member";
//npm i pinia-plugin-persistedstate --force
export const userStore = defineStore("userPiniaStore", {
  persist: {
    storage: sessionStorage, //쓰고싶은 스토리지(세션 또는 로컬)
  },
  state: () => ({
    isLogin: false,
    isLoginError: false,
    userInfo: null,
    isValidToken: false,
  }),
  getters: {
    checkLogin: (state) => {
      return state.isLogin;
    },
    checkUserInfo: (state) => {
      return state.userInfo;
    },
    checkToken: (state) => {
      return state.isValidToken;
    },
  },
  actions: {
    async userConfirm(user) {
      await login(
        user,
        ({ data }) => {
          console.log(data);
          if (data.message === "SUCCESS") {
            let accessToken = data["access-token"];
            let refreshToken = data["refresh-token"];

            this.isLogin = true;
            this.isLoginError = false;
            this.isValidToken = true;
            sessionStorage.setItem("access-token", accessToken);
            sessionStorage.setItem("refresh-token", refreshToken);

            msg.fire({
              icon: "success",
              title: "로그인에 성공하였습니다.",
            });
          } else {
            this.isLogin = false;
            this.isLoginError = true;
            this.isValidToken = false;
            msg.fire({
              icon: "error",
              title: "아이디나 비밀번호를 다시 확인해주세요.",
            });
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },
    async getUserInfo(token) {
      let decodeToken = jwtDecode(token);
      console.log("2. getUserInfo() decodeToken :: ", decodeToken);
      await findById(
        decodeToken.userid,
        ({ data }) => {
          if (data.message === "SUCCESS") {
            this.userInfo = data.userInfo;
          } else {
            console.log("유저 정보 없음!!!!");
          }
        },
        async (error) => {
          console.log(
            "getUserInfo() error code [토큰 만료되어 사용 불가능.] ::: ",
            error.response.status
          );
          this.isValidToken = false;
          this.tokenRegeneration();
        }
      );
    },
    async tokenRegeneration() {
      console.log("토큰 재발급 >> 기존 토큰 정보 : {}", sessionStorage.getItem("access-token"));
      await tokenRegeneration(
        JSON.stringify(this.userInfo),
        ({ data }) => {
          if (data.message === "SUCCESS") {
            let accessToken = data["access-token"];
            sessionStorage.setItem("access-token", accessToken);
            this.isValidToken = true;
          }
        },
        async (error) => {
          // HttpStatus.UNAUTHORIZE(401) : RefreshToken 기간 만료 >> 다시 로그인!!!!
          if (error.response.status === 401) {
            console.log("갱신 실패");
            // 다시 로그인 전 DB에 저장된 RefreshToken 제거.
            await logout(
              this.userInfo.userid,
              ({ data }) => {
                if (data.message === "SUCCESS") {
                  console.log("리프레시 토큰 제거 성공");
                } else {
                  console.log("리프레시 토큰 제거 실패");
                }
                msg.fire({
                  icon: "error",
                  title: "로그인 만료! 다시 로그인해 주세요.",
                });
                this.isLogin = false;
                this.userInfo = null;
                this.isValidToken = false;
                router.push({ name: "signin-basic" });
              },
              (error) => {
                console.log(error);
                this.isLogin = false;
                this.userInfo = null;
              }
            );
          }
        }
      );
    },
    async userLogout(userid) {
      await logout(
        userid,
        ({ data }) => {
          if (data.message === "SUCCESS") {
            this.isLogin = false;
            this.userInfo = null;
            this.isValidToken = false;
          } else {
            console.log("유저 정보 없음!!!!");
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },
    async modifyUserInfo(user) {
      console.log(user);
      await modifyMember(
        user,
        ({ data }) => {
          if (data.message === "SUCCESS") {
            this.userInfo = data.userInfo;

            msg.fire({
              icon: "success",
              title: "회원 정보가 변경되었습니다.",
            });
          } else {
            console.log("유저 정보 없음!!!!");
          }
        },
        async (error) => {
          console.log(error.response.status);
          this.isValidToken = false;
          this.tokenRegeneration();
        }
      );
    },
  },
});

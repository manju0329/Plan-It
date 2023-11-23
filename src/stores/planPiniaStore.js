import { defineStore } from "pinia";
import router from "@/router";
import createPersistedState from "pinia-plugin-persistedstate";

export const planStore = defineStore("planPiniaStore", {
  persist: {
    storage: sessionStorage,
  },
  state: () => ({
    plans: [
      {
        contentId: null,
        contentTitle: null,
        mapX: null,
        mapY: null,
        image: null,
        addr: null,
      },
    ],
    planInfo: [
      {
        planId: null,
        planName: null,
        category: null,
        startDate: null,
        endDate: null,
      },
    ],
    hotplacePlan: [
      {
        planId: null,
      },
    ],
  }),
  getters: {
    getContentId: (state) => state.plans[state.plans.length - 1].contentId,
    // getTitle: (state) => state.plans[state.plans.length - 1].title,
  },
  actions: {
    async saveAttractions(param) {
      this.plans = [];
      if (Array.isArray(param)) {
        const newPlans = param.map((item) => ({
          contentId: item.contentId,
          //   title: item.title,
        }));
        this.plans.push(...newPlans);
      } else {
        const newPlan = {
          contentId: param.contentId,
          //   title: param.title,
        };
        this.plans.push(newPlan);
      }
    },
    async saveAttractionsDetail(param) {
      this.plans = [];
      if (Array.isArray(param)) {
        const newPlans = param.map((item) => ({
          contentId: item.contentId,
          contentTitle: item.contentTitle,
          mapX: item.mapX,
          mapY: item.mapY,
          image: item.image,
          addr: item.addr,
        }));
        this.plans.push(...newPlans);
      } else {
        const newPlan = {
          contentId: param.contentId,
          contentTitle: param.contentTitle,
          mapX: param.mapX,
          mapY: param.mapY,
          image: param.image,
          addr: param.addr,
        };
        this.plans.push(newPlan);
      }
    },
    async saveHotPlaceInfo(param) {
      this.hotplacePlan = [];
      if (Array.isArray(param)) {
        const newPlans = param.map((item) => ({
          contentId: item,
        }));
        this.hotplacePlan = newPlans;
      } else {
        const newPlan = {
          contentId: item,
        };
        this.hotplacePlan = newPlan;
      }
    },
    async savePlanInfo(param) {
      this.planInfo = [];
      if (Array.isArray(param)) {
        const newPlans = param.map((item) => ({
          planId: item.planId,
          planName: item.planName,
          category: item.categoryId,
          startDate: item.startDate,
          endDate: item.endDate,
        }));
        this.planInfo.push(...newPlans);
      } else {
        const newPlan = {
          planId: param.planId,
          planName: param.planName,
          category: param.categoryId,
          startDate: param.startDate,
          endDate: param.endDate,
        };
        this.planInfo.push(newPlan);
      }
    },
    async removeAttractions() {
      this.plans = []; // state 초기화
    },
    async removeHotplaces() {
      console.log("call!");
      this.hotplacePlan = []; // state 초기화
    },
  },
});

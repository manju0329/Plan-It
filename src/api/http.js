import axios from "axios";

// axios 객체 생성
export default axios.create({
  //baseURL: 'http://localhost', // .env 로 옮기기
  //baseURL: process.env.VITE_BACKEND_BASE_URL,
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

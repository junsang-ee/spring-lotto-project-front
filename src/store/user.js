import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserInfoStore = defineStore("userInfo", () => {
  const userInfo = ref(null);

  const setInfo = (val) => {
    userInfo.value = val;
  }

  const getInfo = () => userInfo.value;

  const reset = () => setInfo(null);
  
  const isNullable = () => getInfo() === null;

  return { setInfo, getInfo, userInfo, reset, isNullable }
}, { persist: true })
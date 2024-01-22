import { defineStore } from "pinia"
import { ref } from "vue";

export const useTokenStore = defineStore("auth", () => {
  const token = ref(null);
  const setToken = (val) => {
    token.value = val
  }
  const getToken = () => token.value;

  const reset = () => setToken(null)

  return { setToken, getToken, reset, token }
}, { persist: true })
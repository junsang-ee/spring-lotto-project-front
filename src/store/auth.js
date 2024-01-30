import { defineStore } from "pinia"
import { ref } from "vue";

export const useTokenStore = defineStore("auth", () => {

  const token = ref(null);

  const setToken = (val) => token.value = val;

  const getToken = () => token.value;

  const reset = () => setToken(null);

  const isNullable = () => getToken() === null;

  return { setToken, getToken, reset, isNullable, token }
}, { persist: true })
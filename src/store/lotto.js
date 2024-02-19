import { defineStore } from "pinia"
import { ref } from "vue";

export const useLottoStore = defineStore("lotto", () => {

  const lotto = ref({
    firstNumber: null,
    secondNumber: null,
    thirdNumber: null,
    fourthNumber: null,
    fifthNumber: null,
    sixthNumber: null
  });

  const setLotto = (val) => lotto.value = val;

  const getLotto = () => lotto.value;

  const reset = () => setLotto(null);

  return { setLotto, getLotto, reset, lotto }
}, { persist: true })
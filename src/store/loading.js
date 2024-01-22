import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";


export const useLoadingStore = defineStore("loading", () => {

  const loading = ref(false);

  const setLoading = (value) => {
    loading.value = value;
  }

  watch(loading, (l) => {
    console.log(`Loading!!! ${ l }`)
  })

  return { setLoading, isLoading: computed(() => loading.value) }
})
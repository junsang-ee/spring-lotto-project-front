import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";


export const usePostStore = defineStore("postTemp", () => {

  const post = ref({
    id: null,
    title: null,
    content: null
  })

  const setId = (value) => post.value.id = value;

  const setTitle = (value) => post.value.title = value;

  const setContent = (value) => post.value.content = value;

  const setPostTemp = (value) => {
    post.value.id = value.id;
    post.value.title = value.title;
    post.value.content = value.content;
  };

  const getId = () => post.value.id;

  const getTitle = () => post.value.title;

  const getContent = () => post.value.content;

  const getPostTemp = () => post.value;

  const reset = () => post.value = null;

  return { setId, setTitle, setContent, getId, getTitle, getContent, setPostTemp, getPostTemp, reset }
}, { persist: true })
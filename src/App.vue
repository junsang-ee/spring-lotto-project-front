<script setup>
import { onMounted, ref} from "vue";
import NumberGridModalView from "./components/NumberGridModalView.vue"

const exceptList = ref([]);
const needsList = ref([]);
const isShowModal = ref(false);

const openNoticeModalView = () => {
  alert("Welcome junsang-lotto site");
}

function closeModal() {
  isShowModal.value = false;
}

function openModal() {
  isShowModal.value = true;
}

function addExceptNumber() {
  alert("add except number button");
}

function addNeedsNumber() {
  alert("add needs number button");
}

function welcomeNotice() {
  alert("준상 로또 페이지에 접속하신것을 진심으로 환영합니다!");
}

onMounted(openNoticeModalView);

</script>

<template>
  <div>
    <div class="container">
      <div class="except-container">
        <h1 class="title">제외할 번호 목록</h1>
        <div class="btn-add btn-except">
          <button class="btn" @click="openModal">제외할 번호 추가하기</button>
        </div>
      </div>
      <div class="needs-container">
        <h1 class="title">포함되어야 할 번호 목록</h1>
        <div class="btn-add btn-needs">
          <button @click="openModal">포함되어야 할 번호 추가하기</button>
        </div>
      </div>
    </div>
    <div>
      <h1>로또 결과</h1>
    </div>
    <div>
      <NumberGridModalView :isShow="isShowModal" @close="closeModal">
        <template #default>

        </template>
      </NumberGridModalView>
    </div>
  </div>

</template>

<style scoped>
.container {
  display: flex;
}

.except-container, .needs-container {
  flex: 1;
  padding: 20px;
  border: 1px solid #ccc; 
}

.title {
  text-align: center;
}

.btn-add {
  text-align: right;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.25s;
}

</style>

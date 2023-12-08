<script setup>
import { onMounted, ref} from "vue";
import NumberGridModalView from "./components/NumberGridModalView.vue"
import axios from "axios";

const exceptList = ref([]);
const needsList = ref([]);
const isNeeds = ref(false);
const isShowModal = ref(false);
const randomLottoList = ref([]);
// const openNoticeModalView = () => {
//   alert("Welcome Junsang-lotto site");
// }

const closeModal = ({checkedExcepts, checkedNeeds}) => {
  exceptList.value = checkedExcepts;
  needsList.value = checkedNeeds;
  isShowModal.value = false;
}

const openModal = (needs) => {
  isShowModal.value = true;
  isNeeds.value = needs;
}

const addExceptNumber = () => {
  alert("add except number button");
}

const addNeedsNumber = () => {
  alert("add needs number button");
}

const getConvertedToString = (list) => {
  if (!list.length) 
    return null;
  return list.join(",");
}

const welcomeNotice = () => {
  alert("준상 로또 페이지에 접속하신것을 진심으로 환영합니다!");
}

const validLottoLength = () => {
  if (needsList.value.length >= 6) {
    console.log("포함할 로또 목록은 6개를 초과할 수 없습니다.");
  }
  if (exceptList.value.length >= 39) {
    console.log("제외할 로또 목록은 39개를 초과할 수 없습니다.");
  }
}

const getLottoList = async () => { 
  try {
    let requestUrl = "/api/lotto/random-list"
    let price = 3000;
    const {data} = await axios.get(requestUrl, {
      params: {
        price: price,
        exceptList: getConvertedToString(exceptList.value),
        needsList: getConvertedToString(needsList.value)
      }
    });
    if (data.code === 0) {
      randomLottoList.value = data.data.lottoList;
    } else {
      alert("Error : " + data.message);
    }
  } catch (error) {
    console.log(error);
  }
}
// onMounted(openNoticeModalView);

</script>

<template>
  <div>
    <div class="container">
      <div class="except-container">
        <h1 class="title">제외할 번호 목록</h1>
        <div class="btn-add btn-except">
          <button class="btn" @click="openModal(false)">제외할 번호 추가하기</button>
        </div>
      </div>
      <div class="needs-container">
        <h1 class="title">포함되어야 할 번호 목록</h1>
        <div class="btn-add btn-needs">
          <button @click="openModal(true)">포함할 번호 추가하기</button>
        </div>
      </div>
    </div>
    <div>
      <div class="except-list-container">제외한 로또 번호 목록 :
        <span v-for="element in exceptList" :key="element" class="except-list">
          {{ element }}
        </span>
      </div>
      <div class="needs-list-container">포함할 로또 번호 목록 :
        <span v-for="element in needsList" :key="element" class="needs-list">
          {{ element }}
        </span>
      </div>      
      <div>
        <button @click="getLottoList">test getRandomList Button</button>
      </div>
    </div>
    <div class="random-lotto-result-container">
      <div> 랜덤 로또 결과 </div>
      <div class="random-lotto-result">
        <div v-for="lotto in randomLottoList" :key="lotto" class="random-lotto-result-list">
          <span class="random-lotto-element first-number">{{ lotto.firstNumber }}, </span>
          <span class="random-lotto-element second-number">{{ lotto.secondNumber }}, </span>
          <span class="random-lotto-element third-number">{{ lotto.thirdNumber }}, </span>
          <span class="random-lotto-element fourth-number">{{ lotto.fourthNumber }}, </span>
          <span class="random-lotto-element fifth-number">{{ lotto.fifthNumber }}, </span>
          <span class="random-lotto-element sixth-number"> {{ lotto.sixthNumber }}</span>
        </div>
      </div>
    </div>
    <div>
      <NumberGridModalView 
        :isShow="isShowModal" 
        :isNeeds="isNeeds" 
        @close="closeModal"
      >
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

.except-list, .needs-list {
  font-size: 25px;
  border: 1px solid transparent;
  margin-left: 10px;
}

.except-list-container, .needs-list-container {
  font-size: 25px;
  border: 1px solid transparent;
}

.random-lotto-element {
  font-size: 30px;
  border: 1px solid transparent;
}

</style>

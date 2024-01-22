<script setup>
import { computed, onMounted, ref} from "vue";
import SelectLottoPop from "./SelectLottoPop.vue"
import {read} from "../../utils/util-axios.js";


const exceptList = ref([]);
const needsList = ref([]);
const isNeeds = ref(false);
const isShowModal = ref(false);
const randomLottoList = ref([]);
const resetNumber = ref(0);

const resetConditionalList = (number) => {
  resetNumber.value = number;
  if (number == 1) {
    exceptList.value = [];
  } else if(number == 2){
    needsList.value = [];
  } else {
    resetNumber.value = 0;
  }
}

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
    let requestUrl = "/api/lotto/random-list";
    let price = 3000; 
    await read(requestUrl, {
      price: price,
      exceptList: getConvertedToString(exceptList.value),
      needsList: getConvertedToString(needsList.value)
    }).then((response) => {
      if (response.data.code === 0) {
        randomLottoList.value = response.data.data.lottoList;
      } else {
        alert("Error : " + response.data.data.message);
      }
    })
  } catch (e) {
    console.log(e.message);
  }
}

const sortedExceptList = computed(function() {
  return exceptList.value.slice().sort((a, b) => a - b);
})

const sortedNeedsList = computed(function() {
  return needsList.value.slice().sort((a, b) => a - b);
})


</script>

<template>
  <div class="main-container">
    <div class="except-container">
      <div class="except-lotto-title">
        제외한 목록
        <div>
          <span v-for="(element, index) in sortedExceptList" :key="index" class="needs-list">
            <span v-if="index === (exceptList.length - 1)">{{ element }}</span>
            <span v-else>{{ element }}, </span>
          </span>
        </div>
        <div>
          <v-btn variant="tonal" @click="openModal(false)" class="btn-except">제외할 로또 번호 추가하기</v-btn>
        </div>
        
      </div>
    </div>
    <div class="needs-container">
      <div class="needs-lotto-title">
        포함할 목록
        <div>
          <span v-for="(element, index) in sortedNeedsList" :key="index" class="needs-list">
            <span v-if="index === (needsList.length - 1)">{{ element }}</span>
            <span v-else>{{ element }}, </span>
          </span>
        </div>
        <div>
          <v-btn variant="tonal" @click="openModal(true)" class="btn-needs">포함할 로또 번호 추가하기</v-btn>
        </div>
      </div>
    </div>
    <div class="reset-btn-container">
      <div class="except-reset-btn-container">
        <v-btn variant="tonal" class="btn-reset-except" @click="resetConditionalList(1)">제외할 번호 초기화</v-btn>
      </div>
      <div class="needs-reset-btn-container">
        <v-btn variant="tonal" class="btn-reset-needs" @click="resetConditionalList(2)">포함할 번호 초기화</v-btn>
      </div>
    </div>
  </div>
  <div>
    <button @click="getLottoList()">랜덤 번호 뽑기</button>
  </div>
  <div class="lotto-list-wrap">
    <table class="tb-lotto-list">
      <colgroup>
        <col width="*" />
      </colgroup>
      <thead>
        <tr>
          <th>#</th>
          <th>첫번째 번호</th>
          <th>두번째 번호</th>
          <th>세번째 번호</th>
          <th>네번째 번호</th>
          <th>다섯번째 번호</th>
          <th>여섯번째 번호</th>
        </tr>
      </thead>
    </table>
  </div>
  <div>
    <SelectLottoPop 
      :isShow="isShowModal" 
      :isNeeds="isNeeds" 
      @close="closeModal"
      :resetNumber="resetNumber"
    >
      <template #default>

      </template>
    </SelectLottoPop>
  </div>
  <!-- <div class="container">
    <div class="container">
      <div class="except-container">
        <h1 class="title">제외할 번호 목록</h1>
        <div>
          <span v-for="element in exceptList" :key="element" class="except-list">
            {{ element }}
          </span>
        </div>
        <div class="btn-add btn-except">
          <button class="btn" @click="openModal(false)">제외할 번호 추가하기</button>
        </div>
      </div>
      <div class="needs-container">
        <h1 class="title">포함할 번호 목록</h1>
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
  </div> -->

</template>

<style scoped>

.test {
  text-align: center;
}

.main-container {
  display: flex;
  border-bottom: 1px solid #1e1d1d;
}

.except-container,
.needs-container {
  flex: 1;
  padding: 5px;
}

.needs-lotto-title,
.except-lotto-title {
  text-align: center;
}

.btn-except,
.btn-needs {
  text-align: right;
}

.btn-reset-needs {
  margin-top: 5px;
}

table {
  width: 100%;
  margin: 0 auto;
  border-collapase: collapse;
  text-align: center;
}

</style>

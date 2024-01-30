<script setup>
import { computed, ref} from "vue";
import SelectLottoPop from "@/views/lottos/SelectLottoPop.vue"
import {read} from "@/utils/util-axios.js";

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
    let requestUrl = "/api/lotto/random";
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
    alert(e.message);
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
</template>

<style scoped>

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
  border-collapse: collapse;
  text-align: center;
}

</style>

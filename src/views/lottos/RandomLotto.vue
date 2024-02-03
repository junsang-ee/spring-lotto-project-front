<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6">
        <v-card class="except-container">
          <v-card-title class="except-lotto-title">제외 목록</v-card-title>
          <v-card-text>
            <div v-if="sortedExceptList.length === 0">목록이 비어 있습니다.</div>
            <div v-else>
              <span v-for="(element, index) in sortedExceptList" :key="index">
                {{ element }}
                <span v-if="index !== (sortedExceptList.length - 1)">, </span>
              </span>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-col>
              <v-btn
                variant="tonal" 
                color="primary"
                @click="openModal(false)"
                text="제외할 로또 번호 추가하기"
              />
            </v-col>
            <v-col justify="end" align="end">
              <v-btn
                variant="tonal"
                color="primary"
                @click="resetConditionalList(1)"
                :disabled="isEnableResetExcepts()"
                text="제외할 번호 초기화"
              />
            </v-col>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6">
        <v-card class="needs-container">
          <v-card-title class="needs-lotto-title">포함 목록</v-card-title>
          <v-card-text>
            <div v-if="sortedNeedsList.length === 0">목록이 비어 있습니다.</div>
            <div v-else>
              <span v-for="(element, index) in sortedNeedsList" :key="index" class="needs-list">
                {{ element }}
                <span v-if="index !== (sortedNeedsList.length - 1)">, </span>
              </span>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-col>
              <v-btn
                variant="tonal"
                color="primary" 
                @click="openModal(true)"
                text="포함할 로또 번호 추가하기"
              />
            </v-col>
            <v-col justify="end" align="end">
              <v-btn 
                variant="tonal"
                color="primary"
                @click="resetConditionalList(2)"
                :disabled="isEnableResetNeeds()"
                text="포함할 번호 초기화"
              />
            </v-col>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

<v-row class="d-flex justify-end" align="center">
  <v-col cols="1">
    <v-select
      v-model="price"
      :items="priceOptions"
      label="금액 선택"
      return-object
      solo
      dense
    />
  </v-col>
  <v-col cols="auto">
    <v-btn 
      color="primary"
      @click="getLottoList"
      text="랜덤 번호 뽑기"
    />
  </v-col>
</v-row>

    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="tableHeaders"
          :items="randomLottoList"
          :search="search"
          :page.sync="page"
          :items-per-page="pageSize"
          @click:row="goPostDetail"
          hide-default-footer
        >
          <template v-slot:no-data>
            <v-alert :value="true" icon="mdi-alert">로또 번호를 랜덤으로 뽑아보세요!</v-alert>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <SelectLottoPop 
      :isShow="isShowModal" 
      :isNeeds="isNeeds" 
      @close="closeModal"
      :resetNumber="resetNumber"
    />
  </v-container>
</template>


<script setup>
import { computed, ref} from "vue";
import SelectLottoPop from "@/views/lottos/SelectLottoPop.vue"
import {read} from "@/utils/util-axios.js";

const tableHeaders = [
    {title: "첫번째 로또 번호", key: "firstNumber", align: "center"},
    {title: "두번째 로또 번호", key: "secondNumber", align: "center"},
    {title: "세 번쨰 로또 번호", key: "thirdNumber", align: "center"},
    {title: "네 번째 로또 번호", key: "fourthNumber", align: "center"},
    {title: "다섯 번째 로또 번호", key: "fifthNumber", align: "center"},
    {title: "여섯 번째 로또 번호", key: "sixthNumber", align: "center"}
]

const exceptList = ref([]);
const needsList = ref([]);
const isNeeds = ref(false);
const isShowModal = ref(false);
const randomLottoList = ref([]);
const resetNumber = ref(0);

const price = ref(null);
const priceOptions = [
  "1,000원", "5,000원", "10,000원", "50,000원"
];

const showCustomPrice = ref(false);

const customPrice = ref("");

const isEnableResetNeeds = () => needsList.value.length === 0;

const isEnableResetExcepts = () => exceptList.value.length === 0;

const resetConditionalList = (number) => {
  let title = number === 1 ? "제외할 목록" : "포함할 목록";
  if (confirm(title + "을 초기화 하시겠습니까?")) {
      resetNumber.value = number;
    if (number == 1) {
      exceptList.value = [];
    } else if(number == 2){
      needsList.value = [];
    } else {
      resetNumber.value = 0;
    }
  }
}

const isCustomPrice = () => {
  showCustomPrice.value = price.value && price.value.name === "직접입력";
}

const togglePrice = () => {
  if (!showCustomPrice.value) showCustomPrice.value = true;
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

const convertList = (list) => {
  if (!list.length) 
    return null;
  return list.join(",");
}

const convertToNumber = (val) => parseInt(val.replace(/,/g, ""));


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
    const response = await read("/api/lotto/random", {
      price: convertToNumber(price.value),
      exceptList: convertList(exceptList.value),
      needsList: convertList(needsList.value)
    })
    randomLottoList.value = response.data.data.lottoList;

  } catch (e) {
    alert(e.message)
  }
}

const sortedExceptList = computed(function() {
  return exceptList.value.slice().sort((a, b) => a - b);
})

const sortedNeedsList = computed(function() {
  return needsList.value.slice().sort((a, b) => a - b);
})

</script>

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

.test-class {
  text-align: right;
}

</style>

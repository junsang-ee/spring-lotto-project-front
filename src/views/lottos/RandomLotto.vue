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
  <v-col cols="auto">
    <v-btn
      color="primary"
      text="동행복권 사이트 바로가기"
      href="https://dhlottery.co.kr/"
      target="_blank"
    />
  </v-col>
  <v-col cols="auto">
    <v-label>로또 번호 발급 이용가능 횟수 : {{ dailyAvailableCount }}</v-label>
  </v-col>
  <v-col cols="2">
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
      @click="resetRandomLottoList"
      text="랜덤 번호 초기화"
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
          v-model:items-per-page="pageSize"
          :headers="tableHeaders"
          :items-length="totalCount"
          :items="randomLottoList"
          :loading="isLoading"
          item-key="id"
          :page.sync="currentPage">
          <template v-slot:no-data>
            <v-alert :value="true" icon="mdi-alert">로또 번호를 랜덤으로 뽑아보세요!</v-alert>
          </template>
        </v-data-table>
        <v-row class="text-center px-4 align-center" wrap>
            <v-col class="text-truncate" cols="12" md="2">
                Total {{ totalCount }} records
            </v-col>
            <v-col cols="12" md="6">
                <v-pagination
                    v-model="currentPage"
                    :length="getPageCount"
                />
            </v-col>
        </v-row>
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
import { computed, onMounted, ref} from "vue";
import SelectLottoPop from "@/views/lottos/SelectLottoPop.vue"
import {read} from "@/utils/util-axios.js";
import { useLottoStore } from "@/store/lotto";

const exceptList = ref([]);
const needsList = ref([]);
const isNeeds = ref(false);
const isShowModal = ref(false);
const randomLottoList = ref([]);
const resetNumber = ref(0);
const price = ref(null);
const dailyAvailableCount = ref(0);
const currentPage = ref(1);
const $lotto = useLottoStore();
const isLoading = ref(false);
const pageSize = ref(10);
const totalCount = ref(0);
const priceOptions = [
  "1,000원", "5,000원", "10,000원", "50,000원"
];
const tableHeaders = [
    {title: "첫번째 로또 번호", key: "firstNumber", align: "center"},
    {title: "두번째 로또 번호", key: "secondNumber", align: "center"},
    {title: "세 번쨰 로또 번호", key: "thirdNumber", align: "center"},
    {title: "네 번째 로또 번호", key: "fourthNumber", align: "center"},
    {title: "다섯 번째 로또 번호", key: "fifthNumber", align: "center"},
    {title: "여섯 번째 로또 번호", key: "sixthNumber", align: "center"}
];

const resetRandomLottoList = () => {
  if (randomLottoList.value.length === 0) return;
  if (confirm("발급받은 랜덤 로또 번호를 초기화하시겠습니까?")) {
    randomLottoList.value = [];
    $lotto.reset();
  }
}

const getPageCount = computed(() => {
    return Math.floor(((totalCount.value-1) / pageSize.value) + 1);
});

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

const closeModal = ({checkedExcepts, checkedNeeds}) => {
  exceptList.value = checkedExcepts;
  needsList.value = checkedNeeds;
  isShowModal.value = false;
}

const openModal = (needs) => {
  isShowModal.value = true;
  isNeeds.value = needs;
}

const convertList = (list) => {
  if (!list.length) 
    return null;
  return list.join(",");
}

const getConvertedPrice = (val) => {
  if (val)
    return parseInt(val.replace(/,/g, ""));
  alert("금액을 선택하지 않았습니다.\n금액 미선택 시, 5개의 랜덤 로또 번호를 발급합니다.");
  return 5000;
}

const getLottoList = async () => {
  try {
    const response = await read("/api/lotto/random", {
      price: getConvertedPrice(price.value),
      exceptList: convertList(exceptList.value),
      needsList: convertList(needsList.value)
    })
    randomLottoList.value = response.data.data.lottoList;
    totalCount.value = randomLottoList.value.length;
    $lotto.setLotto(randomLottoList.value);
    getDailyAvailableCount();
  } catch (e) {
    alert(e.message)
  }
}

const getDailyAvailableCount = async () => {
  try {
    const response = await read("/api/user/available-count");
    dailyAvailableCount.value = response.data.data;
  } catch(e) {
    alert(e.message);
  }
}

const sortedExceptList = computed(function() {
  return exceptList.value.slice().sort((a, b) => a - b);
})

const sortedNeedsList = computed(function() {
  return needsList.value.slice().sort((a, b) => a - b);
})
const init = () => {
  getDailyAvailableCount();
  if ($lotto.getLotto() != null) randomLottoList.value = $lotto.getLotto();
}
onMounted(init);
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

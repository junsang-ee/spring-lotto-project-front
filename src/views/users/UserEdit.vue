<template>
  <v-container>
    <v-card>
      <v-card-title>마이페이지</v-card-title>
      <v-card-text>
        <v-label>이메일: {{ email }}</v-label>
      </v-card-text>
      <v-card-actions>
        <v-btn 
            variant="tonal" 
            color="primary" 
            @click="openPasswordModal()"
            text="비밀번호 수정"
        />
        <v-btn
          variant="tonal" 
          color="primary"         
          @click="logout"
          text="로그아웃"         
        />

        <v-btn
          variant="tonal" 
          color="primary"         
          @click="doRetire"
          text="회원 탈퇴하기"         
        />
      </v-card-actions>
    </v-card>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-data-table-server
            v-model:items-per-page="pageSize"
            :headers="tableHeaders"
            :items-length="totalCount"
            :items="lottoExtractions"
            :loading="isLoading"
            :search="search"
            item-key="id"
            :page.sync="currentPage"
            @update:options="getExtractions"
            class="elevation-1"
          >
            <template v-slot:no-data>
              <v-alert :value="true" icon="mdi-alert">추출한 랜덤 로또 번호가 아직 없습니다.</v-alert>
            </template>
            <template v-slot:item="{ item }">
              <tr class="align-middle pending-default">
                <td v-if="getIsWin(item.firstStatus)" class="win-default">
                  {{ item.firstNumber }}
                </td>
                <td v-else>{{ item.firstNumber }}</td>
                <td v-if="getIsWin(item.secondStatus)" class="win-default">
                  {{ item.secondNumber }}
                </td>
                <td v-else>{{ item.secondNumber }}</td>
                <td v-if="getIsWin(item.thirdStatus)" class="win-default">
                  {{ item.thirdNumber }}</td>
                <td v-else>{{ item.thirdNumber }}</td>
                <td v-if="getIsWin(item.fourthStatus)" class="win-default">
                  {{ item.fourthNumber }}</td>
                <td v-else>{{ item.fourthNumber }}</td>

                <td v-if="getIsWin(item.fifthStatus)" class="win-default">
                  {{ item.fifthNumber }}</td>
                <td v-else>{{ item.fifthNumber }}</td>

                <td v-if="getIsWin(item.sixthStatus)" class="win-default">
                  {{ item.sixthNumber }}</td>
                <td v-else>{{ item.sixthNumber }}</td>

                <td style="color: black;">{{ convertDateOnlyDay(item.createdAt) }}</td>
                
                <td v-if="item.winningResult === 'WON'" class="win-default">
                  {{ convertWinningResult(item.winningResult) }}
                </td>
                <td v-else-if="item.winningResult === 'LOST'" class="lost-default">
                  {{ convertWinningResult(item.winningResult) }}
                </td>
                 <td v-else>{{ convertWinningResult(item.winningResult) }}</td>
              </tr>
            </template>
          </v-data-table-server>
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
    </v-container>
    <v-dialog v-model="isShowPasswordModal" persistent max-width="500px">
      <v-card>
        <v-card-title>비밀번호 수정</v-card-title>
        <v-card-text>
          <v-text-field 
            v-model="currentPassword"
            label="현재 비밀번호 입력"
            type="password"
          />
          <v-text-field 
            v-model="newPassword" 
            label="신규 비밀번호 입력"
            type="password"
            :rules="passwordRule"
          />
          <v-text-field 
            v-model="reEnterPassword" 
            label="신규 비밀번호 재입력" 
            type="password"
          />
          <v-alert 
            v-if="isError" 
            style="text-align:left; 
                   background-color:rgb(255 241 243);
                   color:rgb(232 64 87);"
          >
            <span>{{ errorMessage }}</span>
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-col>
            <v-btn
              block 
              color="primary"
              variant="tonal"
              @click="editPassword()"
              :disabled="modifyPasswordEnabled()"
              text="비밀번호 변경하기"
            />
          </v-col>
          <v-col>
            <v-btn
              block
              color="primary"
              variant="tonal"
              @click="closePasswordModal()"
              text="닫기"
            />
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { read, update } from "@/utils/util-axios.js";
import { useRouter } from "vue-router";
import { useUserInfoStore } from "@/store/user";
import { useTokenStore } from "@/store/auth";
import { useLottoStore } from "@/store/lotto";
import { convertDateOnlyDay } from "@/utils/util-dateConverter";

const router = useRouter();
const $userInfo = useUserInfoStore();
const $auth = useTokenStore();
const $lotto = useLottoStore();
const isShowPasswordModal = ref(false);
const email = $userInfo.getInfo().email;
const currentPassword = ref(null);
const newPassword = ref(null);
const reEnterPassword = ref(null);
const isError = ref(false);
const currentPage = ref(1);
const isLoading = ref(false);
const search = ref(null);
const lottoExtractions = ref([]);
const passwordRuleConfig = /^[^\s]{6,12}$/;
const pageSize = ref(10);
const totalCount = ref(0);
const errorMessage = ref("");

const tableHeaders = [
    {title: "첫번째 로또 번호", key: "firstNumber", align: "center"},
    {title: "두번째 로또 번호", key: "secondNumber", align: "center"},
    {title: "세 번째 로또 번호", key: "thirdNumber", align: "center"},
    {title: "네 번째 로또 번호", key: "fourthNumber", align: "center"},
    {title: "다섯 번째 로또 번호", key: "fifthNumber", align: "center"},
    {title: "여섯 번째 로또 번호", key: "sixthNumber", align: "center"},
    {title: "발급 날짜", key: "createdAt", align: "center"},
    {title: "당첨 결과", key: "winningResult", align: "center"}
];

const getPageCount = computed(() => {
    return Math.floor(((totalCount.value-1) / pageSize.value) + 1);
});

const passwordRule = [
  v => passwordRuleConfig.test(v) || "비밀번호는 6~12 자리로 입력하여야 합니다.(공백 제외)"
]

const convertWinningResult = (status) => {
    if (status === "PENDING") return "미추첨";
    else if (status === "LOST") return "낙첨";
    else return "당첨";
}

const modifyPasswordEnabled = () => 
  newPassword.value !== reEnterPassword.value;

const editPassword = async () => {
  if (currentPassword.value === newPassword.value) {
    isError.value = true;
    errorMessage.value = "현재 비밀번호와 같습니다.";
    return;
  }
  try {
    if (confirm("비밀번호를 수정하시겠습니까?")) {
      await update("/api/user/password", null, {
        oldPassword: currentPassword.value,
        newPassword: newPassword.value
      });
      alert("비밀번호가 정상적으로 수정되었습니다.");
      closePasswordModal();
    }
  } catch(e) {
    alert(e.message);
  }
}

const openPasswordModal = () => isShowPasswordModal.value = true;
const closePasswordModal = () => isShowPasswordModal.value = false;

const logout = () => {
  if (confirm("로그아웃 하시겠습니까?")) {
    initialization();
    router.replace({name:"Login"});
  }
}

const doRetire = async() => {
  if (confirm("정말 회원탈퇴를 하시겠습니까?")) {
    try {
      await update("/api/user/retired");
      alert("정상적으로 회원 탈퇴되었습니다.");
      initialization();
      router.replace({name: "Login"});
    } catch(e) {
      alert(e.message);
    }
  }
};

const getExtractions = async() => {
  isLoading.value = true;
  try {
    const response = await read("/api/lotto/extractions", {
      page: currentPage.value - 1,
      size: pageSize.value
    });
    lottoExtractions.value = response.data.data.list;
    totalCount.value = response.data.data.totalCount;
    isLoading.value = false;
  } catch(e) {
    isLoading.value = false;
    alert(e.message);
  }
}

const getIsWin = (status) => status === "WON";

const initialization = () => {
  $auth.reset();
  $userInfo.reset();
  $lotto.reset();
}

watch(() => isShowPasswordModal.value, (val) => {
  if (!val) {
    isError.value = false;
    errorMessage.value = "";
    currentPassword.value = null;
    reEnterPassword.value = null;
    newPassword.value = null;
  }
});

onMounted(getExtractions);
</script>

<style scoped>
.center-table {
  display: flex;
  justify-content: center;
}

.align-middle {
  vertical-align: middle !important;
  text-align: center !important;
}

.win-default {
  color: #4169E1;
}

.lost-default {
  color: #FF6961;
}

.pending-default {
  color: grey;
}
</style>

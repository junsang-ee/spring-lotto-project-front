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
      </v-card-actions>
    </v-card>

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
import { ref, watch } from "vue";
import { update } from "@/utils/util-axios.js";
import { useRouter } from "vue-router";
import { useUserInfoStore } from "@/store/user";
import { useTokenStore } from "@/store/auth";

const router = useRouter();
const $userInfo = useUserInfoStore();
const $auth = useTokenStore();
const isShowPasswordModal = ref(false);
const email = $userInfo.getInfo().email;
const currentPassword = ref(null);
const newPassword = ref(null);
const reEnterPassword = ref(null);
const isError = ref(false);

const passwordRuleConfig = /^[^\s]{6,12}$/;

const errorMessage = ref("");

const passwordRule = [
  v => passwordRuleConfig.test(v) || "비밀번호는 6~12 자리로 입력하여야 합니다.(공백 제외)"
]

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
    $auth.reset();
    $userInfo.reset();
    router.replace({name:"Login"});
  }
}


watch(() => isShowPasswordModal.value, (val) => {
  if (!val) {
    isError.value = false;
    errorMessage.value = "";
    currentPassword.value = null;
    reEnterPassword.value = null;
    newPassword.value = null;
  }
})
</script>

<style scoped>

</style>

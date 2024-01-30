<template>


<v-dialog width="500" v-model="isShowModal" persistent :click-outside="false">
  <template v-slot:activator="{ props }">
    <v-btn variant="flat" v-bind="props" @click="open">회원가입</v-btn>
  </template>
  <v-card>
      <v-container>
        <v-row>
          <v-col>
            <v-card-title class="title-text">
              회원가입
            </v-card-title>
            <p class="title-text">{{ signupProcedureNotice }}</p>
          </v-col>
        </v-row>
        <v-card-text class="my-4">
          <v-form ref="isValid">
            <v-text-field 
              variant="solo" 
              label="이메일" 
              v-model="signupInfo.email" 
              type="email"
              :rules="emailRule"
            />
            <v-text-field 
              v-if="state === SignupState.SEND_CODE ||
                    state === SignupState.INVALID_CODE ||
                    state === SignupState.EXPIRED_CODE"
              variant="solo"
              label="코드"
              v-model="signupInfo.code"
              type="code"
              maxlength="5"
              :rules="authCodeRule"
            />
            <span>
              <v-btn 
                v-if="state === SignupState.SEND_CODE ||
                      state === SignupState.INVALID_CODE ||
                      state === SignupState.EXPIRED_CODE"
                color="#317aa9" 
                text="코드 재전송"
                @click="sendCode"
                :loading="isLoading"
              />
            </span>

            <v-text-field
              v-if="state === SignupState.SUCCESS_VERIFY_EMAIL" 
              variant="solo"
              label="비밀번호(6자리 ~ 12자리)"
              v-model="signupInfo.password" 
              type="password"
              :rules="passwordRule"
            />
          </v-form>
          <v-btn 
            class="w-100 mt-4 text-white"
            size="x-large"
            color="#317aa9"
            @click="doApi"
            :disabled="isEnableKeepButton()"
            :loading="isLoading"
          > 
            {{ buttonValue }}
          </v-btn>
          <v-btn 
            class="w-100 mt-4 text-white"
            text="닫기"
            size="x-large"
            color="#317aa9"
            :disabled="isLoading"
            @click="close"
          />
        </v-card-text>
      </v-container>
    </v-card>
</v-dialog>
  </template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { write } from "@/utils/util-axios";
import { SignupState} from "@/constants/signup-state.js";

const state = ref(null);
const signupProcedureNotice = ref(null);
const isShowModal = ref(false);
const isValid = ref(null);
const isLoading = ref(false);
const buttonValue = ref("");
const authCodeRuleConfig = /^\d{5}$/;
const emailRuleConfig = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/;
const passwordRuleConfig = /^[^\s]{6,12}$/;

const emailRule = [
  v => emailRuleConfig.test(v) || "이메일을 확인하세요."
]

const authCodeRule = [
  v => authCodeRuleConfig.test(v) || "인증 코드는 5자리 숫자만 입력 가능합니다."
]

const passwordRule = [
  v => passwordRuleConfig.test(v) || "비밀번호는 6~12 자리로 입력하여야 합니다.(공백 제외)"
]

const signupInfo = ref({
  email: null,
  code: null,
  password: null
});

const isEnableKeepButton = () => {
  switch(state.value) {
    case SignupState.ENTER_EMAIL:
      return !emailRuleConfig.test(signupInfo.value.email);
    case SignupState.SEND_CODE:
    case SignupState.INVALID_CODE:
    case SignupState.EXPIRED_CODE:
      return !authCodeRuleConfig.test(signupInfo.value.code);
    case SignupState.SUCCESS_VERIFY_EMAIL:
      return !passwordRuleConfig.test(signupInfo.value.password);

  }
}

const doApi = () => {
  switch(state.value) {
    case SignupState.ENTER_EMAIL:
      sendCode();
      break;
    case SignupState.SEND_CODE:
      verifyEmail();
      break;
    case SignupState.SUCCESS_VERIFY_EMAIL:
      signup();
      break;
  }
}
const signup = async () => {
  isLoading.value = true;
  try {
    await sleep(2000);
    await write("/api/auth/signup", null, {
      email: signupInfo.value.email,
      password: signupInfo.value.password
    });
    isLoading.value = false;
    close();
    alert("회원가입이 정상적으로 완료되었습니다.\n생성한 ID로 로그인하여 서비스를 이용해주세요.");
  } catch(e) {
    isLoading.value = false;
    alert(e.message);
  }
}
const sendCode = async () => {
  isLoading.value = true;
  try {
    const data = await write("/api/auth/email/code", null, {
      email: signupInfo.value.email
    });
    state.value = SignupState.SEND_CODE;
    isLoading.value = false;
  } catch(e) {
    isLoading.value = false;
    alert(e.message);
  }
}

const verifyEmail = async () => {
  isLoading.value = true;
  try {
    await sleep(2500);
    const data = await write("/api/auth/email/verify", null, {
      email: signupInfo.value.email,
      authCode: (signupInfo.value.code).toString()
    })
    isLoading.value = false;
    state.value = SignupState.SUCCESS_VERIFY_EMAIL;
    buttonValue.value = "회원가입";
  } catch(e) {
    if (e.code === 4010) {
      state.value = SignupState.INVALID_CODE;
    } else if (e.code === 4011) {
      state.value = SignupState.EXPIRED_CODE;
    }
    isLoading.value = false;
    alert(e.message);
  }
}

const setInitData = () => {
  state.value = SignupState.ENTER_EMAIL;
  buttonValue.value = "계속하기";
}

const open = () => isShowModal.value = true;
const close = () => isShowModal.value = false;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

watch(() => isShowModal.value, (val) => {
  if (!val) {
    signupInfo.value = {
      email: null,
      code: null,
      password: null
    }
    isLoading.value = false;
    setInitData();
  }
})

watch(() => state.value, (val) => {
  signupProcedureNotice.value = state.value;
  if (val === SignupState.SEND_CODE) {
    signupProcedureNotice.value = signupInfo.value.email + "로 " + state.value;
  }
})
onMounted(setInitData);
</script>

<style scoped>
.title-text {
  text-align: center;
}
</style>
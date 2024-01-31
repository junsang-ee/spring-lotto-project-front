<template>
    <v-dialog width="500" v-model="isShowModal" persistent :click-outside="false">
      <template v-slot:activator="{ props }">
        <v-btn variant="flat" v-bind="props" @click="open">비밀번호가 기억나지 않나요?</v-btn>
      </template>
      <v-card>
          <v-container>
            <v-row>
              <v-col>
                <v-card-title class="title-text">
                  비밀번호 초기화
                </v-card-title>
                <p class="title-text">이메일을 입력한 뒤 임시 비밀번호를 발급받으세요!</p>
              </v-col>
            </v-row>
            <v-card-text class="my-4">
              <v-form ref="isValid">
                <v-text-field
                    variant="solo" 
                    label="이메일"
                    v-model="email"
                    type="email"
                    :rules="emailRule"
                />
              </v-form>
              <v-btn 
                class="w-100 mt-4 text-white"
                text="임시 비밀번호 발급"
                size="x-large"
                color="#317aa9"
                :disabled="isEnableResetPassword()"
                @click="resetPassword"
                :loading="isLoading"
              />
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
import { ref } from "vue";
import { update} from "@/utils/util-axios";

const isShowModal = ref(false);
const email = ref(null);
const isLoading = ref(false);

const emailRuleConfig = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/;

const emailRule = [
  v => emailRuleConfig.test(v) || "이메일을 확인하세요."
]
const isEnableResetPassword = () => !emailRuleConfig.test(email.value);

const resetPassword = async () => {
    isLoading.value = true;
    try {
        await update("/api/auth/password/reset", null, {
            email: email.value
        });
        isLoading.value = false;
        alert(email.value + "로 임시 비밀번호가 정상적으로 발급되었습니다.\n발급받은 임시 비밀번호로 로그인하여 서비스를 이용해주세요.");
        close();
    } catch(e) {
        isLoading.value = false;
        alert(e.message);
    }
}

const open = () => isShowModal.value = true;
const close = () => isShowModal.value = false;

</script>
    
<style scoped>
.title-text {
    text-align: center;
}

</style>
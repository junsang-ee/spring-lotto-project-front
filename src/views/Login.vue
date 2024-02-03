<template>
    <div class="d-flex align-center justify-center" style="height: 100vh">
        <v-sheet width="400" class="mx-auto">
            <div class="login-title">로그인</div>
            <v-form fast-fail ref="isValid">
                <v-text-field 
                  v-model="email" 
                  label="이메일"
                  :rules="emailRule">
                </v-text-field>
                <v-text-field 
                  v-model="password" 
                  label="비밀번호"
                  type="password"
                  :rules="passwordRule">
                </v-text-field>
                <a 
                  href="#" 
                  class="text-body-2 font-weight-regular"
                >
                  <reset-password-edit-pop/>
                </a>

                <v-btn 
                  color="primary"
                  block class="mt-2" 
                  @click="doLogin"
                  text="로그인"
                />
            </v-form>
            <div class="mt-2">
                <p class="text-body-2">아직 JunsangLotto Member 가 아니신가요? 
                  <signup-edit-pop/>
                </p>
            </div>
        </v-sheet>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { read, write } from "@/utils/util-axios";
import { tokenValidator } from "@/utils/util-auth";
import { useTokenStore } from "@/store/auth";
import { useUserInfoStore } from "@/store/user";
import SignupEditPop from "@/views/users/UserSignupEditPop.vue";
import ResetPasswordEditPop from "@/views/users/ResetPasswordEditPop.vue";

const router = useRouter();
const email = ref(null);
const password = ref(null);
const $token = useTokenStore();
const $userInfo = useUserInfoStore();
const isValid = ref(null);

const emailRuleConfig = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/;
const passwordRuleConfig = /^[^\s]{6,12}$/;

const emailRule = [
  v => emailRuleConfig.test(v) || "이메일을 확인하세요."
]

const passwordRule = [
  v => passwordRuleConfig.test(v) || "비밀번호는 6~12 자리로 입력하여야 합니다.(공백 제외)"
]


const doLogin = async () => {
  const {valid} = await isValid.value.validate();
  try {
    if (valid) {
      const result = await write("/api/auth/login", null, {
        email: email.value,
        password: password.value,
      });
      const token = tokenValidator(result.data?.data?.jwt);
      $token.setToken(token);

      const myInfo = await read("/api/user/me");
      $userInfo.setInfo(myInfo.data.data);
      router.replace({name: "RandomLotto"});
    } else
      alert("이메일 또는 비밀번호를 확인하세요.");
  } catch (e) {
    console.log(e);
    if (e.code === 101) alert("입력 정보를 확인해 주세요.");
    else alert(e.message);
  }
};

</script>

<style scope>
.login-title {
    text-align: center;
    font-size: 40px;
    margin-bottom: 20px;
}
</style>
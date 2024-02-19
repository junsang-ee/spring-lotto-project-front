<template>
  <v-card v-if="getIsLogOffed()">
    <v-tabs v-model="tab" bg-color="primary">
      <v-tab value="login">
        <span @click="goComponent('Login')">로그인</span>
      </v-tab>
    </v-tabs>
    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="login">
            로그인
          </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
  <v-card v-else>
    <v-tabs v-model="tab" bg-color="primary">
      <v-tab value="my-page">
        <span @click="goMyPage()">내 정보</span>
      </v-tab>
      <v-tab value="random-lotto">
        <span @click="goComponent('RandomLotto')">랜덤 로또</span>
      </v-tab>
      <div v-if="getIsAdmin()">
        <v-tab value="post-manage">
          <span @click="goComponent('PostManage')">게시물 관리</span>
        </v-tab>
        <v-tab value="user-manage">
          <span @click="goComponent('UserManage')">유저 관리</span>
        </v-tab>
        <v-tab value="lotto-history-manage">
          <span @click="goComponent('LottoHistoryManage')">LottoHistory 관리</span>
        </v-tab>
      </div>
      <v-tab v-for="board in boards" :key='board.id'>
        <span v-if="!getIsAdmin()" @click="goComponent('PostList', board.id, board.name)">{{ board.name }}</span>
      </v-tab>
    </v-tabs>
    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="my-page">
          내 정보
        </v-window-item>
        <v-window-item value="random-lotto">
          랜덤 로또
        </v-window-item>
        <div v-if="getIsAdmin()">
          <v-window-item value="post-manage">
            게시글 관리
          </v-window-item>
          <v-window-item value="user-manage">
            유저 관리
          </v-window-item>
          <v-window-item value="lotto-history-manage">
            LottoHistory 관리
          </v-window-item>
        </div>
        <v-window-item v-for="board in boards" :key='board.id'>
          <span v-if="!getIsAdmin()">{{board.name}}</span>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
  <div class="router">
    <router-view :key="$route.path"/>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { read } from "@/utils/util-axios.js";
import { useRouter} from "vue-router";
import { useTokenStore } from "@/store/auth";
import { useUserInfoStore } from "@/store/user";
import {tokenValidator} from "@/utils/util-auth";

const router = useRouter();
const boards = ref([]);
const $auth = useTokenStore();
const $userInfo = useUserInfoStore();


router.beforeEach((to, from, next) => {
  document.title = "JunsangLotto";
  if (to?.name?.startsWith("Login")) {
    $auth.reset()
    $userInfo.reset();
    next();
  } else {
    try {
      if (tokenValidator($auth.getToken())) {
        getBoards();
        next();
      }
    } catch (toPath) {
      if (from.name === "Login") {
        next(false);
      } else {
        next({name: toPath});
      }
       
    }
  }
})

const getBoards = async () => {
  try {
    const response = await read("/api/board");
    boards.value = response.data.data.boards;
  } catch (e) {
    console.log(e.message);
  }
}

const goMyPage = () => {
  router.push({
    name:"UserEdit"
  });
}


const goComponent = (componentName, boardId, boardName) => {
  if (boardId) {
    router.push({name:componentName, params:{boardId:boardId}, query:{boardName:boardName}});
  } else
    router.push({name:componentName});
}
const logout = () => {
  if (confirm("로그아웃 하시겠습니까?")) {
    $auth.reset();
    $userInfo.reset();
    router.replace({name:"Login"});
  }
}

const getIsLogOffed = () => $auth.isNullable() && $userInfo.isNullable();
const getIsAdmin = () => $userInfo.getInfo()?.role?.startsWith("ADMIN");

</script>

<style scoped>
.tab-title {
  border: 1px solid transparent;
}

</style>

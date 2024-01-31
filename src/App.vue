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
    const result = await read("/api/board");
    boards.value = result.data.data.boards;
  } catch (e) {
    console.log(e.message);
  }
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

const getIsLogOffed = () => {
  return $auth.isNullable() && $userInfo.isNullable();
}

</script>

<template>
  <v-card>
    <v-tabs v-model="tab" bg-color="primary">
      <div v-if="getIsLogOffed()">
        <v-tab value="loginOut">
          <span @click="goComponent('Login')">로그인</span>
        </v-tab>
      </div>
      <div v-else>
        <v-tab value="loginOut">
          <span @click="logout">내 정보</span>
        </v-tab>
        <v-tab value="random-lotto">
          <span @click="goComponent('RandomLotto')">랜덤 로또</span>
        </v-tab>
        <v-tab v-for="board in boards" :key='board.id'>
          <span @click="goComponent('PostList', board.id, board.name)">{{ board.name }}</span>
        </v-tab>
      </div>
    </v-tabs>
    <v-card-text>
      <v-window v-model="tab">
        <div v-if="getIsLogOffed()">
          <v-window-item value="loginOut">
            로그인
          </v-window-item>
        </div>
        <div v-else>
          <v-window-item value="loginOut">
            로그아웃
          </v-window-item>
          <v-window-item value="random-lotto">
            랜덤 로또
          </v-window-item>
          <v-window-item v-for="board in boards" :key='board.id'>
            <span>{{board.name}}</span>
          </v-window-item>
        </div>
      </v-window>
    </v-card-text>
  </v-card>
  <div class="router">
    <router-view :key="$route.path"/>
  </div>
  
</template>

<style scoped>
.tab-title {
  border: 1px solid transparent;
}

</style>

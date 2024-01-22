<script setup>
import { onMounted, ref} from "vue";
import { read } from "@/utils/util-axios.js";
import { useRouter} from "vue-router";

const router = useRouter();
const exceptList = ref([]);
const needsList = ref([]);
const isNeeds = ref(false);
const isShowModal = ref(false);
const boards = ref([]);

const testLogin = () => {
  router.replace({name: "Login"})
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

const addNeedsNumber = () => {
  alert("add needs number button");
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

const getBoards = async () => {
  try {
    const res = await read("/api/board");
    boards.value = res.data.data.boards;
  } catch (e) {
    console.log(e.message);
  }
}

const goComponent = (componentName, boardId) => {
  if (boardId) {
    router.push({name:componentName, params:{boardId:boardId}});
  } else
    router.push({name:componentName});
}

onMounted(getBoards);

</script>

<template>
  
  <!-- <div>
    <v-toolbar title="Application"></v-toolbar>
    <div class="container">
      <div class="side-category-container">
        <ul>
          <li><router-link :to="{name:'RandomLotto'}"> 랜덤 로또 </router-link></li>
          <li v-for="(board, idx) in boards" :key="idx">
            <router-link :to="{
              name:'PostList', 
              params:{boardId:board.id}, 
              query:{boardName:board.name}}"
            > 
            <span> {{ board.name }} </span>
          </router-link>
          </li>
          <li><router-link to="/test">test</router-link></li>
        </ul>
      </div>
      <div class="main-container">
        <div class="router">
          <router-view :key="$route.path"/>
        </div>
      </div>
    </div>
  </div> -->
  <!-- <v-app>
    <v-navigation-drawer>
      <v-list-item title="My Application" subtitle="Login"></v-list-item>
      <v-divider></v-divider>
      <v-list-item><router-link :to="{name:'RandomLotto'}"> 랜덤 로또 </router-link></v-list-item>
      <v-list-item v-for="board in boards" :key='board.id'>
        <router-link :to="{name:'PostList', params:{boardId:board.id}}"> {{ board.name }} </router-link>
      </v-list-item>

    </v-navigation-drawer>
    <div class="router">
      <router-view :key="$route.path"/>
    </div>
  </v-app> -->
  <v-card>
    <v-tabs v-model="tab" bg-color="primary">
      <v-tab value="login">
        <span @click="goComponent('Login')">로그인</span>
      </v-tab>
      <v-tab value="random-lotto">
        <!-- <router-link :to="{name:'RandomLotto'}"> 
          
        </router-link> -->
        <span @click="goComponent('RandomLotto')">랜덤 로또</span>
      </v-tab>
      <v-tab v-for="board in boards" :key='board.id' value="free-board">
        <span @click="goComponent('PostList', board.id)">{{ board.name }}</span>
      </v-tab>
    </v-tabs>
    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="login">
          로그인
        </v-window-item>
        <v-window-item value="random-lotto">
          랜덤 로또
        </v-window-item>
        <v-window-item value="free-board">
          자유게시판
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
  <div class="router">
    <router-view :key="$route.path"/>
  </div>
</template>

<style scoped>
/* .container {
  display: flex;
  height: 100vh;
}

.side-category-container {
  width: 20%;
  background-color: #f0f0f0;
  padding: 5px;
}

.main-container {
  flex: 1;
  padding: 20px;
}

.side-category-container ul {
  list-style: none;
  padding: 0;
} */


/* .container {
  display: flex;
}

.main {
  display: flex;
  width: 100%;
  min-height: 100%;
  height: 100%;
}

.menu-wrapper {
  height: 100vh;
  padding: 10px;
  list-style-type: none;
  width: 300px;
  height: 100%;
  padding: 30px 10px 0;
  list-style-type: none;
  width: 300px;
  border-right: 1px solid #000;
}

.except-container, .needs-container {
  flex: 1;
  padding: 20px;
  border: 1px solid #ccc; 
}

.title {
  text-align: center;
}

.btn-add {
  text-align: right;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.25s;
}

.except-list, .needs-list {
  font-size: 25px;
  border: 1px solid transparent;
  margin-left: 10px;
}

.except-list-container, .needs-list-container {
  font-size: 25px;
  border: 1px solid transparent;
}

.random-lotto-element {
  font-size: 30px;
  border: 1px solid transparent;
} */

.tab-title {
  border: 1px solid transparent;
}

</style>

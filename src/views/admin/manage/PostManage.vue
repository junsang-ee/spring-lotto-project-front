<template>
  <v-container>
    <!-- 게시판 관리 카테고리 -->
    <v-card>
      <v-card-title>게시판 관리</v-card-title>
      <v-card-text>
        <!-- 게시판 목록 표시 -->
        <v-list>
          <v-list-item v-for="(board, index) in boards" :key="index" @click="selectBoard(board)">
            <v-list-item-content>
              <v-list-item-title>{{ board.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <!-- 새 게시판 생성 버튼 -->
        <v-btn color="primary" @click="openCreateBoardModal()">새 게시판 생성</v-btn>
        <!-- 게시판 삭제 버튼 -->
        <v-btn color="error" @click="deleteBoard">게시판 삭제</v-btn>
      </v-card-actions>
    </v-card>

    <!-- 게시글 목록 -->
    <v-card>
      <v-card-title>게시글 목록</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item v-for="(post, index) in selectedBoardPosts" :key="index">
            <v-list-item-content>
              <v-list-item-title>{{ post.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>

  <v-dialog v-model="isShowCreateBoardModal" max-width="500px">
      <v-card>
        <v-card-title>게시판 생성</v-card-title>
        <v-card-text>
          <v-text-field v-model="board.name" label="게시판 이름" required></v-text-field>
          <v-checkbox v-model="board.disclosureType" label="전체공개"></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="createBoard">생성</v-btn>
          <v-btn color="secondary" @click="closeCreateBoardModal">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { read } from "@/utils/util-axios.js";

const boards = ref([]);
const board = ref({
    name: null,
    disclosureType: false
})
const getBoards = async () => {
  try {
    const result = await read("/api/board");
    boards.value = result.data.data.boards;
  } catch (e) {
    console.log(e.message);
  }
}

const createBoard = () => {

}
const selectBoard = (board) => {
    console.log("selectBoard");
}

const isShowCreateBoardModal = ref(false);

const openCreateBoardModal = () => isShowCreateBoardModal.value = true;
const closeCreateBoardModal = () => isShowCreateBoardModal.value = false;

onMounted(getBoards);

</script>

<style scoped>

</style>

<template>
  <v-container>
    <v-row>
      <v-col cols="2" md="2">
        <v-select
          v-model="selectedBoard"
          :items="boards"
          label="게시판 선택"
          return-object
          solo
          dense
          item-value="id" 
          item-text="name"
        ></v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-btn
          color="primary"
          @click="openCreateBoardDialog()"
          text="게시판 생성"
        />
        <v-btn
          color="error"
          @click="deleteBoard"
          text="게시판 삭제"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="postList"
          :total-items="totalPosts"
          :loading="loading"
          :page.sync="currentPage"
          :items-per-page="perPage"
          @page-change="handlePageChange"
        ></v-data-table>
      </v-col>
    </v-row>

    <v-dialog v-model="isShow" max-width="600px" persistent :click-outside="false">
      <v-card>
        <v-card-title>게시판 생성</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="boardName" label="게시판 이름"></v-text-field>
            </v-col>
            <v-col>
              <input type="radio" id="adminRadio" name="userType" value="ADMIN" v-model="accessType" class="custom-radio">
              <label for="adminRadio" class="custom-radio-label">관리자 전용</label>
            </v-col>
            <v-col>
              <input type="radio" id="userRadio" name="userType" value="USER" v-model="accessType" class="custom-radio">
              <label for="userRadio" class="custom-radio-label">사용자 전용</label>
            </v-col>

          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="createBoard">생성</v-btn>
          <v-btn color="error" @click="closeCreateBoardDialog">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { read, write } from "@/utils/util-axios.js";

const boards = ref([]);
const selectedBoard = ref(null);
const isShow = ref(false);
const boardName = ref(null);
const boardType = ref(null);
const visibility = ref(null);
const accessType = ref(null);

const getBoards = async () => {
  try {
    const response = await read("/api/board");
    boards.value = response.data.data.boards;
  } catch(e) {
    alert(e.message);
  }
}

const createBoard = async () => {
  try {
    await write("/api/admin/board", null, {
      name: boardName.value,
      accessType: accessType.value
    })
    alert("게시판 생성이 완료되었습니다.");
    closeCreateBoardDialog();
  } catch(e) {
    alert(e.message);
  }
  console.log("test create board");
}



const openCreateBoardDialog = () => isShow.value = true;
const closeCreateBoardDialog = () => {
  isShow.value = false;
  boardName.value = null;
}

onMounted(getBoards);
</script>

<style scoped>

.custom-radio {
  display: none;
}

.custom-radio + .custom-radio-label {
  position: relative;
  padding-left: 30px;
  cursor: pointer;
  line-height: 24px;
}

.custom-radio + .custom-radio-label:before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #2196F3;
}

.custom-radio:checked + .custom-radio-label:before {
  background-color: #2196F3;
}

.custom-radio + .custom-radio-label:after {
  content: '';
  position: absolute;
  top: 50%;
  left: 6px;
  transform: translateY(-50%) scale(0);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: white;
  transition: transform 0.2s;
}

.custom-radio:checked + .custom-radio-label:after {
  transform: translateY(-50%) scale(1);
}
</style>

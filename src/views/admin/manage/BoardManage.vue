<template>
  <v-container>

    <v-row>
      <v-col cols="12">
        <v-btn
          color="primary"
          @click="openCreateBoardDialog()"
          text="게시판 생성"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-data-table-server
          v-model:items-per-page="pageSize"
          :headers="tableHeaders"
          :items-length="totalCount"
          :items="boards"
          :loading="isLoading"
          :page.sync="currentPage"
          item-key="id"
          @update:options="getBoards"
          @click:row="goPostManage"
          class="elevation-1"
        >
        <template v-slot:item.status="{ item }">
          {{ convertStatus(item.status) }}
        </template>
        <template v-slot:item.boardRemoved="{ item }">
          <v-btn 
            :disabled="item.status === 'REMOVED'" 
            color="red"
            @click="updateBoardStatus(item.id, 'REMOVED')"
            text="삭제"
          />
        </template>

        
        <template v-slot:item.boardEnabled="{ item }">
          <v-btn 
            :disabled="item.status === 'NORMAL'" 
            color="primary"
            @click="updateBoardStatus(item.id, 'NORMAL')"
            text="활성화"
          />
        </template>
        </v-data-table-server>
        <v-row class="text-center px-4 align-center" wrap>
          <v-col>
            <v-pagination
              v-model="currentPage"
              :length="getPageCount"
            />
          </v-col>
        </v-row>
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
import { ref, onMounted, computed } from "vue";
import { read, write, update } from "@/utils/util-axios.js";
import { useRouter} from "vue-router";

const router = useRouter();
const boards = ref([]);
const isShow = ref(false);
const boardName = ref(null);
const accessType = ref(null);
const isLoading = ref(false);
const currentPage = ref(1);
const totalCount = ref(0);
const pageSize = ref(10);

const tableHeaders = [
    { title: '게시판이름', align: 'center', value: 'name' },
    { title: '활성화 게시글', align: 'center', value: 'enabledPostCount' },
    { title: '비활성화 게시글', align: 'center', value: 'disabledPostCount' },
    { title: '삭제 게시글', align: 'center', value: 'removedPostCount' },
    { title: '상태', align: 'center', value: 'status' },
    { title: '접근 유형', align: 'center', value: 'accessType' },
    { title: '상태값 변경', align: 'center', value: "boardRemoved" },
    { title: '상태값 변경', align: 'center', value: "boardEnabled" }
]

const convertStatus = (status) => status === "NORMAL" ? "정상 활성화" : "삭제";

const getBoards = async () => {
  isLoading.value = true;
  try {
    const response = await read("/api/admin/boards", {
      page: currentPage.value - 1,
      size: pageSize.value
    });
    isLoading.value = false;
    boards.value = response.data.data.list;
    totalCount.value = response.data.data.totalCount;
  } catch(e) {
    isLoading.value = false;
    alert(e.message);
  }
}

const getPageCount = computed(() => {
    return Math.floor(((totalCount.value-1) / pageSize.value) + 1);
});

const createBoard = async () => {
  try {
    await write("/api/admin/board", null, {
      name: boardName.value,
      accessType: accessType.value
    })
    alert("게시판 생성이 완료되었습니다.");
    closeCreateBoardDialog();
    getBoards();
  } catch(e) {
    alert(e.message);
  }
}

const updateBoardStatus = async(boardId, status) => {
  const statusValue = status === "NORMAL" ? "활성화" : "삭제";
  if (confirm("게시판을 정말 " + statusValue + " 하시겠습니까?")) {
    try {
      await update(`/api/admin/board/${boardId}/status`, null, {
        status: status
      });
      alert("게시판 상태가 정상적으로 변경되었습니다.");
      getBoards();
    } catch(e) {
      alert(e.message);
    }
  }
}

const goPostManage = (event, { item } ) => {
  const boardId = item.id;
  router.push({name: "PostManage", params: {boardId: boardId}});
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

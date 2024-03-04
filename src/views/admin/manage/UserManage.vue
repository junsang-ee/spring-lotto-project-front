<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>유저 관리</v-card-title>
          <v-card-text>
            <v-data-table-server
              v-model:items-per-page="pageSize"
              :headers="tableHeaders"
              :items-length="totalCount"
              :items="userList"
              :loading="isLoading"
              :page.sync="currentPage"
              item-key="id"
              @update:options="getUserList"
              class="elevation-1"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>유저 목록</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                </v-toolbar>
              </template>
              <template v-slot:item.status="{ item }">
                <span v-if="item.status === 'DISABLED'">
                  이용 제한
                </span>
                <span v-else-if="item.status === 'RETIRED'">
                  탈퇴
                </span>
                <span v-else>
                  정상이용 중
                </span>
              </template>
              <template v-slot:item.userDisabled="{ item }">
                <v-btn 
                  :disabled="item.status === 'DISABLED'" 
                  color="red"
                  @click="updateStatus(item.id, 'DISABLED')"
                  text="이용제한"
                />
              </template>
              <template v-slot:item.userRetired="{ item }">
                <v-btn 
                  :disabled="item.status === 'RETIRED'" 
                  color="red"
                  @click="updateStatus(item.id, 'RETIRED')"
                  text="탈퇴처리"
                />
              </template>
              <template v-slot:item.userEnabled="{ item }">
                <v-btn 
                  :disabled="item.status === 'ENABLED'" 
                  color="primary"
                  @click="updateStatus(item.id, 'ENABLED')"
                  text="활성화"
                />
              </template>
              <template v-slot:item.createdAt="{ item }">
                {{ convertDateOnlyDay(item.createdAt) }}
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
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { read, update } from "@/utils/util-axios.js";
import { convertDateOnlyDay } from "@/utils/util-dateConverter";

const userList = ref([]);
const isLoading = ref(false);
const currentPage = ref(1);
const totalCount = ref(0);
const pageSize = ref(10);

const tableHeaders = [
    { title: '이메일', align: 'center', value: 'email' },
    { title: '상태', align: 'center', value: 'status' },
    { title: '로또 발급 가능 횟수', align: 'center', value: 'dailyAvailableCount' },
    { title: '게시글 개수', align: 'center', value: 'postCount' },
    { title: '가입 날짜', align: 'center', value: 'createdAt' },
    { title: '상태값 변경', align: 'center', value: 'userDisabled' },
    { title: '상태값 변경', align: 'center', value: 'userRetired' },
    { title: '상태값 변경', align: 'center', value: "userEnabled" }
]

const getUserList = async() => {
  isLoading.value = true;
  try {
    const response = await read("/api/admin/users", {
      page: currentPage.value - 1,
      size: pageSize.value
    });
    isLoading.value = false;
    userList.value = response.data.data.list;
    totalCount.value = response.data.data.totalCount;
  } catch (e) {
    isLoading.value = false;
    alert(e.message);
  }
}

const getPageCount = computed(() => {
    return Math.floor(((totalCount.value-1) / pageSize.value) + 1);
});

const updateStatus = async(userId, status) => {
  try {
    await update(`/api/admin/user/${userId}/status/${status}`);
    alert("상태 값이 성공적으로 변경되었습니다.");
    getUserList();
  } catch(e) {
    alert(e.message);
  }
}

onMounted(getUserList);

</script>

<style scoped>

</style>

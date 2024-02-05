<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>유저 관리</v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="userList"
              :page="page"
              :items-per-page="itemsPerPage"
              :total-items="totalItems"
              item-key="id"
              class="elevation-1"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>유저 목록</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-pagination
                    v-model="page"
                    :length="Math.ceil(totalItems / itemsPerPage)"
                    :total-visible="5"
                  ></v-pagination>
                </v-toolbar>
              </template>
              <template v-slot:item.action="{ item }">
                <v-btn color="red" @click="blockUser(item.id)">이용제한</v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';

const page = ref(1);
const itemsPerPage = 5;

const userList = ref([
    { id: 1, email: 'user1@example.com', postCount: 3 },
    { id: 2, email: 'user2@example.com', postCount: 0 },
    { id: 3, email: 'user3@example.com', postCount: 5 }
]);

const headers = [
    { title: '이메일', align: 'start', value: 'email' },
    { title: '게시글 개수', value: 'postCount' },
    { title: '이용제한', value: 'action', sortable: false }
]

const totalItems = computed(() => userList.value.length);

const blockUser = (id) => {
    console.log(id);
}
</script>

<style scoped>

</style>

<template>
  <v-container>
    <v-row align="center" align-content="center" justify="center">
      <v-col cols="6">
        <v-file-input variant="solo"
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      label="제품 일련번호 엑셀파일 선택"/>
      </v-col>
      <v-col cols="6">
        <v-row align="center" justify="end">
          <v-col>
            <v-row align="center" align-content="center">
              <div class="mx-8">대</div>
              <v-btn class="bg-amber" @click="_remove">초기화</v-btn>
            </v-row>
          </v-col>
          <v-btn @click="_remove" class="bg-red mr-2">취소</v-btn>
          <v-btn @click="_remove">저장</v-btn>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-data-table
          :headers="headers"
          :items="serials"
          :loading="isLoading">
        <template>
          <v-btn icon="mdi-delete" elevation="0">test</v-btn>
        </template>
      </v-data-table>
    </v-row>
  </v-container>
</template>

<script setup>

import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();

const postId = route.params.postId;
const boardName = route.query.boardName;
const _remove = (item) => {
    console.log(item);
}
</script>

<style scoped>

</style>
<template>
    <!-- <div class="board-list-container">
        <div class="board-list">
            <table class="tb-list">
                <colgroup>
                    <col width="*" />
                </colgroup>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>제목</th>
                        <th>공개여부</th>
                        <th>작성자</th>
                        <th>작성날짜</th>
                        <th>댓글 개수</th>
                    </tr>
                </thead>
                <tbody> -->
                    <!-- <tr v-for="(post, idx) in posts" :key="idx">
                        <td> {{ idx + 1 }} </td>
                        <td ><a href="javascript:;" @click="checkDisclosureType(post.id, post.disclosureType)">{{ post.title }}</a></td>
                        <td> {{ convertDisclosureType(post.disclosureType) }} </td>
                        <td> {{ post.nickName }} </td>
                        <td> {{ convertToDateFormat(post.createdAt) }} </td>
                        <td> {{ post.replyCount }} </td>
                    </tr> -->
                <!-- </tbody>
            </table>
        </div>
    </div> -->
    <div>
        <v-data-table
            v-model:items-per-page="pageSize"
            :headers="tableHeaders"
            :items-length="totalCount"
            :items="list"
        >
    </v-data-table>
    </div>

</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { read } from "@/utils/util-axios.js";

const tableHeaders = [
    {title: "#"},
    {title: "제목"},
    {title: "작성자"},
    {title: "조회수"},
    {title: "작성일"},
    {title: "공개유형"}
]

const list = ref([])
const pageSize = ref(10);
const totalCount = ref(0);
const route = useRoute();
const boardId = route.params.boardId;

const test = () => {
    console.log("boardId : " + boardId);
}
const getPosts = async () => {
    try {
        let url = `/api/board/${boardId}/post`;
        await read(url).then((response) => {
            if (response.data.code === 0) {
                console.log("result :: " + response.list);
            }
        })
    } catch(e) {
        console.log(e.message);
    }
}
onMounted(getPosts)
</script>

<style scope>
</style>
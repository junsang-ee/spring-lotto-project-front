<template>
    <v-container>
        <v-card flat>
            
            <v-card-title>
                <v-text-field
                v-model="search"
                label="검색"
                single-line
                hide-details/>
            </v-card-title>
            <v-col justify="end" align="end">
                <v-btn variant="tonal" @click="goWritePost">게시글 작성하기</v-btn>
            </v-col>
            <v-data-table
                :headers="tableHeaders"
                :items="posts"
                :dark="true"
                :search="search"
                :page.sync="page"
                :items-per-page="pageSize"
                @click:row="goPostDetail"
                hide-default-footer/>
            <v-row class="text-center px-4 align-center" wrap>
                <v-col class="text-truncate" cols="12" md="2">
                    Total {{ totalCount }} records
                </v-col>

                <v-col cols="12" md="6">
                    <v-pagination
                        v-model="page"
                        :length="getPageCount"
                    />
                </v-col>

            </v-row>
            
        </v-card>
  </v-container>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { read, write } from "@/utils/util-axios.js";
import { useTokenStore } from "@/store/auth";
import { useUserInfoStore } from "@/store/user";

const tableHeaders = [
    {title: "제목", key: "title", align: "center"},
    {title: "작성자", key: "email", align: "center"},
    {title: "조회수", key: "viewCount", align: "center"},
    {title: "작성일", key: "createdAt", align: "center"},
    {title: "공개유형", key: "disclosureType", align: "center"}
]

const route = useRoute();
const router = useRouter();
const boardId = route.params.boardId;
const boardName = route.query.boardName;
const posts = ref([])
const page = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const isLoading = ref(false);
const search = ref(null);
const $token = useTokenStore();
const $userInfo = useUserInfoStore();

const getPageCount = computed(() => {
    return Math.floor(((totalCount.value-1) / pageSize.value) + 1);
});

const getPosts = async () => {
    isLoading.value = true;
    try {
        const res = await read(`/api/board/${boardId}/post`);
        isLoading.value = false;
        let result = res.data.data;
        posts.value = result.list;
        totalCount.value = result.totalCount;
        
    } catch(e) {
        isLoading.value = false;
        console.log(e.message);
    }
}

const goWritePost = async () => {
    if ($token.isNullable() && $userInfo.isNullable()) {
        alert("로그인이 필요한 서비스 입니다.");
        router.replace({name:"Login"});
        return;
    }
    router.push({name: "PostEditor", params:{boardId:boardId.value}})
}

const goPostDetail = (event, { item } ) => {
    const postId = item.id;
    router.push({name: "PostDetail", 
                 params: {postId: postId}, 
                 query:{boardName:boardName}});
}

onMounted(getPosts)
</script>

<style scope>
</style>
<template>
    <v-container>
        <v-card flat>
            <v-card-title align="center" style="font-size: 30px; margin-bottom: 20px">
                {{boardName}}
            </v-card-title>
            <v-card-title>
                <v-text-field
                    v-model="search"
                    label="검색"
                    single-line
                    hide-details
                />
            </v-card-title>
            <v-col justify="end" align="end">
                <v-btn variant="tonal" @click="goWritePost">게시글 작성하기</v-btn>
            </v-col>
            <v-data-table-server
                v-model:items-per-page="pageSize"
                :headers="tableHeaders"
                :items-length="totalCount"
                :items="posts"
                :loading="isLoading"
                :search="search"
                item-key="id"
                :page.sync="currentPage"
                @click:row="validatePostPrivacy"
                @update:options="getPosts"
            />
            <v-row class="text-center px-4 align-center" wrap>
                <v-col class="text-truncate" cols="12" md="2">
                    Total {{ totalCount }} records
                </v-col>
                <v-col cols="12" md="6">
                    <v-pagination
                        v-model="currentPage"
                        :length="getPageCount"
                    />
                </v-col>
            </v-row>
            <v-dialog v-model="isShowPasswordDialog" max-width="400">
                <v-card>
                    <v-card-title>비밀번호 입력</v-card-title>
                    <v-card-text>
                        <v-text-field 
                            v-model="postPassword" 
                            label="비밀번호" 
                            type="password"
                        />
                    </v-card-text>
                    <v-card-actions>
                        <v-btn 
                            color="primary" 
                            @click="validPassword"
                            text="확인"
                        />
                        <v-btn 
                            @click="closePasswordDialog"
                            text="취소"
                        />
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card>
  </v-container>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { read, write } from "@/utils/util-axios.js";
import { usePostStore } from "@/store/post";


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
const pageSize = ref(10);
const totalCount = ref(0);
const isLoading = ref(false);
const search = ref(null);
const isShowPasswordDialog = ref(false);
const currentPage = ref(1);
const postPassword = ref(null);
const $postTemp = usePostStore();

const onPageChange = (page) => {
    console.log("pageChange!");
    currentPage.value = page;
}

const verifyPassword = ref({
    password: null
}) 
const getPageCount = computed(() => {
    return Math.floor(((totalCount.value-1) / pageSize.value) + 1);
});

const getPosts = async () => {
    isLoading.value = true;
    console.log("currentPage :: "+ currentPage.value);
    try {
        const res = await read(`/api/board/${boardId}/post`, {
            page: currentPage.value - 1,
            size: pageSize.value
        });
        isLoading.value = false;
        let result = res.data.data;
        posts.value = result.list;
        totalCount.value = result.totalCount;
        
    } catch(e) {
        isLoading.value = false;
        console.log(e.message);
    }
}

const goWritePost = () => {
    router.push({
        name: "PostEditor", 
        params:{boardId:boardId.value},
        query:{boardName:boardName}
    });
}
const validatePostPrivacy = (event, { item } ) => {
    $postTemp.setId(item.id);
    if (item.disclosureType === "비공개") {
        openPasswordDialog();
    } else {
        goPostDetail();
    }
}

const validPassword = async () => {
    try {
        await write(`/api/post/${$postTemp.getId()}/verify`, null, {
            password: postPassword.value
        });
        goPostDetail();
    } catch(e) {
        alert(e.message);
    }
}

const goPostDetail = () => {
    router.push({name: "PostDetail", 
                params: {postId: $postTemp.getId()},
                query:{boardName: boardName, 
                       boardId: boardId}});
};
const openPasswordDialog = () => {
    isShowPasswordDialog.value = true;
}

const closePasswordDialog = () => {
    isShowPasswordDialog.value = false;
    verifyPassword.value.password = null;
}
onMounted(getPosts)
</script>

<style scope>
</style>
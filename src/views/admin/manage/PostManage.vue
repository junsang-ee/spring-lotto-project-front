<template>
    <v-container>
        <v-row>
            <v-col cols="2">
                <v-btn
                    color="primary"
                    @click="goBoardManage()"
                    text="게시판 목록으로"
                />
            </v-col>
            <v-col cols="2">
                <v-btn
                    color="primary"
                    @click="goCreatePost()"
                    text="게시글 작성하기"
                />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-data-table-server
                    v-model:items-per-page="pageSize"
                    :headers="tableHeaders"
                    :items-length="totalCount"
                    :items="posts"
                    :loading="isLoading"
                    :page.sync="currentPage"
                    item-key="id"
                    @update:options="getPosts"
                    class="elevation-1"
                >
                    <template v-slot:no-data>
                        <v-alert :value="true" icon="mdi-alert">해당 게시판에는 아직 게시글이 없습니다.</v-alert>
                    </template>
                    <template v-slot:item.title="{ item }">
                        <button @click="goPostDetail(item.id)">
                            {{ item.title }}
                        </button>
                    </template>
                    <template v-slot:item.status="{ item }">
                        {{ convertStatus(item.status) }}
                    </template>
                    <template v-slot:item.disclosureType="{ item }">
                        {{ convertDisclosureType(item.disclosureType) }}
                    </template>
                    <template v-slot:item.postEnabled="{ item }">
                        <v-btn 
                            :disabled="item.status === 'NORMAL'" 
                            color="primary"
                            @click="updatePostStatus(item.id, 'NORMAL')"
                            text="활성화"
                        />
                    </template>
                    <template v-slot:item.postDisabled="{ item }">
                        <v-btn 
                            :disabled="item.status === 'DISABLED'" 
                            color="red"
                            @click="updatePostStatus(item.id, 'DISABLED')"
                            text="이용제한"
                        />
                    </template>
                    <template v-slot:item.postRemoved="{ item }">
                        <v-btn 
                            :disabled="item.status === 'REMOVED'" 
                            color="red"
                            @click="updatePostStatus(item.id, 'REMOVED')"
                            text="삭제"
                        />
                    </template>
                    <template v-slot:item.createdAt="{ item }">
                        {{ convertDateOnlyDay(item.createdAt) }}
                    </template>
                    <template v-slot:item.postPermanentRemove="{ item }">
                        <v-btn
                            color="red"
                            @click="deletePost(item.id)"
                            text="영구 삭제"
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
    </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { read, update, remove } from "@/utils/util-axios.js";
import { convertDateOnlyDay } from "@/utils/util-dateConverter";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const isLoading = ref(false);
const currentPage = ref(1);
const totalCount = ref(0);
const pageSize = ref(10);
const posts = ref([]);
const boardId = route.params.boardId;
const boardName = route.query.boardName;

const tableHeaders = [
    { title: '제목', align: 'center', value: 'title' },
    { title: '작성자', align: 'center', value: 'writer' },
    { title: '접근유형', align: 'center', value: 'disclosureType' },
    { title: '상태', align: 'center', value: 'status' },
    { title: '작성일', align: 'center', value: 'createdAt' },
    { title: '활성화 댓글', align: 'center', value: 'enabledReplyCount' },
    { title: '비활성화 댓글', align: 'center', value: 'disabledReplyCount' },
    { title: '상태값', align: 'center', value: "postRemoved" },
    { title: '상태값', align: 'center', value: "postEnabled" },
    { title: '상태값', align: 'center', value: "postDisabled" },
    { title: '영구제거', align: 'center', value: "postPermanentRemove" },
]

const convertStatus = (status) => {
    if (status === "NORMAL") return "활성화";
    else if (status === "DISABLED") return "비활성화";
    else return "삭제"
}

const convertDisclosureType = (type) => type === "PUBLIC" ? "공개" : "비공개";

const getPosts = async () => {
    isLoading.value = true;
    try {
        const response = await read(`/api/admin/board/${boardId}/posts`, {
            page: currentPage.value - 1,
            size: pageSize.value
        });
        isLoading.value = false;
        posts.value = response.data.data.list;
        totalCount.value = response.data.data.totalCount;

    } catch (e) {
        isLoading.value = false;
        alert(e.message);
    }
}

const goBoardManage = () => {
    router.replace({name: "BoardManage"})
}

const goPostDetail = (postId) => {
    router.push({
        name: "PostDetail", 
        params: {postId: postId},
        query: {boardId: boardId, isAdmin: true}
    });
}

const updatePostStatus = async (postId, status) => {
    try {
        await update(`/api/admin/post/${postId}/status`, null, {
            status: status
        });
        alert("게시글의 상태가 정상적으로 변경되었습니다.");
        getPosts();
    } catch(e) {
        alert(e.message);
    }
}

const deletePost = async(postId) => {
    if (confirm("해당 게시글을 영구적으로 삭제하시겠습니까?")) {
        try {
            await remove(`/api/admin/post/${postId}`);
            alert("해당 게시글이 영구적으로 삭제되었습니다.");
            getPosts();
        } catch(e) {
            alert(e.message);
        }
    }
}

const goCreatePost = () => {
    router.push({
        name: "PostEditor", 
        params: {boardId:boardId},
        query: {boardName:boardName}
    });
}

const getPageCount = computed(() => {
    return Math.floor(((totalCount.value-1) / pageSize.value) + 1);
});

onMounted(getPosts);

</script>

<style scope>
</style>
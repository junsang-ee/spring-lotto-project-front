<template>
    <v-container>
        <v-card>
            <v-card-title>유저 상세</v-card-title>
            <v-card-text>
                <div>
                    <v-label>
                        이메일: {{ userDetail.email }}
                    </v-label>
                </div>
                <div>
                    <v-label>
                        상태: {{ convertUserStatus(userDetail.status) }}
                    </v-label>
                </div>
                <div>
                    <v-label>
                        로또 발급 가능 횟수: {{ userDetail.dailyAvailableCount }}
                    </v-label>
                </div>
                <div>
                    <v-label>
                        작성한 게시글 개수: {{ userDetail.postCount }}
                    </v-label>
                </div>
                <div>
                    <v-label>
                        발급 받은 랜덤 로또 개수: {{ userDetail.extractionCount }}
                    </v-label>
                </div>
                <div>
                    <v-label>
                        당첨 횟수: {{ userDetail.winningCount }}
                    </v-label>
                </div>
                <div>
                    <v-label>
                        가입 날짜: {{ convertDateOnlyDay(userDetail.createdAt) }}
                    </v-label>
                </div>

            </v-card-text>
        </v-card>
    </v-container>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <v-btn-toggle v-model="selected" primary>
                    <v-btn @click="selectCategory('lottos')">랜덤 로또 목록</v-btn>
                    <v-btn @click="selectCategory('posts')">작성한 게시글 목록</v-btn>
                </v-btn-toggle>
            </v-col>
        </v-row>
        <v-row v-if="selected === 'lottos'">
            <v-col cols="12">
                <v-data-table-server
                    v-model:items-per-page="pageSize"
                    :headers="lottosHeader"
                    :items-length="totalCount"
                    :items="extractions"
                    :loading="isLoading"
                    :search="search"
                    item-key="id"
                    :page.sync="currentPage"
                    @update:options="getExtractions"
                    class="elevation-1"
                >
                    <template v-slot:no-data>
                        <v-alert :value="true" icon="mdi-alert">
                            추출한 랜덤 로또 번호가 아직 없습니다.
                        </v-alert>
                    </template>
                </v-data-table-server>
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
            </v-col>
        </v-row>
        <v-row v-else>
            <v-col cols="12">
                <v-data-table-server
                    v-model:items-per-page="pageSize"
                    :headers="postsHeader"
                    :items-length="totalCount"
                    :items="posts"
                    :loading="isLoading"
                    :search="search"
                    item-key="id"
                    :page.sync="currentPage"
                    @update:options="getPosts"
                    class="elevation-1"
                >
                    <template v-slot:no-data>
                        <v-alert :value="true" icon="mdi-alert">
                            작성한 게시글이 아직 없습니다.
                        </v-alert>
                    </template>
                    <template v-slot:item.createdAt="{ item }">
                        {{ convertDateOnlyDay(item.createdAt) }}
                    </template>
                    <template v-slot:item.status="{ item }">
                        {{ convertPostStatus(item.status) }}
                    </template>
                    <template v-slot:item.disclosureType="{ item }">
                        {{ convertPostType(item.disclosureType) }}
                    </template>
                    
                </v-data-table-server>
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
            </v-col>
        </v-row>
    </v-container>
    
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from "vue-router";
import { read } from "@/utils/util-axios.js";
import { convertDateOnlyDay } from "@/utils/util-dateConverter";

const route = useRoute();
const userId = route.params.userId;
const pageSize = ref(10);
const totalCount = ref(0);
const currentPage = ref(1);
const isLoading = ref(false);
const selected = ref("lottos");

const posts = ref([]);
const extractions = ref([]);

const userDetail = ref({
    email: null,
    status: null,
    dailyAvailableCount: null,
    postCount: null,
    extractionCount: null,
    winningCount: null,
    createdAt: null
});

const postsHeader = [
    {title:"게시판 이름", value:"parentBoardName", align:"center"},
    {title:"제목", value:"title", align:"center"},
    {title:"상태", value:"status", align:"center"},
    {title:"접근유형", value:"disclosureType", align:"center"},
    {title:"작성일", value:"createdAt", align:"center"},
    {title:"댓글 개수", value:"replyCount", align:"center"},
    {title:"상태값 변경", value:"postRemoved", align:"center"},
    {title:"상태값 변경", value:"postEnabled", align:"center"},
    {title:"상태값 변경", value:"postDisabled", align:"center"},
    {title:"영구제거", value:"postPermanentRemove", align:"center"}
];

const lottosHeader = [
    {title:"첫번째 로또 번호", key:"firstNumber", align:"center"},
    {title:"두번째 로또 번호", key:"secondNumber", align:"center"},
    {title:"세 번째 로또 번호", key:"thirdNumber", align:"center"},
    {title:"네 번째 로또 번호", key:"fourthNumber", align:"center"},
    {title:"다섯 번째 로또 번호", key:"fifthNumber", align:"center"},
    {title:"여섯 번째 로또 번호", key:"sixthNumber", align:"center"},
    {title:"발급 날짜", key:"createdAt", align:"center"},
    {title:"당첨 결과", key:"winningResult", align:"center"}
];

const getUserDetail = async() => {
    
    try {
        const response = await read(`/api/admin/user/${userId}`);
        userDetail.value = response.data.data;

    } catch(e) {
        alert(e.message);
    }
}

const getExtractions = async() => {
    try {

    } catch(e) {
        alert(e.message);
    }
}

const getPosts = async() => {
    totalCount.value = 0;
    pageSize.value = 10;
    currentPage.value = 1;
    try {
        const response = await read(`/api/admin/user/${userId}/posts`);
        posts.value = response.data.data.list;
        totalCount.value = response.data.data.totalCount;

    } catch(e) {
        alert(e.message);
    }
}

const selectCategory = (category) => {
    selected.value = category;
    if (category === "lottos") {
        getExtractions();
    } else if (category === "posts") {
        getPosts();
    } 
    console.log("test");
}

const convertUserStatus = (status) => {
    if (status === "ENABLED") return "정상이용 중";
    else if (status === "DISABLED") return "이용 제한";
    else return "삭제";
}

const convertPostStatus = (status) => {
    if (status === "NORMAL") return "정상 활성화";
    else if (status === "REMOVED") return "삭제된 게시글";
    else return "비활성화";
}

const convertPostType = (type) => {
    if (type === "PUBLIC") return "공개";
    else return "비공개";
}


onMounted(getUserDetail);
</script>

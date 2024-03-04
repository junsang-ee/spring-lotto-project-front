<template>
  <v-container>
    <v-card-title class="board-title">
        <span>{{ boardName }} 게시글 작성</span>
    </v-card-title>
    <v-form ref="isValid">
        <v-text-field 
            v-model="post.title" 
            label="제목"
            :rules="titleRule"
        />
        <v-textarea 
            v-model="post.content"
            label="내용"
            :rules="contentRule"
        />
        <v-row>
            <v-col cols="12">
                <v-checkbox 
                    v-model="isPrivate"
                    color="white"
                    label="비공개시 클릭 후 비밀번호 입력."
                />
            </v-col>
        </v-row>
        <v-col v-if="isPrivate" cols="12" md="6">
            <v-text-field 
                variant="solo"
                v-model="post.password" 
                label="비밀번호 4자리" 
                type="password" 
                :rules="passwordRule" 
                max-width="calc(4ch * 1.00)"
            />
        </v-col>
    </v-form>
    <v-row>
        <v-col cols="auto">
            <v-btn 
                @click="registerPost" 
                color="primary"
                text="게시글 등록"
            />
        </v-col>
        <v-col cols="auto">
            <v-btn 
                @click="goPostList" 
                color="primary"
                text="목록으로"
            />
        </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router";
import { write } from "@/utils/util-axios";
import { useUserInfoStore } from "@/store/user";

const route = useRoute();
const router = useRouter();
const boardName = route.query.boardName;
const boardId = route.params.boardId;
const isPrivate = ref(false);
const isValid = ref(false);
const textRuleConfig = /^\S.*\S$/;
const passwordRuleConfig = /^\d{4}$/;
const $userInfo = useUserInfoStore();

const titleRule = [
    v => textRuleConfig.test(v) || "제목을 입력해주세요. (첫 글자 공백 제한, 두 글자 이상)"
]
const contentRule = [
    v => textRuleConfig.test(v) || "내용을 입력해주세요.(첫 글자 공백 제한, 두 글자 이상)"
]
const passwordRule = [
    v => passwordRuleConfig.test(v) || "게시글의 비밀번호는 4자리의 숫자로 입력하여야 합니다.(공백제외)"
]

const post = ref({
    title: "",
    content: "",
    password: null,
    disclosureType: "PRIVATE"
});

const registerPost = async () => {
    const {valid} = await isValid.value.validate();
    try {
        if (valid) {
            if (!isPrivate.value) {
                post.value.password = null;
                post.value.disclosureType = "PUBLIC";
            }
            const res = await write(`/api/board/${boardId}/post`, null, post.value);
            if (res) alert("게시글 작성이 완료되었습니다.");
            if ($userInfo.getInfo().role === "ADMIN") {
                router.replace({
                    name: "PostManage", 
                    params: {boardId: boardId}, 
                    query: {boardName: boardName}
                })
            } else {
                router.replace({name:"PostList", params:{boardId:boardId}});
            }
            
        }
    } catch(e) {
        alert(e.message);
    }
}

const goPostList = () => {
    router.replace({
        name:"PostList", 
        params:{boardId: boardId},
        query: {boardName: boardName}
    });
}

</script>

<style scope>
.board-title {
    font-size: 20px;
    text-align: center;
    margin-bottom: 20px;
}
</style>
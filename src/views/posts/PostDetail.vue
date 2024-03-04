<template>
  <v-container>
    <v-card-title class="board-title">
        <span>{{ boardName }}</span>
    </v-card-title>
    <v-card class="pa-4" v-if="post">

      <v-card-title v-if="!isEditing">{{ post.title }}</v-card-title>
      <v-text-field v-else v-model="post.title" label="제목"></v-text-field>
      <v-divider class="mb-4"></v-divider>
      <v-card-subtitle>글쓴이 : {{ post.writer }}</v-card-subtitle>
      <v-card-text v-if="!isEditing">{{ post.content }}</v-card-text>
      <v-textarea v-else v-model="post.content" label="내용"/>
      <v-divider class="my-4"></v-divider>
      <v-card-actions>
        <v-btn
          v-if="(post.mine || isAdmin) && !isEditing" 
          color="primary" 
          @click="changeEditMode()"
          text="수정"
        />
        <v-btn 
          v-if="(post.mine || isAdmin) && isEditing" 
          color="primary" 
          @click="validPost('update')"
          text="수정완료"
        />
        <v-btn 
          v-if="(post.mine || isAdmin) && !isEditing" 
          color="error" 
          @click="validPost('delete')"
          text="삭제"
        />
        <v-btn 
          v-if="(post.mine || isAdmin) && isEditing" 
          color="error" 
          @click="cancelUpdate()"
          text="취소"
        />
        <v-btn
          v-if="!isEditing"
          color="primary" 
          @click="goPostList"
          text="목록으로" 
        />
      </v-card-actions>
    </v-card>

    <v-dialog v-model="isShowPasswordDialog" max-width="400">
      <v-card>
        <v-card-title>비밀번호 입력</v-card-title>
        <v-card-text>
          <v-text-field v-model="password" label="비밀번호" type="password" />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="validPassword">확인</v-btn>
          <v-btn @click="closePasswordDialog">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <v-card>
      <v-card-title>댓글 {{ post.replyCount }}개</v-card-title>
      <v-card-text @click="toggleReplyInput" class="mb-0">
        <v-text-field
          v-model="newReplyContent"
          label="댓글을 입력하세요..."
          :disabled="!commentInputActive"
        />
      </v-card-text>
      <v-card-actions class="text-right ma-0">
        <div v-if="showReplyButton">
          <v-btn color="grey" @click="clearReply">취소</v-btn>
          <v-btn color="primary" @click="registerReply">작성</v-btn>
        </div>
      </v-card-actions>
    </v-card>

    <v-card v-for="reply in replies" :key="reply.id">
      <v-card-subtitle class="text-grey">{{ reply.writer }}</v-card-subtitle>
      <v-card-text>{{ reply.content }}</v-card-text>
    </v-card>

    <v-btn @click="loadMoreComments" v-if="replies.length < post.replyCount">댓글 더보기</v-btn>

  </v-container>
  
</template>

<script setup>

import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { read, write, update, remove } from "@/utils/util-axios";

const route = useRoute();
const router = useRouter();
const postId = route.params.postId;
const boardId = route.query.boardId;
const boardName = route.query.boardName;
const isAdmin = route.query.isAdmin;
const isLoading = ref(false);
const isShowPasswordDialog = ref(false);
const password = ref(null);
const action = ref(null);
const isEditing = ref(false);
const originTitle = ref(null);
const originContent = ref(null);
const commentInputActive = ref(false);
const showReplyButton = ref(false);
const newReplyContent = ref(null);
const replies = ref([]);

const toggleReplyInput = () => {
  commentInputActive.value = true;
  showReplyButton.value = true;
}

const clearReply = () => {
  commentInputActive.value = false;
  showReplyButton.value = false;
  newReplyContent.value = null;
}

const loadMoreComments = () => {
  console.log('loadMoreComments');
}

const registerReply = async() => {
  try {
    await write(`/api/post/${postId}/reply`, null, {
      content: newReplyContent.value
    });
    alert("댓글이 정상적으로 작성되었습니다.");
    clearReply();
    getPostDetail();
  } catch(e) {
    alert(e.message);
  }
}

const getReplies = async() => {
  if (post.value.replyCount > 0) {
    try {
      const response = await read(`/api/post/${postId}/replies`);
      replies.value = response.data.data;
    } catch(e) {
      alert(e.message);
    }
  }
}

const post = ref({
  writer: null,
  title: null,
  content: null,
  mine: false,
  disclosureType: "PUBLIC",
  replyCount: 0
});

const getPostDetail = async() => {
  isLoading.value = true;
  try {
    const response = await read(`/api/post/${postId}`);
    post.value = response.data.data;
    getReplies();
    isLoading.value = false;
  } catch(e) {
    isLoading.value = false;
    alert(e.message);
  }
}

const validPost = async (val) => {
  action.value = val;
  if (post.value.mine && post.value.disclosureType === "PRIVATE") {
    openPasswordDialog();
  } else {
    action.value === "update" ? updatePost() : deletePost();
  }
}

const updatePost = async() => {
  if (confirm("게시글을 정말 수정하시겠습니까?")) {
    try {
      await update(`/api/post/${postId}`, null, {
        title: post.value.title,
        content: post.value.content
      });
      alert("게시글이 정상적으로 수정되었습니다.");
      closePasswordDialog();
      changeEditMode();
      getPostDetail();
    } catch (e) {
      alert(e.message);
    }
  }
}

const deletePost = async () => {
  if (confirm("게시글을 정말 삭제하시겠습니까?")) {
    try {
      const response = await remove(`/api/post/${postId}`);
      if (response.data.data) {
        closePasswordDialog();
        alert("게시글이 정상적으로 삭제되었습니다.");
        goPostList();
      }
    } catch(e) {
      alert(e.message);
    }
  }
};

const goPostList = () => {
  if (isAdmin) {
    router.replace({
      name: "PostManage", 
      params: {boardId: boardId}
    });
  } else {
    router.replace({
        name:"PostList", 
        params: {boardId: boardId},
        query: {boardName: boardName}
    });
  }

};

const validPassword = async () => {
    try {
        await write(`/api/post/${postId}/verify`, null, {
            password: password.value
        });
        if (action.value === "update") {
          updatePost();
        } else deletePost();
    } catch(e) {
        alert(e.message);
    }
};

const changeEditMode = () => {
  if (isEditing.value) {
    isEditing.value = false;
  } else {
    originTitle.value = post.value.title;
    originContent.value = post.value.content;
    isEditing.value = true;
  }
}

const cancelUpdate = () => {
  if (isEditing.value) {
    post.value.title = originTitle.value;
    post.value.content = originContent.value;
    isEditing.value = false;
  }
}

const openPasswordDialog = () => {
  isShowPasswordDialog.value = true;
}
const closePasswordDialog = () => {
  isShowPasswordDialog.value = false;
  password.value = null;
}

onMounted(getPostDetail);
</script>

<style scoped>

</style>
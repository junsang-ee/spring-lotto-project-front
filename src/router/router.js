import { createRouter, createWebHistory } from "vue-router";
import RandomLotto from "@/views/lottos/RandomLotto.vue";
import PostList from "@/views/posts/PostList.vue";
import PostDetail from "@/views/posts/PostDetail.vue";
import PostEditor from "@/views/posts/PostEditor.vue";
import Login from "@/views/Login.vue";

const routes = [
    { path: '/random-lotto', name: 'RandomLotto', component: RandomLotto, meta: {title: "랜덤 로또"}},
    { path: '/post-list/:boardId', name: 'PostList', component: PostList, meta: {title: "게시글 리스트"}},
    { path: '/post-edit/:boardId', name: 'PostEditor', component: PostEditor, meta: {title: "게시글 작성"} },
    { path: '/post-detail/:postId', name: 'PostDetail', component: PostDetail, meta: {title: "게시글 상세"} },
    { path: '/login', name:'Login', component: Login },

]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})
  
export default router;
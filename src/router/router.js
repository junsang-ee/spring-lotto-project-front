import { createRouter, createWebHistory } from "vue-router";
import RandomLotto from "@/views/lottos/RandomLotto.vue";
import PostList from "@/views/posts/PostList.vue";
import PostDetail from "@/views/posts/PostDetail.vue";
import PostEditor from "@/views/posts/PostEditor.vue";
import Login from "@/views/Login.vue";

const routes = [
    { path: '/random-lotto', name: 'RandomLotto', component: RandomLotto},
    { path: '/post-list/:boardId', name: 'PostList', component: PostList},
    { path: '/post-edit/:boardId', name: 'PostEditor', component: PostEditor},
    { path: '/post-detail/:postId', name: 'PostDetail', component: PostDetail},
    { path: '/login', name:'Login', component: Login },

]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})
  
export default router;
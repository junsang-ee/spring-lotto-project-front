import { createRouter, createWebHistory } from "vue-router";
import RandomLotto from "@/views/lottos/RandomLotto.vue";
import PostList from "@/views/posts/PostList.vue";
import PostDetail from "@/views/posts/PostDetail.vue";
import PostEditor from "@/views/posts/PostEditor.vue";

import UserManage from "@/views/admin/manage/UserManage.vue";
import UserDetailManage from "@/views/admin/manage/UserDetailManage.vue";
import BoardManage from "@/views/admin/manage/BoardManage.vue";
import PostManage from "@/views/admin/manage/PostManage.vue";
import LottoHistoryManage from "@/views/admin/manage/LottoHistoryManage.vue";
import UserEdit from "@/views/users/UserEdit.vue";
import Login from "@/views/Login.vue";


const routes = [
    { path: '/random-lotto', name: 'RandomLotto', component: RandomLotto},
    { path: '/post-list/:boardId', name: 'PostList', component: PostList},
    { path: '/post-edit/:boardId', name: 'PostEditor', component: PostEditor},
    { path: '/post-detail/:postId', name: 'PostDetail', component: PostDetail},
    { path: '/user-manage', name: 'UserManage', component: UserManage},
    { path: '/user-detail/:userId', name: 'UserDetailManage', component: UserDetailManage},
    { path: '/board-manage', name: 'BoardManage', component: BoardManage},
    { path: '/post-manage/:boardId', name: 'PostManage', component: PostManage},
    { path: '/lotto-history-manage', name: 'LottoHistoryManage', component: LottoHistoryManage},
    { path: '/edit', name: 'UserEdit', component: UserEdit},
    { path: '/login', name:'Login', component: Login },

]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})
  
export default router;
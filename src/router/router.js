import { createRouter, createWebHistory } from "vue-router";
import RandomLotto from "../views/lottos/RandomLotto.vue";
import PostList from "../views/posts/PostList.vue";
import Test from "../views/Test.vue";
import Login from "@/views/Login.vue";
import Signup from "@/views/members/MemberSignupEditPop.vue";

const routes = [
    { path:'/random-lotto', name:'RandomLotto', component:RandomLotto },
    { path:'/post-list/:boardId', name:'PostList', component:PostList },
    { path: '/login', name:'Login', component: Login},
]

const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router;
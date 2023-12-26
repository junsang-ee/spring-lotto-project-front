import { createRouter, createWebHistory } from "vue-router";
import RandomLotto from "../views/lottos/RandomLotto.vue";
import PostList from "../views/posts/PostList.vue";
import Test from "../views/Test.vue";

const routes = [
    { path:'/random-lotto', name:'RandomLotto', component:RandomLotto },
    { path:'/post-list/:boardId', name:'PostList', component:PostList },
    { path: '/test', name:'Test', component: Test},

]

const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router;
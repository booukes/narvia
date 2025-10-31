import {createRouter, createWebHistory} from 'vue-router'
import HomePage from "@/pages/HomePage.vue";
import NotFounndPage from "@/pages/NotFounndPage.vue";
import ResetPasswordPage from "@/pages/ResetPasswordPage.vue";
import RegisterPage from "@/pages/RegisterPage.vue";

const routes = [
    {path: '/', component: HomePage},
    {path: '/reset-password', component: ResetPasswordPage},
    {path: '/register', component: RegisterPage},
    {path: '/:pathMatch(.*)*', component: NotFounndPage}
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
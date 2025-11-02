import {createRouter, createWebHistory} from 'vue-router'
import HomePage from "@/pages/HomePage.vue";
import NotFoundPage from "@/pages/NotFoundPage.vue";
import ResetPasswordPage from "@/pages/ResetPasswordPage.vue";
import Dashboard from "@/pages/Dashboard.vue";

const routes = [
    {path: '/', component: HomePage},
    {path: '/dashboard', component: Dashboard},
    {path: '/reset-password', component: ResetPasswordPage},
    {path: '/:pathMatch(.*)*', component: NotFoundPage}
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
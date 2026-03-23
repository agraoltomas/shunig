import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/router/views/Login.vue'
import Register from '@/router/views/Register.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: "/login", component: Login},
    {path: "/register", component: Register},
  ],
})

export default router

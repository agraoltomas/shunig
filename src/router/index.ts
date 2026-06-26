import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/router/views/Login.vue'
import Register from '@/router/views/Register.vue'
import Swap from '@/router/views/Swap.vue'
import Refugio from '@/router/views/refugio/Refugio.vue'
import VoluntarioView from '@/router/views/voluntario/VoluntarioView.vue'
import RecoverPassword from '@/router/views/ppales/RecoverPassword.vue'
import OutsideView from '@/router/views/OutsideView.vue'
import { useAuthStore } from '@/stores/auth.ts'
import ChangePassword from '@/router/views/ppales/ChangePassword.vue'
import { useRefugioStore } from '@/stores/refugio.ts'
import refugioRoutes from '@/router/views/refugio'
import usuarioRoutes from '@/router/views/voluntario'
import MainView from '@/router/views/MainView.vue'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/', component: OutsideView, children: [
                { path: '/', component: MainView, meta: { external: true } },
                { path: '/login', component: Login, meta: { external: true } },
                { path: '/register', component: Register, meta: { external: true } },
                { path: '/recuperar-pass', component: RecoverPassword, meta: { external: true } },
                { path: '/cambiar-pass', component: ChangePassword, meta: { external: true } },
                {
                    path: '/planes/suscripcion',
                    component: () => import('@/router/views/planes/Suscripciones.vue'),
                    meta: { external: true }
                },
                {
                    path: '/planes/patrocinadores',
                    component: () => import('@/router/views/planes/Patrocinadores.vue'),
                    meta: { external: true }
                }
            ]
        },
        { path: '/swap', component: Swap },
        {
            path: '/refugio', component: Refugio, children: [
                ...refugioRoutes
            ]
        }, {
            path: '/usuario', component: VoluntarioView, children: [
                ...usuarioRoutes
            ]
        }
    ]
})

router.beforeEach(async (to, from) => {
    const authStore = useAuthStore()

    if (!to.meta.external && from.path != '/login') {
        if (!authStore.user) {
            const r = await authStore.revalidarUsuario()
            if (!r) {
                return { path: '/login' }
            } else {
                const refugioStore = useRefugioStore()
                await refugioStore.loadContextRefugio(r)
            }
        }
    }
})


export default router

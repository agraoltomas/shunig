import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/router/views/Login.vue'
import Register from '@/router/views/Register.vue'
import Home from '@/router/views/Home.vue'
import Swap from '@/router/views/Swap.vue'
import Refugio from '@/router/views/Refugio.vue'
import RefugioHome from '@/router/views/refugio/RefugioHome.vue'
import MascotasView from '@/router/views/refugio/MascotasView.vue'
import MascotaView from '@/router/views/refugio/MascotaView.vue'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', component: Home },
        { path: '/login', component: Login },
        { path: '/register', component: Register },
        { path: '/swap', component: Swap },
        {
            path: '/refugio', component: Refugio, children: [
                { path: '', component: RefugioHome },
                { path: 'mascotas', component: MascotasView },
                { path: 'mascota/:id', component: MascotaView },
                { path: 'vacunas', component: MascotasView },
                { path: 'stock', component: MascotasView },
                { path: 'transito', component: MascotasView }
            ]
        }
    ]
})
export default router

import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/router/views/Login.vue'
import Register from '@/router/views/Register.vue'
import Home from '@/router/views/Home.vue'
import Swap from '@/router/views/Swap.vue'
import Refugio from '@/router/views/refugio/Refugio.vue'
import RefugioHome from '@/router/views/refugio/RefugioHome.vue'
import MascotasView from '@/router/views/refugio/MascotasView.vue'
import MascotaView from '@/router/views/refugio/MascotaView.vue'
import VoluntarioView from '@/router/views/voluntario/VoluntarioView.vue'
import VoluntarioHome from '@/router/views/voluntario/VoluntarioHome.vue'

import VoluntarioMascotasView from '@/router/views/voluntario/MascotasView.vue'
import SolicitudesView from '@/router/views/voluntario/SolicitudesView.vue'
import EventosView from '@/router/views/voluntario/EventosView.vue'
import TransitoView from '@/router/views/refugio/TransitoView.vue'
import StockView from '@/router/views/refugio/StockView.vue'
import VacunasView from '@/router/views/refugio/VacunasView.vue'
import RecoverPassword from '@/router/views/ppales/RecoverPassword.vue'
import OutsideView from '@/router/views/OutsideView.vue'
import { useAuthStore } from '@/stores/auth.ts'
import ChangePassword from '@/router/views/ppales/ChangePassword.vue'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/', component: OutsideView, children: [
                { path: '/login', component: Login, meta: { external: true} },
                { path: '/register', component: Register, meta: { external: true} },
                { path: '/recuperar-pass', component: RecoverPassword, meta: { external: true} },
                { path: '/cambiar-pass', component: ChangePassword, meta: { external: true} },
            ]
        },
        { path: '/swap', component: Swap },
        {
            path: '/refugio', component: Refugio, children: [
                { path: '', component: RefugioHome },
                { path: 'mascotas', component: MascotasView },
                { path: 'mascota/:id', component: MascotaView },
                { path: 'vacunas', component: VacunasView },
                { path: 'stock', component: StockView },
                { path: 'transito', component: TransitoView }
            ]
        }, {
            path: '/usuario', component: VoluntarioView, children: [
                { path: '', component: VoluntarioHome },
                { path: 'mascotas', component: VoluntarioMascotasView },
                { path: 'solicitudes', component: SolicitudesView },
                { path: 'eventos', component: EventosView }
            ]
        }
    ]
})
router.beforeEach((to, from) => {
    const authStore = useAuthStore()
    if(!to.meta.external){
        if(!authStore.user){
            return { path: '/login'};
        }
    }
});


export default router

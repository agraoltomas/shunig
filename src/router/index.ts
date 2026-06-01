import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/router/views/Login.vue'
import Register from '@/router/views/Register.vue'
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
import TransitoView from '@/router/views/refugio/transito/TransitoView.vue'
import VacunasView from '@/router/views/refugio/VacunasView.vue'
import RecoverPassword from '@/router/views/ppales/RecoverPassword.vue'
import OutsideView from '@/router/views/OutsideView.vue'
import { useAuthStore } from '@/stores/auth.ts'
import ChangePassword from '@/router/views/ppales/ChangePassword.vue'
import MascotaTransitoView from '@/router/views/refugio/transito/MascotaTransitoView.vue'
import AdministrarUsuarioView from '@/router/views/voluntario/AdministrarUsuarioView.vue'
import { useRefugioStore } from '@/stores/refugio.ts'
import AdministrarRefugioView from '@/router/views/refugio/AdministrarRefugioView.vue'
import PatrocinadoresView from '@/router/views/refugio/PatrocinadoresView.vue'
import PatrocinadorView from '@/router/views/refugio/PatrocinadorView.vue'
import InventarioView from "@/router/views/refugio/InventarioView.vue"
import ProductoView from "@/router/views/refugio/ProductoView.vue"

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
                { path: 'transito', component: TransitoView },
                { path: 'transito/:id', component: MascotaTransitoView },
                { path: 'administrar', component: AdministrarRefugioView },
                { path: 'patrocinadores', component: PatrocinadoresView },
                { path: 'patrocinador/:id', component: PatrocinadorView },
                { path: 'inventario', component: InventarioView },
                { path: 'inventario/producto/:id', component: ProductoView}
            ]
        }, {
            path: '/usuario', component: VoluntarioView, children: [
                { path: "administrar", component: AdministrarUsuarioView },
                { path: '', component: VoluntarioHome },
                { path: 'mascotas', component: VoluntarioMascotasView },
                { path: 'mascota/:id', component: MascotaView },
                { path: 'solicitudes', component: SolicitudesView },
                { path: 'eventos', component: EventosView }
            ]
        }
    ]
})

router.beforeEach(async (to, from) => {
    const authStore = useAuthStore()

    if(!to.meta.external && from.path != '/login'){
        if(!authStore.user){
            const r = await authStore.revalidarUsuario()
            if(!r){
                return { path: '/login'};
            }else{
                const refugioStore = useRefugioStore()
                await refugioStore.loadContextRefugio(r);
            }
        }
    }
});


export default router

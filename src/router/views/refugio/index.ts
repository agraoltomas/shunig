import RefugioHome from '@/router/views/refugio/RefugioHome.vue'
import MascotasView from '@/router/views/refugio/MascotasView.vue'
import MascotaView from '@/router/views/refugio/MascotaView.vue'
import VacunasView from '@/router/views/refugio/VacunasView.vue'
import StockView from '@/router/views/refugio/StockView.vue'
import TransitoView from '@/router/views/refugio/transito/TransitoView.vue'
import MascotaTransitoView from '@/router/views/refugio/transito/MascotaTransitoView.vue'
import AdministrarRefugioView from '@/router/views/refugio/AdministrarRefugioView.vue'
import PatrocinadoresView from '@/router/views/refugio/PatrocinadoresView.vue'
// @ts-ignore
import SolicitudesView from '@/router/views/refugio/SolicitudesView.vue'
import PatrocinadorView from '@/router/views/refugio/PatrocinadorView.vue'

const routes = [
    { path: '', component: RefugioHome },
    { path: 'mascotas', component: MascotasView },
    { path: 'mascota/:id', component: MascotaView },
    { path: 'vacunas', component: VacunasView },
    { path: 'stock', component: StockView },
    { path: 'transito', component: TransitoView },
    { path: 'transito/:id', component: MascotaTransitoView },
    { path: 'administrar', component: AdministrarRefugioView },
    { path: 'patrocinadores', component: PatrocinadoresView },
    { path: 'solicitudes', component: SolicitudesView },
    { path: 'patrocinador/:id', component: PatrocinadorView },
]

export default routes
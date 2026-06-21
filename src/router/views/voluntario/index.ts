import AdministrarUsuarioView from '@/router/views/voluntario/AdministrarUsuarioView.vue'
import VoluntarioHome from '@/router/views/voluntario/VoluntarioHome.vue'
import VoluntarioMascotasView from '@/router/views/voluntario/MascotasView.vue'
import VoluntarioMascotaView from '@/router/views/voluntario/MascotaView.vue'
import SolicitudesView from '@/router/views/voluntario/solicitudes/SolicitudesView.vue'
import EventosView from '@/router/views/voluntario/EventosView.vue'
import router from '@/router'
import InicioAdopcionView from '@/router/views/voluntario/InicioAdopcionView.vue'
import InicioTransitoView from '@/router/views/voluntario/InicioTransitoView.vue'
import SolicitudDetalleView from '@/router/views/voluntario/solicitudes/SolicitudDetalleView.vue'


const routes = [
    { path: "administrar", component: AdministrarUsuarioView },
    { path: '', component: VoluntarioHome },
    { path: 'mascotas', component: VoluntarioMascotasView },
    { path: 'mascota/:id', component: VoluntarioMascotaView },
    { path: 'solicitudes', component: SolicitudesView },
    { path: 'solicitud/:id', component: SolicitudDetalleView },
    { path: 'eventos', component: EventosView },
    { path: 'adoptar', component: InicioAdopcionView},
    {  path: 'transitar', component: InicioTransitoView},
    {path: 'notificaciones', component: () => import('@/router/views/NotificacionesView.vue') }
]

export default routes
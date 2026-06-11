// import InventarioView from
// import ProductoView from
// import RefugioHome from
// import MascotasView from
// import MascotaView from
// import VacunasView from
// import TransitoView from
// import MascotaTransitoView from
// import AdministrarRefugioView from
// import PatrocinadoresView from
// import SolicitudesView from
// import SolicitudDetalleView from
// import PatrocinadorView from
// @ts-ignore

const routes = [
    { path: 'inventario', component: () => import('@/router/views/refugio/InventarioView.vue') },
    { path: 'inventario/producto/:id', component: () => import('@/router/views/refugio/ProductoView.vue')},
    { path: '', component: () => import('@/router/views/refugio/RefugioHome.vue') },
    { path: 'mascotas', component: () => import('@/router/views/refugio/MascotasView.vue') },
    { path: 'mascota/:id', component: () => import('@/router/views/refugio/MascotaView.vue') },
    { path: 'vacunacion', component: () => import('@/router/views/refugio/VacunasView.vue') },
    { path: 'vacunacion/:id/', component: () => import('@/router/views/refugio/vacunacion/EventoDetalleView.vue') },
    { path: 'transito', component: () => import('@/router/views/refugio/transito/TransitoView.vue') },
    { path: 'transito/:id', component: () => import('@/router/views/refugio/transito/MascotaTransitoView.vue') },
    { path: 'adopcion', component: () => import('@/router/views/refugio/adopcion/AdopcionView.vue') },
    { path: 'adopcion/:id', component: () => import('@/router/views/refugio/adopcion/MascotaAdopcionView.vue') },
    { path: 'alertas', component: () => import('@/router/views/refugio/AlertasView.vue') },
    { path: 'administrar', component: () => import('@/router/views/refugio/AdministrarRefugioView.vue') },
    { path: 'patrocinadores', component: () => import('@/router/views/refugio/PatrocinadoresView.vue') },
    { path: 'solicitudes', component: () => import('@/router/views/refugio/solicitudes/SolicitudesView.vue') },
    { path: 'solicitud/:id', component: () => import('@/router/views/refugio/solicitudes/SolicitudDetalleView.vue') },
    { path: 'patrocinador/:id', component: () => import('@/router/views/refugio/PatrocinadorView.vue') },
    {path: 'evento-vacunacion/ingresar/', component: () => import ('@/router/views/refugio/vacunacion/EventoVacunacionIngresoView.vue') },
]

export default routes
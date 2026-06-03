export const rutas_api = {
    auth: {
        LOGIN: () => '/auth/login',
        REFUGIOS_USUARIO: ({ user_id }: { user_id: string }) => `/auth/refugios/${user_id}/`,
        SESSION: () => '/auth/session'
    },
    usuario: {
        UPDATE: ({ id_usuario }: { id_usuario: string | number }) => `/usuario/${id_usuario}`,
        GET: ({ id_usuario }: { id_usuario: string | number }) => `/usuario/${id_usuario}`
    },
    refugio: {
        GET: ({ id_refugio }: { id_refugio: string | number }) => `/refugio/${id_refugio}/`,
        LIST: () => `/refugio/`,
        USUARIOS: (id_refugio: string) => `/refugio/${id_refugio}/usuarios/`,
        RECHAZAR_USUARIO: (id_refugio: string) => `/refugio/${id_refugio}/usuarios/rechazar/`,
    },
    animales: {
        LIST: () => `/animal/`,
        salud: {
            LIST: (id_animal: string) => `/animal/${id_animal}/salud/`,
        }
    },
    transito: {
        reporte: {
            CARGAR: ({ id_mascota }: { id_mascota: string | number }) => `animal/${id_mascota}/transito/reporte/`,
            GET: ({ id_transito }: { id_transito: string }) => `/transito/${id_transito}/reportes/`
        }
    },
    adopcion: {
        reporte: {
            CARGAR: ({ id_mascota }: { id_mascota: string | number }) => `animal/${id_mascota}/adopcion/reporte/`,
            GET: ({ id_transito }: { id_transito: string }) => `/adopcion/${id_transito}/reportes/`
        }
    },
    solicitud: {
        USUARIO: (id_usuario: string) => `/solicitud/usuario/${id_usuario}`,
        GET: (id_solicitud: string) => `/solicitud/${id_solicitud}/`,
    },
    eventos_vacunacion:{
        LIST: () => `/vacunas/eventos/`,
    },
    vacunas: {
        ANIMAL: (id_animal: string|number) => `/animal/${id_animal}/vacunas/`,
    }
}
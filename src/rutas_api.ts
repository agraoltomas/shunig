export const rutas_api = {
    auth: {
        LOGIN: () => "/auth/login",
        REFUGIOS_USUARIO: ({ user_id }: {user_id: string}) => `/auth/refugios/${user_id}/`,
    }
}
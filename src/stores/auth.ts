import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { Maybe, MessageResponse } from '@/lib/tipos/generics'
import type { User } from '@/lib/tipos/usuarios'
import { useAxios } from '@/lib/axios.ts'
import { rutas_api } from '@/rutas_api.ts'
import { AxiosError } from 'axios'
import { useJWTToken } from '@/lib/token.ts'

const token = useJWTToken()
const { axios } = useAxios()

export const useAuthStore = defineStore('auth', () => {


    const user: Ref<Maybe<User>> = ref(null)
    const login = async (usuario: string, password: string): Promise<Maybe<string>> => {
        try {
            const r = await axios.value.post(rutas_api.auth.LOGIN(), {
                email: usuario,
                password: password
            })
            const response: MessageResponse<{ token: string, usuario: User }> = r.data
            console.log(response)
            if (response.ok) {
                token.saveToken(response.data.token)
                user.value = response.data.usuario
            }
            return null
        } catch (error) {
            if (error instanceof AxiosError) {
                const r: MessageResponse<never> = error.response?.data
                return r?.message
            } else if (error instanceof Error) {
                return error.toString()
            } else {
                console.log(error)
                return 'Error desconocido'
            }
        }
    }
    const revalidarUsuario = async (): Promise<Maybe<User>> => {
        try {
            const r = await axios.value.get(rutas_api.auth.SESSION())
            const response: MessageResponse<User> = r.data
            console.log(response)
            user.value = response.data
            return user.value
        } catch (error) {
            return null
            // if(error instanceof AxiosError){
            // }
        }
    }

    const revalidarCondicional = async (): Promise<Maybe<User>> => {
        if (user.value) return null
        return await revalidarUsuario()

    }

    const logout = () => {
        user.value = null
        token.deleteToken()
    }

    const validarRoles = (rs: number[]) => {
        if (!user.value) return false
        const misRoles = user.value.roles.map(r => r.id_rol)
        for (const rol_id of rs) {
            if (misRoles.includes(rol_id.toString())) {
                return true
            }
        }
        return false
    }

    return {
        user,
        login,
        revalidarUsuario,
        revalidarCondicional,
        logout,
        validarRoles,
    }
})
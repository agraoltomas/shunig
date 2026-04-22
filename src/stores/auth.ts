import { ref, computed, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { Maybe } from '@/lib/tipos/generics'
import type { User } from '@/lib/tipos/usuarios'

const TOKEN_KEY = 'jwt_token'

export const useAuthStore = defineStore('auth', () => {
    const saveToken = (token: string ) => {
        localStorage.setItem(TOKEN_KEY, token)
    }
    const getToken = () => {
        return localStorage.getItem(TOKEN_KEY)
    }
    const jwt_token = computed(() => getToken())
    const user: Ref<Maybe<User>> = ref(null)
    const estaLogueado = () => {
        return !!localStorage.getItem(TOKEN_KEY)
    }

    return {
        user,
        jwt_token,
        saveToken,
        getToken,
        estaLogueado
    }
})
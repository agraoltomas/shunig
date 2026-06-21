import { computed, ref } from 'vue'

export const TOKEN_KEY = 'jwt_token'

// separo esta declaracion para evitar referencias circulares
const getToken = () => {
    return localStorage.getItem(TOKEN_KEY)
}

const jwt_token = ref(getToken())

export const useJWTToken = () => {
    
    const deleteToken = () => {
        jwt_token.value = ''
        localStorage.removeItem(TOKEN_KEY)
    }
    const saveToken = (token: string) => {
        localStorage.setItem(TOKEN_KEY, token)
        jwt_token.value = token
    }
    return {
        getToken,
        jwt_token,
        saveToken,
        deleteToken
    }
}
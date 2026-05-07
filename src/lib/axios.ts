import axios from 'axios'
import { computed, ref, watch } from 'vue'
import { useJWTToken } from '@/lib/token.ts'


axios.defaults.baseURL = `http://${import.meta.env.VITE_API_BASE}`
axios.defaults.headers['Content-Type'] = 'application/json'
export const useAxios = () => {
    const { jwt_token } = useJWTToken()
    // watch(() => jwt_token.value, () => {
    //     axiosRef.value.defaults.headers.common['Authorization'] = `Bearer ${jwt_token}`
    // })
    const axiosRef = computed(() => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${jwt_token.value}`
        return axios
    })
    return {
        axios: axiosRef
    }
}

export default axios

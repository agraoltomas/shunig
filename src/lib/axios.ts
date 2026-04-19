import axios from "axios";
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth.ts'

axios.defaults.baseURL = `http://${import.meta.env.VITE_API_BASE}`;
axios.defaults.headers['Content-Type'] = 'application/json';
export const useAxios = () => {
    const axiosRef = ref(axios);
    const authStore = useAuthStore();
    if(authStore.user){
        axiosRef.value.defaults.headers.common['Authorization'] = `Bearer ${authStore.jwt_token}`;
    }
    watch(() => authStore.user, () => {
        if(authStore.user){
            axiosRef.value.defaults.headers.common['Authorization'] = `Bearer ${authStore.jwt_token}`;
        }
    })
    return {
        axios: axiosRef
    }
}

export default axios;

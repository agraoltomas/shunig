import { defineStore } from 'pinia'
import { useAxios } from '@/lib/axios.ts'
import { rutas_api } from '@/rutas_api.ts'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
import { useAuthStore } from '@/stores/auth.ts'
import { useResponse } from '@/lib/utils/response.ts'
import { type Ref, ref } from 'vue'
import type { IMascota } from '@/lib/tipos/mascotas'
const { axios } = useAxios()
const {unwrap} = useResponse()

const {loading, startLoading, stopLoading } = useLoadingComposable()
export const useUsuarioStore = defineStore('usuario',() => {
    const {user} = useAuthStore()
    const getUsuario = (id: string|number) => {
        const { axios} = useAxios()
        try {
            const r = axios.value.get(rutas_api.usuario.GET({ id_usuario: id }));

        }catch(err) {

        }


    }
    const animales: Ref<IMascota[]> = ref([])
    const loadAnimalesUsuario = async () => {
        if(!user)return
        if(animales.value.length == 0){
            startLoading()
            try{
                const r = await unwrap(axios.value.get(`/animal/usuario/${user.id_usuario}/`))
                animales.value = r.data
            }catch (error) {
            }finally{
                stopLoading()
            }
        }
    }
    const  init = async() => {
        if(animales.value.length == 0){
            await loadAnimalesUsuario()
        }
    }
    return {
        loading,
        loadAnimalesUsuario,
        animales,
        init
    }
})
import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'
import { useAxios } from '@/lib/axios.ts'
import type { User } from '@/lib/tipos/usuarios'
import { rutas_api } from '@/rutas_api.ts'
import { AxiosError } from 'axios'
import type { Maybe, MessageResponse } from '@/lib/tipos/generics'
import type { IRefugio } from '@/lib/tipos/refugio'


export const useRefugioStore = defineStore('refugio', () => {
    const axiosService = useAxios();

    const refugio: Ref<Maybe<IRefugio>> = ref(null);
    const loadContextRefugio = async (user: User) => {
        refugio.value = null;
        try{
            const r = await axiosService.axios.value.get(rutas_api
              .auth.REFUGIOS_USUARIO({user_id: user.id_usuario}));
            const response: MessageResponse<IRefugio> = r.data;
            if(response.ok){
                refugio.value = response.data;
            }

        }catch(e){
            refugio.value = null;
            if(e instanceof AxiosError){
                //...
            }
        }
    }
    return {
        refugio,
        loadContextRefugio,
    }
})
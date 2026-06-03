import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'
import type { IEventoVacunacion } from '@/lib/tipos/vacunacion.ts'
import { useAxios } from '@/lib/axios.ts'
import { useResponse } from '@/lib/utils/response.ts'
import { rutas_api } from '@/rutas_api.ts'

const {axios} = useAxios()
const {unwrap} = useResponse()
export const useEventosVacunacionStore = defineStore('eventos-vacunacion', () => {
    const eventos: Ref<IEventoVacunacion[]> = ref([])

    const listar = async () => {
        try{
            const r = await unwrap<IEventoVacunacion[]>(axios.value.get(rutas_api.eventos_vacunacion.LIST()))
            eventos.value = r.data
        }catch(err){
            eventos.value = []
            console.log(err)
        }
        return eventos.value
    }
    return {
        eventos,
        listar,
    }
})
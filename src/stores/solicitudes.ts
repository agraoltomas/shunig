import { defineStore } from 'pinia'
import { useAxios } from '@/lib/axios.ts'
import { useResponse } from '@/lib/utils/response.ts'

const { axios } = useAxios()
const { unwrap } = useResponse()


export const useSolicitudesStore = defineStore('solicitudes', () => {
    const aceptar = async (id: string | number) => {
        try {
            const r = await unwrap(axios.value.post(`/solicitud/${id}/aceptar/`))
            return r.ok
        } catch (err) {
            console.error(err)
            return false
        }
    }
    const rechazar = async (id: string | number) => {
        try{
            const r = await unwrap(axios.value.post(`/solicitud/${id}/rechazar/`))
            return r.ok
        }catch (err){
            console.error(err)
            return false
        }
    }
    return {
        aceptar,
        rechazar
    }
})
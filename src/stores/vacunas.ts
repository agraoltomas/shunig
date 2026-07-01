import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'
import type { IEventoVacunacion } from '@/lib/tipos/vacunacion.ts'
import { useAxios } from '@/lib/axios.ts'
import { useResponse } from '@/lib/utils/response.ts'
import { rutas_api } from '@/rutas_api.ts'
import { useUsuarioStore } from '@/stores/usuario.ts'
import { useAuthStore } from '@/stores/auth.ts'
import { useLoadingComposable } from '@/lib/utils/loading.ts'

const {axios} = useAxios()
const {unwrap} = useResponse()
const {loading, startLoading,stopLoading} = useLoadingComposable()
export interface InscripcionEvento{
    created_at: string,
    id_animal: string,
    id_estado_inscripcion_tipo: string,
    id_evento_vacunacion: string,
    id_inscripcion_evento_vacunacion: string,
    imagen: string,
    nombre: string,
    especie: string,
    nombre_usuario: string,
    email: string,
    telefono: string,
    aplicada: boolean
}

export const useEventosVacunacionStore = defineStore('eventos-vacunacion', () => {
    const authStore = useAuthStore()
    const eventos: Ref<IEventoVacunacion[]> = ref([])
    const inscripcionesEvento: Ref<InscripcionEvento[]> = ref([])
    const cargarInscripcionesUsuario = async () => {
        console.info('cargarInscripcionesUsuario')
        if(inscripcionesEvento.value.length > 0)return;
        if(!authStore.user)return;
        startLoading()
        try{
            const r = await unwrap<InscripcionEvento[]>(axios.value.get(rutas_api.eventos_vacunacion.INSCRIPCIONES_USUARIO(),{
                params: {
                    id_usuario: authStore.user.id_usuario,
                }
            }))
            inscripcionesEvento.value = r.data;
            console.log(r)
        }catch(e){

        }finally {
            stopLoading()
        }
    }
    const cargarInscripcionesEvento = async (id_evento: string) => {
        console.info('cargarInscripcionesEvento')
        if(inscripcionesEvento.value.length > 0)return;
        startLoading()
        try{
            const r = await unwrap<InscripcionEvento[]>(axios.value.get(rutas_api.eventos_vacunacion.INSCRIPCIONES_EVENTO(),{
                params: {
                    id_evento_vacunacion: id_evento,
                }
            }))
            inscripcionesEvento.value = r.data;
            console.log(r)
        }catch(e){

        }finally {
            stopLoading()
        }
    }
    const cargar = async (f?: { id_refugio?: string, estado?: ('disponible')}) => {
        if(eventos.value.length > 0)return;
        startLoading()
        try{
            const r = await unwrap<IEventoVacunacion[]>(axios.value.get(rutas_api.eventos_vacunacion.LIST(),{
                params: {
                    ...f
                }
            }))
            eventos.value = r.data
        }catch(err){
            eventos.value = []
            console.log(err)
        }finally{
            stopLoading()
        }
        return eventos.value
    }
    const getInscripcionesForEvento = (id_evento: string) => {
        return inscripcionesEvento.value.filter(inscripcion  => inscripcion.id_evento_vacunacion = id_evento)
    }
    const actualizarEvento = async (id_evento: string|number, data: {
        fecha_evento?: string,
        cupo_maximo?: string|number
    }) => {
        try{
            const r = await unwrap(axios.value.put(rutas_api.eventos_vacunacion.UPDATE(id_evento),{
                ...data
            }))
            return r.ok
        }catch(e){
            console.log(e)
            return false
        }
    }
    return {
        eventos,
        cargar,
        cargarInscripcionesUsuario,
        inscripcionesEvento,
        loading,
        getInscripcionesForEvento,
        cargarInscripcionesEvento
    }
})
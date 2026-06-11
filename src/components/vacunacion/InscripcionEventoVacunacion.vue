<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'

import type { IEventoVacunacion } from '@/lib/tipos/vacunacion.ts'
import EventoCardDetalle from '@/components/eventos/voluntarios/EventoCardDetalle.vue'
import { useUsuarioStore } from '@/stores/usuario.ts'
import { useResponse } from '@/lib/utils/response.ts'
import { rutas_api } from '@/rutas_api.ts'
import { useAxios } from '@/lib/axios.ts'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
import DetalleMascota from '@/components/vacunacion/DetalleMascota.vue'
import { useToast} from '@/lib/toast/toast.ts'
import { useEventosVacunacionStore } from '@/stores/vacunas.ts'
import type { IMascota } from '@/lib/tipos/mascotas'

const props = defineProps<{ evento: IEventoVacunacion }>()
const { unwrap, tryUnwrapError } = useResponse()
const { axios } = useAxios()
const { loading, stopLoading, startLoading } = useLoadingComposable()
const animalStore = useUsuarioStore()
const animalesInscriptos = ref([])
const toast = useToast()

onBeforeMount(async () => {
    await animalStore.init()

})

const inscribir = async () => {
    if (animalesInscriptos.value.length == 0) return
    console.log(animalesInscriptos.value.length)
    startLoading()
    console.log(loading)
    let oks = 0
    for (const id_animal of animalesInscriptos.value) {
        try{
            const r = await unwrap(axios.value.post(rutas_api.eventos_vacunacion.INSCRIBIR(props.evento.id_evento_vacunacion, id_animal)))
            if(r){
                oks +=1
            }
        }catch(err){
            console.log(tryUnwrapError(<Error>err))
        }
    }
    if(oks > 0){
        toast.add({ severity: "success", detail:`${oks} animal${oks > 1 ? 'es' :''} inscripto${oks > 1 ? 'es' :''}`})
    }
    stopLoading()
}

</script>

<template>
    <div class="flex flex-row border-b-gray-200 border-b">
        <i class="pi pi-calendar text-3xl text-blue-500 p-5 bg-blue-100/20 rounded-full h-fit m-auto"></i>
        <EventoCardDetalle :evento="evento"></EventoCardDetalle>
    </div>
    <div v-if="animalStore.loading">
        <ProgressSpinner></ProgressSpinner>
    </div>
    <div v-else-if="animalStore.animales.length > 0">
        <DetalleMascota v-for="animal in animalStore.animales" :animal="animal" :evento="evento"
                        v-model="animalesInscriptos">
        </DetalleMascota>
        <div class="flex flex-row gap-3 justify-end">
            <div v-if="loading">
                <ProgressSpinner class="w-10"></ProgressSpinner>
            </div>
            <Button class="bg-refugio-500! border-refugio-500" v-else icon="pi pi-save"
                    :label="animalesInscriptos.length == 0 ? 'Seleccione un animal': `Inscribir ${animalesInscriptos.length} animales`"
                    :disabled="animalesInscriptos.length == 0" @click="inscribir">
            </Button>
        </div>
    </div>
    <div v-else>
        No tenes animales para vacunar
    </div>

</template>

<style scoped>

</style>
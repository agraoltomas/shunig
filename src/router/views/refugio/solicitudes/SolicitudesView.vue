<script setup lang="ts">

import SolicitudesPendientesTabla from '@/components/solicitud/SolicitudesPendientesTabla.vue'
import ProgressSpinner from '@/volt/ProgressSpinner.vue'
import ItemSolicitud from '@/components/solicitud/ItemSolicitud.vue'
import { useRefugioStore } from '@/stores/refugio.ts'
import { useAxios } from '@/lib/axios.ts'
import { computed, onMounted, ref, type Ref, useTemplateRef } from 'vue'
import type { IDatosSolicitud } from '@/lib/tipos/solicitud.ts'
import { useToast } from '@/lib/toast/toast.ts'
import type { MessageResponse } from '@/lib/tipos/generics'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
import { useRouter } from 'vue-router'
import ContenedorTitulo from '@/components/generales/ContenedorTitulo.vue'
import Contenedor from '@/components/generales/Contenedor.vue'


const { loading, startLoading, stopLoading } = useLoadingComposable()
const { refugio } = useRefugioStore()
const { axios } = useAxios()
const solicitudes: Ref<IDatosSolicitud[]> = ref([])
const toast = useToast()

const router = useRouter()
const loadSolicitudes = async () => {
    if (!refugio) return
    startLoading()
    try {
        const r = await axios.value.get(`solicitud/refugio/${refugio.id_refugio}`)
        const response: MessageResponse<IDatosSolicitud[]> = r.data
        solicitudes.value = response.data
    } catch (e) {
        toast.add({ detail: 'error cargando solicitudes', severity: 'error' })
    } finally {
        stopLoading()
    }
}

onMounted(() => {
    loadSolicitudes()
})
type Filters = ('todos' | 'pendientes' | 'aceptadas' | 'rechazadas')
const filter: Ref<Filters> = ref('pendientes')
const solicitudesFiltradas = computed(() => {
    switch (filter.value){
        case 'todos': return solicitudes.value
        case 'pendientes': return solicitudes.value.filter(s => s.estado == 'Pendiente')
        case 'aceptadas': return solicitudes.value.filter(s => s.estado == 'Aceptada')
        case 'rechazadas': return solicitudes.value.filter(s => s.estado == 'Rechazada')
    }
})
</script>

<template>
    <div class="w-3/4 m-auto">
        <div class=" mb-5 mt-10">
            <div class="bg-refugio-500 px-7 py-5 w-full h-full text-center text-4xl font-bold rounded-2xl">
                <span class="text-white">Solicitudes</span>
            </div>
        </div>

        <Contenedor class="m-auto">
            <div class="max-w-screen min-h-screen m-auto">
                <div v-if="loading">
                    <ProgressSpinner></ProgressSpinner>
                </div>
                <div v-else-if="solicitudes.length == 0" class="m-auto w-fit text-slate-400">
                    No tiene solicitudes. ¡Adopte hoy!
                </div>
                <div v-else class="overflow-y-auto  flex flex-col gap-3 p-3">
                    <div class="flex flex-row gap-1 cursor-pointer">
                        <div :class="['px-3 py-2 border rounded-lg text-xl border-gray-400 text-gray-500', filter == 'todos' ? 'border-primary-500 text-primary-500':'']" @click="() => filter = 'todos'">Todos</div>
                        <div :class="['px-3 py-2 border rounded-lg text-xl border-gray-400 text-gray-500', filter == 'pendientes' ? 'border-primary-500 text-primary-500':'']" @click="() => filter = 'pendientes'">Pendientes</div>
                        <div :class="['px-3 py-2 border rounded-lg text-xl border-gray-400 text-gray-500', filter == 'aceptadas' ? 'border-primary-500 text-primary-500':'']" @click="() => filter = 'aceptadas'">Aceptadas</div>
                        <div :class="['px-3 py-2 border rounded-lg text-xl border-gray-400 text-gray-500', filter == 'rechazadas' ? 'border-primary-500 text-primary-500':'']" @click="() => filter = 'rechazadas'">Rechazadas</div>
                    </div>
                    <div v-if="solicitudesFiltradas.length == 0" class="p-3 text-center">
                        No hay solicitudes en esta categoria
                    </div>
                    <ItemSolicitud v-for="solicitud in solicitudesFiltradas" :solicitud="solicitud" class="p-3">
                        <template #nav-button>
                            <Button label="Ver Detalle" icon="pi pi-arrow-right"
                                    class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500"
                                    @click="() => router.push(`/refugio/solicitud/${solicitud.id_solicitud}`)"></Button>
                        </template>
                    </ItemSolicitud>
                </div>
            </div>
        </Contenedor>
    </div>
</template>

<style scoped>

</style>
<script setup lang="ts">

import SolicitudesPendientesTabla from '@/components/solicitud/SolicitudesPendientesTabla.vue'
import ProgressSpinner from '@/volt/ProgressSpinner.vue'
import ItemSolicitud from '@/components/solicitud/ItemSolicitud.vue'
import { useRefugioStore } from '@/stores/refugio.ts'
import { useAxios } from '@/lib/axios.ts'
import { onMounted, ref, type Ref, useTemplateRef } from 'vue'
import type { IDatosSolicitud } from '@/lib/tipos/solicitud.ts'
import { useToast } from '@/lib/toast/toast.ts'
import type { MessageResponse } from '@/lib/tipos/generics'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
import { useRouter } from 'vue-router'


const {loading, startLoading,stopLoading} = useLoadingComposable();
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
    }finally {
        stopLoading()
    }
}

onMounted(() => {
    loadSolicitudes()
});
</script>

<template>
    <div class="max-h-[60vh] mx-10 max-w-screen">
        <div v-if="loading">
            <ProgressSpinner></ProgressSpinner>
        </div>
        <div v-else-if="solicitudes.length == 0" class="m-auto w-fit text-slate-400">
            No tiene solcitudes. Adopte hoy!
        </div>
        <div v-else class="overflow-y-auto  flex flex-col gap-3 p-3">
            <ItemSolicitud v-for="solicitud in solicitudes" :solicitud="solicitud">
                <template #nav-button>
                    <Button label="Ver Detalle" icon="pi pi-arrow-right" variant="outlined" @click="() => router.push(`/refugio/solicitud/${solicitud.id_solicitud}`)"></Button>
                </template>
            </ItemSolicitud>
        </div>
    </div>
</template>

<style scoped>

</style>
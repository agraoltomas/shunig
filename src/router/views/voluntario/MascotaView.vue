<script setup lang="ts">
import Mascota from '@/components/mascotas/Mascota.vue'
import { onMounted, type Ref, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/lib/axios.ts'
import type { IMascota } from '@/lib/tipos/mascotas'
import type { Maybe } from '@/lib/tipos/generics'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
import cryingDog from '@/assets/images/crying_dog.jpg'
import { AxiosError } from 'axios'
import ProgressSpinner from '@/volt/ProgressSpinner.vue'
import PanelSurface from '@/components/generales/PanelSurface.vue'
import MascotaDetalle from '@/components/mascotas/MascotaDetalle.vue'
import moment from 'moment/moment'
import ReporteTabla from '@/components/transito/ReporteTabla.vue'
import Modal from '@/components/modal/Modal.vue'
import type { Reporte } from '@/lib/tipos/reportes'
import { rutas_api } from '@/rutas_api.ts'
import { useResponse } from '@/lib/utils/response.ts'
import { useToast } from '@/lib/toast/toast.ts'

const { unwrap, tryLogError } = useResponse()
const route = useRoute()
const mascota: Ref<Maybe<IMascota>> = ref(null)
const { loading, stopLoading, startLoading } = useLoadingComposable()
const toast = useToast()
const loadReportes = async () => {
    console.log(mascota.value)
    if (!mascota.value) return
    startLoading()
    console.log(mascota.value)
    try {
        if (mascota.value.transito) {
            const r = await unwrap<Reporte[]>(axios.get(rutas_api.transito.reporte.GET({ id_transito: mascota.value.transito.toString() })))
            reportes.value = r.data
        } else if(mascota.value.adopcion) {
            const r = await unwrap<Reporte[]>(axios.get(rutas_api.adopcion.reporte.GET({ id_transito: mascota.value.adopcion.toString() })))
            reportes.value = r.data
        }
    } catch (e) {
        tryLogError(<Error>e,toast)
    }
    stopLoading()

}
const loadMascota = async () => {
    startLoading()
    try {
        const r = await unwrap(axios.get(`/animal/${route.params.id}`))
        console.log(r.data)
        mascota.value = r.data
    } catch (error) {

    }
    stopLoading()

}
onMounted(async () => {
    await loadMascota()
})

watch(() => route.params.id, async () => {
    await loadMascota()
})
watch(() => mascota.value, async () => {
    await loadReportes();
})


const reportes: Ref<Reporte[]> = ref([])
</script>

<template>
    <PanelSurface :header="mascota?.nombre" class="mx-36">
        <div v-if="loading">
            <ProgressSpinner></ProgressSpinner>
        </div>
        <div v-else class="flex flex-row gap-3">
            <MascotaDetalle v-if="mascota" :mascota="mascota">
            </MascotaDetalle>
        </div>
        <PanelSurface header="Reportes" class="m-0! mt-8!">
            <ProgressSpinner v-if="loading"></ProgressSpinner>
            <ReporteTabla v-else-if="mascota" :reportes="reportes" class="m-auto" :mascota="mascota"></ReporteTabla>
        </PanelSurface>
    </PanelSurface>
</template>

<style scoped>

</style>
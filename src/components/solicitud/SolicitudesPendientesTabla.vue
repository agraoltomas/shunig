<script setup lang="ts">
import type { Maybe, MessageResponse } from '@/lib/tipos/generics'
import { useRefugioStore } from '@/stores/refugio.ts'
import { useAxios } from '@/lib/axios.ts'
import { onMounted, ref, type Ref, useTemplateRef } from 'vue'
import type { IDatosSolicitud } from '@/lib/tipos/solicitud.ts'
import { useToast } from '@/lib/toast/toast.ts'
import handshake from '@/assets/images/handshake-regular-full.svg'
import paw from '@/assets/images/paw-solid-full-black.svg'
import moment from 'moment/moment'
import DangerButton from '@/volt/DangerButton.vue'
import Popover from '@/volt/Popover.vue'
import MostrarSolicitud from '@/components/solicitud/MostrarSolicitud.vue'

const { refugio } = useRefugioStore()
const { axios } = useAxios()
const solicitudes: Ref<IDatosSolicitud[]> = ref([])
const toast = useToast()
const popover= useTemplateRef("detalleSolicitudPopover");

const show = (e: Event) => {
    console.log(e,popover)
    if(!popover.value)return;
    popover.value.show(e)
}

const loadSolicitudes = async () => {
    if (!refugio) return
    try {
        const r = await axios.value.get(`solicitud/refugio/${refugio.id_refugio}`)
        const response: MessageResponse<IDatosSolicitud[]> = r.data
        solicitudes.value = response.data
    } catch (e) {
        toast.add({ detail: 'error cargando solicitudes', severity: 'error' })
    }
}

onMounted(() => {
    loadSolicitudes()
});
const solicitudSeleccionada: Ref<Maybe<IDatosSolicitud>> = ref(null);
const seleccionarSolicitud = (s: IDatosSolicitud) => {
    solicitudSeleccionada.value = s;
}
const mostrarSolicitud = (s: IDatosSolicitud, e: Event) => {
    seleccionarSolicitud(s);
    show(e)
}

</script>


<template>
    <DataTable :value="solicitudes">
        <Column :field="(d: IDatosSolicitud) => `#${d.id_solicitud}`"></Column>
        <Column header="Responsable" field="responsable_principal"></Column>
        <Column header="Tipo">
            <template #body="{data, field}">
                <img :alt="data['tipo_solicitud'] == 'transito' ? 'transito' : 'adopcion'" class="size-5 text-white" :src="data['tipo_solicitud'] =='transito' ? handshake : paw">
            </template>
        </Column>
        <Column header="Desde">
            <template #body="{data}">
                {{ moment(data['fecha_desde']).format('DD/MM/YYYY')}}
            </template>
        </Column>
        <Column header="Hasta">
            <template #body="{data}">
                {{ data['fecha_hasta'] ? moment(data['fecha_hasta']).format('DD/MM/YYYY') : '-'}}
            </template>
        </Column>
        <Column>
            <template #body="{data}">
                <Button icon="pi pi-eye" @click="(e) => mostrarSolicitud(data, e)"></Button>
            </template>
        </Column>
    </DataTable>
    <Popover ref="detalleSolicitudPopover">
        <MostrarSolicitud :solicitud="solicitudSeleccionada"></MostrarSolicitud>
    </Popover>
</template>

<style scoped>

</style>
<script setup lang="ts">

import Column from 'primevue/column'
import DataTable from '@/volt/DataTable.vue'
import { onMounted, ref, type Ref, watch } from 'vue'
import type { HistorialAnimal } from '@/lib/tipos/mascotas'
import type { MessageResponse } from '@/lib/tipos/generics'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
import { useAxios } from '@/lib/axios.ts'
import moment from 'moment'
const props = defineProps<{ id_animal: string}>()
const historial: Ref<HistorialAnimal[]> = ref([]);
const {loading, stopLoading, startLoading} = useLoadingComposable()
const {axios } = useAxios();

onMounted(async () => {
   await getHistorial();
});
const getHistorial = async () => {
    if(!props.id_animal)return;
    startLoading()
    try {
        const r = await axios.value.get(`/animal/${props.id_animal}/historial/`)
        const response: MessageResponse<HistorialAnimal[]> = r.data
        historial.value = response.data
    } catch (error) {

    } finally {
        stopLoading()
    }
}
watch(() => props.id_animal, () => {
    getHistorial();
});

</script>

<template>
    <DataTable :value="historial" :loading="loading">
        <Column header="Desde" field="fecha_desde">
            <template #body="{data, field}">
                {{ moment(data[field]).format("DD/MM/YYYY")}}
            </template>
        </Column>
        <Column header="Hasta" field="fecha_hasta">
            <template #body="{data, field}">
                {{ data[field] ? moment(data[field]).format("DD/MM/YYYY") :"-" }}
            </template>
        </Column>
        <Column header="Tipo" field="tipo"></Column>
        <Column header="Detalle" field="detalle"></Column>
    </DataTable>
</template>

<style scoped>

</style>
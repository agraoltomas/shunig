<script setup lang="ts">
import { onMounted, type Ref, ref, watch } from 'vue'
import type { Maybe, MessageResponse } from '@/lib/tipos/generics'
import type { IMascota } from '@/lib/tipos/mascotas'
import axios from '@/lib/axios.ts'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
import { useRoute } from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner'
import moment from 'moment'
import DataTable from '@/volt/DataTable.vue'
import Column from 'primevue/column'
import type { User } from '@/lib/tipos/usuarios'
import DataBlock from '@/components/generales/DataBlock.vue'

const { loading, startLoading, stopLoading } = useLoadingComposable()

interface Reporte {
    imagenes: string[]
}

interface DetalleTransito {
    transito: {},
    animal: IMascota,
    usuario: User,
    reportes: {}[]
}

const transito: Ref<Maybe<DetalleTransito>> = ref(null)
const route = useRoute()
const getTransito = async () => {
    startLoading()
    if (isNaN(Number(route.params.id))) return
    try {
        const r = await axios.get(`/transito/${route.params.id}/`, {})
        const response: MessageResponse<DetalleTransito> = r.data
        transito.value = response.data
    } catch (error) {

    } finally {
        stopLoading()
    }
}

onMounted(async () => {
    await getTransito()
})

watch(() => route.params.id, () => {

    getTransito()
})
const STRING_LENGTH = 40
const actualizaciones = ref([
    { images: [1], fecha: moment().add(1, 'days'), descripcion: 'Hoy jugo mucho!' },
    { images: [1, 2, 4], fecha: moment().add(2, 'days'), descripcion: 'comio algo que no debia y gomito' },
    { images: [1, 2, 4, 5, 4], fecha: moment().add(3, 'days'), descripcion: 'sin noticias' },
    {
        fecha: moment().add(4, 'days'),
        descripcion: 'se convirtio en un demonio lovecraftiano y me hizo temerle a la existencia misma'
    }
])

export interface HistorialMascota {
    fecha_desde: moment.Moment,
    fecha_hasta: Maybe<moment.Moment>,
    descripcion: string,
    tipo: ('refugio' | 'adopcion' | 'transito')
}

const historial: Ref<HistorialMascota[]> = ref([
    {   fecha_desde: moment('2025-12-01'),
        fecha_hasta: moment('2026-03-05'),
        descripcion: 'Juan Basañez',
        tipo: 'transito' },
    {   fecha_desde: moment('2026-03-06'),
        fecha_hasta: null,
        descripcion: 'PATITAS',
        tipo: 'refugio' }
])
</script>

<template>
    <Panel v-if="transito" class="w-[75%] m-auto border-white! border-0 overflow-auto " pt:header="p-0!">
        <template #header>
            <div class="w-full h-full">
                <div class="bg-surface-800 w-full h-full text-center text-4xl font-bold pl-3 py-4 text-white">
                    {{ transito.animal.nombre }}
                </div>
            </div>
        </template>
        <div class="p-2 grid gap-2 grid-cols-12 grid-rows-3">
            <Panel class="col-span-4 row-span-2">
                <h1 class="text-2xl pb-3  font-semibold underline text-center">Voluntario</h1>
                <DataBlock label="Nombre" data="Hermione Granger"></DataBlock>
                <DataBlock label="Domicilio" data="Peru 123, CABA,CABA,CABA"></DataBlock>
                <DataBlock label="Mail" data="hg@gmail.com"></DataBlock>
                <DataBlock label="Alta" data="21/09/1991"></DataBlock>
            </Panel>
            <Panel class="col-span-4 row-span-1 row-start-3">
                <h1 class="text-2xl pb-3  font-semibold underline text-center">Detalle del transito</h1>
                <div class="flex flex-row  gap-5 ">
                    <DataBlock label="Inicio" data="30/09/1991"></DataBlock>
                    <DataBlock label="Fin" data="N/A"></DataBlock>
                </div>
            </Panel>
            <Panel header="historial" class="col-span-12 row-span-4 col-start-5">
                <DataTable :value="historial">
                    <Column header="Desde" field="fecha_desde">
                        <template #body="{data, field}">
                            {{ data[field].format("DD/MM/YYYY")}}
                        </template>
                    </Column>
                    <Column header="Hasta" field="fecha_hasta">
                        <template #body="{data, field}">
                            {{ data[field] ? data[field].format("DD/MM/YYYY") :"-" }}
                        </template>
                    </Column>
                    <Column header="Tipo" field="tipo"></Column>
                    <Column header="Detalle" field="descripcion"></Column>
                </DataTable>
            </Panel>
            <!--        <div class="flex flex-col pt-3">-->
            <!--            <div class=" flex flex-row gap-3">-->
            <!--&lt;!&ndash;                <div class="max-w-72! m-auto">&ndash;&gt;-->
            <!--&lt;!&ndash;                    <Image pt:image=" rounded-lg "  :src="imagenTerrier"></Image>&ndash;&gt;-->
            <!--&lt;!&ndash;                </div>&ndash;&gt;-->
            <!--                <div class="border-surface-500 p-6 w-full border rounded-lg">-->
            <!--                    <div class="flex flex-col align-middhle">-->

            <!--                    </div>-->
            <!--                </div>-->
            <!--            </div>-->

            <!--        </div>-->
        </div>
    </Panel>
    <Panel v-if="transito" class="mt-3 w-[75%] m-auto border-white! border-0 overflow-auto" header="Reporte semanal">
        <!--        <template #header>-->
        <!--            <div class="m-auto text-3xl font-semibold text-center"></div>-->
        <!--        </template>-->
        <div class="m-auto w-full h-full">
            <DataTable :value="actualizaciones">

                <Column header="Fecha" field="fecha">
                    <template #body="{data}">
                        {{ data['fecha'].format('DD/MM/YYYY') }}
                    </template>
                </Column>
                <Column header="Detalle">
                    <template #body="{data}">
                        <div class="max-w-52! text-wrap">{{ data['descripcion'].substring(0, STRING_LENGTH + 1)
                            }}{{ data['descripcion'].length > STRING_LENGTH ? '...' : '' }}
                        </div>
                    </template>
                </Column>
                <Column header="Fotos">
                    <template #body="{data}">
                        <Button v-if="data['images'] && data['images'].length > 0" title="Ver fotos"
                                :icon="data['images'].length > 1 ? 'pi pi-images' : 'pi pi-image'"></Button>
                        <span v-else>Sin fotos</span>
                    </template>
                </Column>

            </DataTable>
        </div>

    </Panel>
    <Panel v-if="loading">
        <ProgressSpinner
            class="m-auto h-20! text-center"
            pt:circle="stroke-red-100 p-progressspinner-circle"
            pt:root="p-progressspinner w-full!"
            pt:spin="p-progressspinner-spin" />
    </Panel>
</template>

<style scoped>

</style>
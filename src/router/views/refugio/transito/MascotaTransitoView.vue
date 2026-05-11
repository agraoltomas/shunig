<script setup lang="ts">
import { onMounted, type Ref, ref, watch } from 'vue'
import type { Maybe, MessageResponse } from '@/lib/tipos/generics'
import type { HistorialAnimal, IMascota } from '@/lib/tipos/mascotas'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
import { useRoute, useRouter } from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner'
import moment from 'moment'
import DataTable from '@/volt/DataTable.vue'
import Column from 'primevue/column'
import type { User } from '@/lib/tipos/usuarios'
import DataBlock from '@/components/generales/DataBlock.vue'
import { useAxios } from '@/lib/axios.ts'
import domicilio from '@/lib/modelos/domicilio.ts'
import type { DetalleTransito } from '@/lib/tipos/transito'
import TransitoDetalle from '@/components/transito/TransitoDetalle.vue'
import SecondaryButton from '@/volt/SecondaryButton.vue'

const { loading, startLoading, stopLoading } = useLoadingComposable()
const {axios} = useAxios()
interface Reporte {
    imagenes: string[]
}

const historial: Ref<HistorialAnimal[]> = ref([]);
const transito: Ref<Maybe<DetalleTransito>> = ref(null)
const route = useRoute()
const router = useRouter()
const getTransito = async () => {
    startLoading()
    if (isNaN(Number(route.params.id))) return
    try {
        const r = await axios.value.get(`/transito/${route.params.id}/`, {})
        const response: MessageResponse<DetalleTransito> = r.data
        transito.value = response.data
        await getHistorial();
    } catch (error) {

    } finally {
        stopLoading()
    }
}

onMounted(async () => {
    getTransito()
})

const getHistorial = async () =>{
    if(!transito.value)return;
    startLoading()
    try {
        const r = await axios.value.get(`/animal/${transito.value.animal.id_animal}/historial/`)
        const response: MessageResponse<HistorialAnimal[]> = r.data
        historial.value = response.data
    } catch (error) {

    } finally {
        stopLoading()
    }
}
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
console.log(route);
</script>

<template>
    <Panel v-if="transito" class="w-[75%] m-auto border-white! border-0 overflow-auto " pt:header="p-0!">
        <template #header>
            <div class="w-full h-full" v-if="transito.animal">
                <div class="bg-surface-800 w-full h-full text-center text-4xl font-bold pl-3 py-4 text-white flex flex-row gap-3 justify-center">
                    {{ transito.animal.nombre }}
                    <SecondaryButton icon="pi pi-arrow-up-right" pt:icon="text-lg!" class="w-fit! h-fit! p-1!" @click="() => router.push(`/refugio/mascota/${transito.animal.id_animal}`)"></SecondaryButton>
                </div>
            </div>
        </template>
        <div class="p-2 grid gap-2 grid-cols-12 grid-rows-3">
            <Panel class="col-span-4 row-span-2" v-if="loading">
                <ProgressSpinner
                    class="m-auto h-20! text-center"
                    pt:circle="stroke-red-100 p-progressspinner-circle"
                    pt:root="p-progressspinner w-full!"
                    pt:spin="p-progressspinner-spin" />
            </Panel>
            <Panel class="col-span-4 row-span-2" v-else-if="transito?.usuario">
                <h1 class="text-2xl pb-3  font-semibold underline text-center">Voluntario</h1>
                <DataBlock label="Nombre" :data="`${transito?.usuario.nombre} ${transito?.usuario.apellido}`"></DataBlock>
                <DataBlock label="Domicilio" :data="domicilio.toText(transito?.usuario.domicilio)"></DataBlock>
                <DataBlock label="Mail" :data="transito?.usuario.email"></DataBlock>
                <DataBlock label="Alta" :data="moment(transito?.usuario.fecha_alta).format('DD/MM/YYYY')"></DataBlock>
            </Panel>
            <Panel class="col-span-4 row-span-1 row-start-3" v-if="loading">
                <ProgressSpinner
                    class="m-auto h-20! text-center"
                    pt:circle="stroke-red-100 p-progressspinner-circle"
                    pt:root="p-progressspinner w-full!"
                    pt:spin="p-progressspinner-spin" />
            </Panel>
            <TransitoDetalle v-else-if="transito?.transito" class="col-span-4 row-span-1 row-start-3" :detalle="transito?.transito"></TransitoDetalle>
            <Panel v-if="loading"  class="col-span-12 row-span-4 col-start-5">
                <ProgressSpinner
                    class="m-auto h-20! text-center"
                    pt:circle="stroke-red-100 p-progressspinner-circle"
                    pt:root="p-progressspinner w-full!"
                    pt:spin="p-progressspinner-spin" />
            </Panel>
            <Panel v-else header="historial" class="col-span-12 row-span-4 col-start-5">
                <DataTable :value="historial">
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
    <Panel class="mt-3 w-[75%] m-auto border-white! border-0 overflow-auto" v-if="loading"></Panel>
    <Panel v-else-if="transito" class="mt-3 w-[75%] m-auto border-white! border-0 overflow-auto" header="Reporte semanal">
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
</template>

<style scoped>

</style>
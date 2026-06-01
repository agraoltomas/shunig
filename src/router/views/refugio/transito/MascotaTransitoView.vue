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
import ReporteTabla from '@/components/transito/ReporteTabla.vue'

const { loading, startLoading, stopLoading } = useLoadingComposable()
const { axios } = useAxios()

interface Reporte {
    imagenes: string[]
}


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
    } catch (error) {

    } finally {
        stopLoading()
    }
}

onMounted(async () => {
    getTransito()
})
watch(() => route.params.id, () => {
    getTransito()
})
interface Reporte {
    images: number[],
    fecha: string,
    descripcion: string,
}
const reportes: Ref<Reporte[]> = ref([
    { images: [1],
        fecha: moment().add(1, 'days').format("DD/MM/YYYY"),
        descripcion: 'Hoy jugo mucho!' },
    { images: [1, 2, 4],
        fecha: moment().add(2, 'days').format("DD/MM/YYYY"),
        descripcion: 'comio algo que no debia y gomito' },
    { images: [1, 2, 4, 5, 4],
        fecha: moment().add(3, 'days').format("DD/MM/YYYY"),
        descripcion: 'sin noticias' },
    {
        fecha: moment().add(4, 'days').format("DD/MM/YYYY"),
        descripcion: 'se convirtio en un demonio lovecraftiano y me hizo temerle a la existencia misma'
    }
])
console.log(route)
</script>

<template>
    <Panel v-if="transito" class="w-[75%] m-auto border-white! border-0 overflow-auto " pt:header="p-0!">
        <template #header>
            <div class="w-full h-full" v-if="transito.animal">
                <div
                    class="bg-surface-800 w-full h-full text-center text-4xl font-bold pl-3 py-4 text-white flex flex-row gap-3 justify-center">
                    {{ transito.animal.nombre }}
                    <SecondaryButton icon="pi pi-arrow-up-right" pt:icon="text-lg!" class="w-fit! h-fit! p-1!"
                                     @click="() => router.push(`/refugio/mascota/${transito.animal.id_animal}`)"></SecondaryButton>
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
                <DataBlock label="Nombre"
                           :data="`${transito?.usuario.nombre} ${transito?.usuario.apellido}`"></DataBlock>
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
            <TransitoDetalle v-else-if="transito?.transito" class="col-span-4 row-span-1 row-start-3"
                             :detalle="transito?.transito"></TransitoDetalle>
            <Panel v-if="loading" class="col-span-12 row-span-4 col-start-5">
                <ProgressSpinner
                    class="m-auto h-20! text-center"
                    pt:circle="stroke-red-100 p-progressspinner-circle"
                    pt:root="p-progressspinner w-full!"
                    pt:spin="p-progressspinner-spin" />
            </Panel>
            <Panel v-else header="Reporte semanal" class="col-span-12 row-span-4 col-start-5">
                <ReporteTabla :reportes="reportes" :mascota="transito.animal"></ReporteTabla>
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
</template>

<style scoped>

</style>
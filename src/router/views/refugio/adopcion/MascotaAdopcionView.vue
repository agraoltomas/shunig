<script setup lang="ts">
import { onMounted, type Ref, ref, watch } from 'vue'
import type { Maybe, MessageResponse } from '@/lib/tipos/generics'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
import { useRoute, useRouter } from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner'
import moment from 'moment'
import DataBlock from '@/components/generales/DataBlock.vue'
import { useAxios } from '@/lib/axios.ts'
import domicilio from '@/lib/modelos/domicilio.ts'
import SecondaryButton from '@/volt/SecondaryButton.vue'
import ReporteTabla from '@/components/reporte/ReporteTabla.vue'
import type { DetalleAdopcion } from '@/lib/tipos/adopcion'
import AdopcionDetalle from '@/components/adopcion/AdopcionDetalle.vue'
import Contenedor from '@/components/generales/Contenedor.vue'
import ContenedorTitulo from '@/components/generales/ContenedorTitulo.vue'
import paw from '@/assets/images/paw-solid-full.svg'

const { loading, startLoading, stopLoading } = useLoadingComposable()
const { axios } = useAxios()

interface Reporte {
    imagenes: string[]
}


const adopcion: Ref<Maybe<DetalleAdopcion>> = ref(null)
const route = useRoute()
const router = useRouter()
const getAdopcion = async () => {
    startLoading()
    if (isNaN(Number(route.params.id))) return
    try {
        const r = await axios.value.get(`/adopcion/${route.params.id}/`, {})
        const response: MessageResponse<DetalleAdopcion> = r.data
        adopcion.value = response.data
    } catch (error) {

    } finally {
        stopLoading()
    }
}

onMounted(async () => {
    getAdopcion()
})
watch(() => route.params.id, () => {
    getAdopcion()
})
interface Reporte {
    images: number[],
    fecha: string,
    descripcion: string,
}
const reportes: Ref<Reporte[]> = ref([])
console.log(route)
</script>
<!--Vista de la gestión del animal adoptado-->
<template>
    <div v-if="adopcion" class="w-[75vw] m-auto mt-10 mb-15">
        <!--
        <div class="w-full h-full pb-3" v-if="adopcion.animal">
            <div
                class="bg-refugio-500 rounded-lg w-full h-full text-center text-4xl font-bold pl-3 py-4 text-white flex flex-row gap-3 justify-center">
                {{ adopcion.animal.nombre }}
                <SecondaryButton icon="pi pi-arrow-up-right" pt:icon="text-lg!" class="w-fit! h-fit! p-1!"
                                 @click="() => adopcion ? router.push(`/refugio/mascota/${adopcion.animal.id_animal}`) : null"></SecondaryButton>
            </div>
        </div>-->
        <Contenedor v-if="adopcion.animal" class="overflow-auto m-auto mb-5" pt:header="p-0!">
            <div class="flex flex-col gap-3">
                <!-- Sector de botones -->
                <div class="flex flex-row justify-between items-center gap-4 pb-4 mb-5 border-b border-gray-200">
                    <span class="font-bold text-2xl">Detalle de la adopción</span>
                    <div class="flex flex-row gap-3">
                        <Button
                                class="!bg-transparent !border-refugio-500 !text-refugio-500 hover:!bg-refugio-200"
                                outlined
                                severity="secondary"
                                icon="pi pi-undo"
                                label="Volver"
                                @click="$router.go(-1)"></Button>
                        <Button
                                outlined
                                severity="success"
                                icon="pi pi-arrow-up-right"
                                label="Ver animal"
                                @click="() => router.push(`/refugio/mascota/${adopcion.animal.id_animal}`)"></Button>
                    </div>
                </div>
                <!--fin sector de botones-->
                <div class="flex flex-row gap-5 grow">
                    <!-- resumen animal -->
                    <div class="rounded-full bg-primary-500 w-10 h-10 flex items-center justify-center">
                        <img class="size-5 text-4xl" :src="paw" aria-hidden="true"></img>
                    </div>
                    <div class="flex flex-col gap-4 grow">
                        <div class="flex flex-row gap-4 items-center">
                            <div class="font-bold text-3xl">
                                {{ adopcion.animal.nombre }}
                            </div>
                            <Tag severity="info" value="Adoptado" />
                        </div>
                    </div>
                </div>
            </div>
        </Contenedor>

        <div class="grid gap-3 grid-cols-12 grid-rows-4">
            <Contenedor class="col-span-4 row-span-2" v-if="loading">
                <ProgressSpinner
                    class="m-auto h-20! text-center"
                    pt:circle="stroke-red-100 p-progressspinner-circle"
                    pt:root="p-progressspinner w-full!"
                    pt:spin="p-progressspinner-spin" />
            </Contenedor>
            <ContenedorTitulo title="Datos del adoptante" icon="pi pi-user" class="col-span-4 row-span-2" v-else-if="adopcion?.usuario">
                <DataBlock label="Nombre"
                           :data="`${adopcion?.usuario.nombre} ${adopcion?.usuario.apellido}`"></DataBlock>
                <DataBlock label="Domicilio" :data="domicilio.toText(adopcion?.usuario.domicilio)"></DataBlock>
                <DataBlock label="Mail" :data="adopcion?.usuario.email"></DataBlock>
                <DataBlock label="Alta" :data="moment(adopcion?.usuario.fecha_alta).format('DD/MM/YYYY')"></DataBlock>
            </ContenedorTitulo>
            <Contenedor class="col-span-4 row-span-1 row-start-3" v-if="loading">
                <ProgressSpinner
                    class="m-auto h-20! text-center"
                    pt:circle="stroke-red-100 p-progressspinner-circle"
                    pt:root="p-progressspinner w-full!"
                    pt:spin="p-progressspinner-spin" />
            </Contenedor>
            <AdopcionDetalle v-else-if="adopcion?.adopcion" class="col-span-4 row-span-1 row-start-3"
                             :detalle="adopcion?.adopcion"></AdopcionDetalle>
            <Contenedor v-if="loading" class="col-span-12 row-span-4 col-start-5">
                <ProgressSpinner
                    class="m-auto h-20! text-center"
                    pt:circle="stroke-red-100 p-progressspinner-circle"
                    pt:root="p-progressspinner w-full!"
                    pt:spin="p-progressspinner-spin" />
            </Contenedor>
            <Contenedor v-else header="Reporte semanal" class="col-span-8 row-span-3 col-start-5">
                <ReporteTabla modulo="adopcion" class="" :reportes="adopcion.reportes" :mascota="adopcion.animal"></ReporteTabla>
            </Contenedor>
            <div class="col-span-12 row-span-1 row-start-4"></div>
        </div>
    </div>
</template>

<style scoped>

</style>
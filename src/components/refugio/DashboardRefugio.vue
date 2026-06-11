<script setup lang="ts">

import Contenedor from '@/components/generales/Contenedor.vue'
import ContenedorTitulo from '@/components/generales/ContenedorTitulo.vue'
import { computed, onMounted, type Ref, ref } from 'vue'
import { useAxios } from '@/lib/axios.ts'
import Chart from 'primevue/chart';
import { useResponse } from '@/lib/utils/response.ts'
import { useRefugioStore } from '@/stores/refugio.ts'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
import type { Maybe } from '@/lib/tipos/generics'
import paw from "@/assets/images/paw-solid-full-purple.svg"
import handshake from "@/assets/images/handshake-regular-full-purple.svg"
import KPI from '@/components/refugio/Dashboard/KPI.vue'
import { useRouter } from 'vue-router'
import type { EAlerta } from '@/components/generales/alertas.ts'
import AlertasResumen, { type IAlerta } from '@/components/refugio/Dashboard/AlertasResumen.vue'

const {axios} = useAxios()
const {unwrap} = useResponse()
const {refugio} = useRefugioStore()
const {loading, stopLoading, startLoading} = useLoadingComposable()

const router = useRouter()
interface Dashboard {
    kpis:{
        animales_activos: number,
        ocupacion: number,
        transitos_activos: number,
        adopciones_del_mes: number,
        solicitudes_pendientes: number,
        eventos_proximos: number,
        patrocinadores: number,
        solicitudes: number,
    },
    graficos:{
        movimientos: { mes: string, count: number }[],
        solicitudes_x_estado: { estado: string, count: number }[],
        stock_critico: {
    "nombre": string,
    "stock_actual": string,
        }[],
        animales_por_especie: {especie: string, count: number}[],
        adopciones_por_mes: { mes: string, count: number }[],
    },
    alertas: IAlerta[]
}
const dashboard: Ref<Maybe<Dashboard>> = ref(null)
onMounted(async () => {
    if(!refugio) return
    startLoading()
    try{
        const r = await unwrap(axios.value.get(`dashboard/${refugio?.id_refugio}/`))
        dashboard.value = r.data
    }catch(e){

    }finally {
        stopLoading()
    }
})
const animalesPorEspecie = computed(() => ({
    labels:
        dashboard.value?.graficos.animales_por_especie.map(
            e => `${e.especie} (${e.count})`
        ) || [],
    datasets: [
        {
            data:
                dashboard.value?.graficos.animales_por_especie.map(
                    (e: any) => e.count
                ) || [],

        }
    ]
}))
const ingresosVsEgresos = computed(() => ({
    labels: dashboard.value?.graficos.movimientos.map(
        (m: any) => m.mes
    ) || [],
    datasets: [
        {
            label: 'Ingresos',
            data: dashboard.value?.graficos.movimientos.map(
                (m: any) => m.ingresos
            ) || []
        },
        {
            label: 'Egresos',
            data: dashboard.value?.graficos.movimientos.map(
                (m: any) => m.egresos
            ) || []
        }
    ]
}));
const adopcionesPorMes = computed(() => ({
    labels:
        dashboard.value?.graficos.adopciones_por_mes.map(
            (a: any) => a.mes
        ) || [],
    datasets: [
        {
            label: 'Adopciones',
            data:
                dashboard.value?.graficos.adopciones_por_mes.map(
                    (a: any) => a.count
                ) || []
        }
    ]
}))
const solicitudesPorEstado =computed(() => ({
    labels:
        dashboard.value?.graficos.solicitudes_x_estado.map(
            e => `${e.estado} (${e.count})`
        ) || [],
    datasets: [
        {
            data:
                dashboard.value?.graficos.solicitudes_x_estado.map(
                    (e: any) => e.count
                ) || [],

        }
    ]
}))


</script>

<template>
    <div v-if="loading">
        <ProgressSpinner></ProgressSpinner>
    </div>
    <div v-else-if="dashboard" class=" flex flex-col gap-3">
        <div class="flex flex-row gap-3 w-[90vw] m-auto">
            <Contenedor class="grow">
                <KPI title="Animales actuales" subtitle="en el refugio" :value="dashboard.kpis.animales_activos" icon="pi pi-home">
                </KPI>
            </Contenedor>
            <Contenedor class="grow">
                <KPI title="Adopciones" subtitle="este mes" :value="dashboard.kpis.adopciones_del_mes" icon="pi pi-heart-fill"></KPI>
            </Contenedor>
            <Contenedor class="grow">
                <KPI title="Tránsitos activos" subtitle="actualmente" :value="dashboard.kpis.transitos_activos" icon="pi pi-car">
                </KPI>
            </Contenedor>
            <Contenedor class="grow">
                <KPI title="Donantes activos" subtitle="este mes" :value="dashboard.kpis.patrocinadores" icon="pi pi-gift"></KPI>
            </Contenedor>
            <Contenedor class="grow">
                <KPI title="Solicitudes pendientes" subtitle="en revisión" :value="dashboard.kpis.solicitudes_pendientes" icon="pi pi-file"></KPI>
            </Contenedor>
            <Contenedor class="grow">
                <KPI title="Eventos próximos" subtitle="en los próximos 7 días" :value="dashboard.kpis.eventos_proximos" icon="pi pi-calendar"></KPI>
            </Contenedor>
        </div>
        <div class="flex flex-row flex-wrap gap-3 justify-between w-[90vw] m-auto">
            <ContenedorTitulo class="w-[40%]" title="Ingresos vs Egresos de animales">
                <div class="text-sm text-gray-500">Año actual</div>
                <Chart class="m-auto" type="line" :data="ingresosVsEgresos" />
            </ContenedorTitulo>
            <ContenedorTitulo class="" title="Animales por especie">
                <div class="text-sm text-gray-500">Distribución actual</div>
                <Chart class="w-full" type="doughnut" :data="animalesPorEspecie" />
            </ContenedorTitulo>
            <ContenedorTitulo class="" title="Alertas importantes">
                <div class=" flex flex-col gap-1 h-full">
                    <AlertasResumen :alertas="dashboard.alertas"></AlertasResumen>
                </div>
                <a @click="router.push('/refugio/alertas')" class="font-semibold text-refugio-500 text-sm flex flex-row items-center select-none cursor-pointer">
                    <div class="h-fit my-auto">Ver todas las alertas</div>
                    <i class="my-auto pi pi-arrow-right text-sm px-2"></i>
                </a>
            </ContenedorTitulo>
            <ContenedorTitulo class="w-[40%]" title="Adopciones por mes">
                <div class="text-sm text-gray-500">Últimos 3 meses</div>
                <Chart class="m-auto" type="bar" :data="adopcionesPorMes"></Chart>
            </ContenedorTitulo>
            <ContenedorTitulo class="" title="Solicitudes por estado">
                <div class="text-sm text-gray-500">Distribución actual</div>
                <Chart class="w-full" type="doughnut" :data="solicitudesPorEstado" />
            </ContenedorTitulo>
            <ContenedorTitulo class="" title="Productos con stock crítico">
                <div class="text-sm text-gray-500">Requieren reposición</div>
                <div class=" flex flex-col gap-1 h-full">
                    <div v-for="stock in dashboard.graficos.stock_critico" class="flex flex-row justify-between border-b-gray-200 border-b pb-3">
                        <div class="font-semibold">{{ stock.nombre}}</div>
                        <div class="text-red-500">{{ stock.stock_actual}}</div>
                    </div>
                </div>
                <div class=" flex flex-row justify-start p-1">
                    <a @click="router.push('/refugio/inventario')" class="font-semibold text-refugio-500 text-sm flex flex-row items-center select-none cursor-pointer"> <div class="h-fit my-auto">Ver inventario completo</div> <i class="my-auto pi pi-arrow-right text-sm px-2"></i></a>
                </div>
            </ContenedorTitulo>
        </div>
    </div>
</template>

<style scoped>

</style>
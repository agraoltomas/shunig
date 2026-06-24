<script setup lang="ts">

import { EAlerta } from '@/components/generales/alertas.ts'
import VisualizarSolicitud from '@/components/solicitud/VisualizarSolicitud.vue'
import type { IDetalleSolicitud } from '@/components/solicitud/SolicitudForm.vue'
import type { IAlerta } from '@/components/refugio/Dashboard/AlertasResumen.vue'
import { useRouter } from 'vue-router'



type Contexto = {
    solicitud?: IDetalleSolicitud
}
const router = useRouter()
const iconoAlerta = (a: EAlerta) => {
    switch (a) {
        case EAlerta.AnimalSinReporte:
            return 'pi pi-pen-to-square'
        case EAlerta.AnimalCritico:
            return 'pi pi-exclamation-triangle'
        case EAlerta.AnimalEnTratamiento:
            return 'pi pi-clipboard'
        case EAlerta.VacunaVencida:
            return 'pi pi-clock'
        case EAlerta.SolicitudPendiente:
            return 'pi pi-file'
        case EAlerta.StockBajo:
            return 'pi pi-box'
        case EAlerta.StockModerado:
            return 'pi pi-box'
        case EAlerta.StockAlto:
            return 'pi pi-box'
        case EAlerta.ProductoAVencer:
            return 'pi pi-box'
    }
}
const routeAlerta = (a: IAlerta) => {
    switch (EAlerta[a.tipo_alerta]) {
        case EAlerta.AnimalSinReporte:
            return `/refugio/mascota/${a.id_referencia}/`
        case EAlerta.AnimalCritico:
            return `/refugio/mascota/${a.id_referencia}/`
        case EAlerta.AnimalEnTratamiento:
            return `/refugio/mascota/${a.id_referencia}/`
        case EAlerta.VacunaVencida:
            return `/refugio/mascota/${a.id_referencia}/`
        case EAlerta.SolicitudPendiente:
            return `/refugio/solicitud/${a.id_referencia}/`
        case EAlerta.StockBajo:
            return `/refugio/inventario/producto/${a.id_referencia}/`
        case EAlerta.StockModerado:
            return `/refugio/inventario/producto/${a.id_referencia}/`
        case EAlerta.StockAlto:
            return `/refugio/inventario/producto/${a.id_referencia}/`
        case EAlerta.ProductoAVencer:
            return `/refugio/inventario/producto/${a.id_referencia}/`
    }
}

const mensajeSeverity = (a: IAlerta) => {
    switch (a.prioridad) {
        case 1:
            return 'border-blue-400  bg-blue-200/20 '
        case 2:
            return 'border-orange-400  bg-orange-200/20 '
        case 3:
            return 'border-red-400  bg-red-200/20 '
    }
}
const textSeverity = (a: IAlerta) => {
    switch (a.prioridad) {
        case 1:
            return 'text-blue-700'
        case 2:
            return 'text-orange-700'
        case 3:
            return 'text-red-700'
    }
}
const props = withDefaults(defineProps<{ alerta: IAlerta }>(), {})
</script>

<template>
    <div :class="['border rounded-lg p-3',mensajeSeverity(alerta)]">
        <div class="flex flex-row justify-between">
            <div class="flex flex-col gap-3">
                <div :class="['font-semibold flex flex-row gap-3', textSeverity(alerta)]">
                    <i :class="iconoAlerta(EAlerta[alerta.tipo_alerta])"></i>
                    <div>{{ alerta.titulo }}</div>
                </div>
                <div>{{ alerta.descripcion }}</div>
            </div>
            <div class="h-fit my-auto">
                <Button icon="pi pi-arrow-right" class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500" @click="() => router.push(routeAlerta(alerta))"></Button>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
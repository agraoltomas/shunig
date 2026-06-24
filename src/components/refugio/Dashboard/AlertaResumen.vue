<script setup lang="ts">
import { EAlerta } from '@/components/generales/alertas.ts'

interface AlertaInfo {
    tipo_alerta: keyof typeof EAlerta,
    titulo: string,
    prioridad: (1|2|3),
    descripcion: string,
}
interface IAlerta extends AlertaInfo {
    fecha: string,
    id_referencia: string
}
interface AlertaGroup {
    type: keyof typeof EAlerta,
    count: number
}
const props = defineProps<{ alerta: AlertaInfo}>()
const mensajeSeverity = (a: AlertaInfo)  => {
    console.log('mensajeSeverity', a.prioridad)
    switch (a.prioridad){
        case 1:
            return 'border-blue-400 bg-blue-200/20'
        case 2:
            return 'border-orange-400 bg-orange-200/20 '
        case 3:
            return 'border-red-400 bg-red-200/20'
    }
}
const icon = (a: AlertaInfo) => {
    switch (a.tipo_alerta){
        case 'AnimalCritico':
            return 'pi pi-exclamation-triangle'
        case 'AnimalEnTratamiento':
            return 'pi pi-plus'
        case 'AnimalSinReporte':
            return 'pi pi-pen-to-square'
        case 'SolicitudPendiente':
            return 'pi pi-clock'
        case 'VacunaVencida':
            return 'pi pi-pencil'
        case 'StockBajo':
            return 'pi pi-box'
    }
}
</script>

<template>
    <div :class="['flex flex-row rounded-lg p-3 border', mensajeSeverity(alerta)]" >
        <div class="w-10 ">
            <i :class="['p-1', icon(alerta)]" aria-hidden="true"></i>
        </div>
        <div class="flex flex-col">
            <div :class="['text-sm font-semibold']">{{ alerta.titulo}}</div>
            <div class="text-wrap w-40 text-sm">{{ alerta.descripcion}}</div>
        </div>
    </div>
</template>

<style scoped>

</style>
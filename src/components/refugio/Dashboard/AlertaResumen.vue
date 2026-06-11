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
const bgColor = (a: AlertaInfo)  => {
    console.log('bgColor', a.prioridad)
    switch (a.prioridad){
        case 1:
            return 'bg-green-300/20'
        case 2:
            return 'bg-orange-300/20'
        case 3:
            return 'bg-red-300/20'
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
    }
}
</script>

<template>
    <div :class="['flex flex-row rounded-lg p-3', bgColor(alerta)]" >
        <div class="w-10 ">
            <i :class="['p-1', icon(alerta)]"></i>
        </div>
        <div class="flex flex-col">
            <div :class="['text-sm font-semibold']">{{ alerta.titulo}}</div>
            <div class="text-wrap w-40 text-sm">{{ alerta.descripcion}}</div>
        </div>
    </div>
</template>

<style scoped>

</style>
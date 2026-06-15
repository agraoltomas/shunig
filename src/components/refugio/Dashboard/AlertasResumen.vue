<script setup lang="ts">
import { EAlerta } from '@/components/generales/alertas.ts'
import { computed } from 'vue'
import AlertaResumen from '@/components/refugio/Dashboard/AlertaResumen.vue'
interface AlertaInfo {
    tipo_alerta: keyof typeof EAlerta,
    titulo: string,
    prioridad: (1|2|3),
    descripcion: string,
}
export interface IAlerta extends AlertaInfo {
    fecha: string,
    id_referencia: string
}
export interface AlertaGroup {
    type: keyof typeof EAlerta,
    count: number
}
const props = defineProps<{alertas: IAlerta[]}>()
const toAlertaInfo = (a: AlertaGroup): AlertaInfo => {
    switch (a.type) {
        case 'AnimalCritico':
            return {prioridad: 3, tipo_alerta: a.type, titulo: `${a.count} animal${a.count == 1 ? '' : 'es'} en estado critico`, descripcion: ''}
        case 'AnimalEnTratamiento':
            return {prioridad: 2, tipo_alerta: a.type, titulo: `${a.count} animal${a.count == 1 ? '' : 'es'} en tratamiento`, descripcion: ''}
        case 'AnimalSinReporte':
            return {prioridad: 3, tipo_alerta: a.type, titulo: `${a.count} animal${a.count == 1 ? '' : 'es'} sin reporte`, descripcion: ''}
        case 'SolicitudPendiente':
            return {prioridad: 3, tipo_alerta: a.type, titulo: `${a.count} solicitud${a.count == 1 ? '' : 'es'} pendiente${a.count == 1 ? '' : 's'} `, descripcion: ''}
        case 'VacunaVencida':
            return {prioridad: 2, tipo_alerta: a.type, titulo: `${a.count} animal${a.count == 1 ? '' : 'es'} con vacuna vencida`, descripcion: ''}
        case 'StockBajo':
            return {prioridad: 3, tipo_alerta: a.type, titulo: `${a.count} producto${a.count == 1 ? '' : 's'} con stock bajo`, descripcion: '' }
        default:
            return { descripcion: '', prioridad: 1, tipo_alerta: "AnimalSinReporte", titulo: '' }
    }
}

const group = computed(() => {
    // @ts-ignore
  const groups: keyof typeof EAlerta = Object.keys(EAlerta)
    let alertas: {-readonly [k in keyof typeof EAlerta]?: number} = {};
  for(let alerta of props.alertas){
      if(alerta.tipo_alerta in alertas){
          alertas[alerta.tipo_alerta] = alertas[alerta.tipo_alerta]+1
      }else{
          alertas[alerta.tipo_alerta] = 1
      }
  }
  const r = []
    for(let alerta in alertas){
        r.push({
            type: <keyof typeof EAlerta>alerta, count: <number>alertas[alerta],
        })
    }
    return r
})

const alertasResumenOrdenadas = computed(() => {
    return group.value
        .map((alerta) => toAlertaInfo(alerta))
        .sort((a, b) => {
            return Number(b.prioridad) - Number(a.prioridad)
        })
})
</script>

<template>
    <div class="flex flex-col gap-3">
        <AlertaResumen
            v-for="alerta in alertasResumenOrdenadas"
            :key="alerta.tipo_alerta"
            :alerta="alerta"
        />
    </div>
</template>

<style scoped>

</style>
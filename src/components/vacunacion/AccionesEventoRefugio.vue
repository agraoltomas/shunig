<script setup lang="ts">
import type { IEventoVacunacion } from '@/lib/tipos/vacunacion.ts'
import moment from 'moment'
import { useModalStore } from '@/stores/modales.ts'

const props = defineProps<{ evento: IEventoVacunacion&{cupos:number}}>()
const dayDiff = (f: string) => {
    console.log(moment(f), moment(), moment(f).diff(moment(), 'days'))
    return moment(f).diff(moment(), 'days')
}
const messageEventTiming = (e: IEventoVacunacion) => {
    const diff = dayDiff(e.fecha_evento)
    console.log(diff)
    if (diff > 0) {
        return `Evento dentro de ${diff} dia${diff == 1 ? '' : 's'}`
    } else if (diff < 0) {
        return `Completado el ${moment(e.fecha_evento).format('DD/MM/YYYY')}`
    }
}
const modales = useModalStore()

</script>

<template>
    <div class="h-full flex flex-col border-l-gray-200 border-l px-3 justify-around">
        <div class=" flex flex-row gap-3">
            <Tag v-if="dayDiff(evento.fecha_evento) == 0" value="Hoy" severity="danger"></Tag>
            <Tag v-else-if="dayDiff(evento.fecha_evento) > 0" value="Próximo" severity="warn"></Tag>
            <Tag v-else value="Finalizado" severity="success"></Tag>
            <Tag v-if="evento.cupos == 0" value="Cupo completo" severity="success"></Tag>
        </div>
        <div class="text-gray-600">{{messageEventTiming(evento) }}</div>
        <div class="flex flex-rew gap-3 justify-between">
            <Button icon="pi pi-eye" label="Ver detalles" outlined></Button>
            <Button v-if="!(dayDiff(evento.fecha_evento) < 0)" icon="pi pi-pencil" label="Editar" outlined @click="() => modales.abrir('editar_evento_vacunacion',evento)"></Button>
        </div>
    </div>
</template>

<style scoped>

</style>
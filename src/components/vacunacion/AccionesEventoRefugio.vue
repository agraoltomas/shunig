<script setup lang="ts">
import type { IEventoVacunacion } from '@/lib/tipos/vacunacion.ts'
import moment from 'moment'
import { useModalStore } from '@/stores/modales.ts'
import { useRouter } from 'vue-router'
import { dayDiff } from '@/lib/utils/eventos.ts'

const props = defineProps<{ evento: IEventoVacunacion&{cupos:number}}>()
const router = useRouter()

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
    <div class="h-full flex flex-col gap-3 md:border-l md:border-l-gray-200 border-t 
    md:border-t-0 border-t-gray-200 px-0 md:px-3 pt-3 md:pt-0 justify-around">
        <div class="flex flex-row flex-wrap gap-2">
            <Tag v-if="dayDiff(evento.fecha_evento) == 0" value="Hoy" severity="danger"></Tag>
            <Tag v-else-if="dayDiff(evento.fecha_evento) > 0" value="Próximo" severity="warn"></Tag>
            <Tag v-else value="Finalizado" severity="success"></Tag>
            <Tag v-if="evento.cupos == 0" value="Cupo completo" severity="success"></Tag>
        </div>
        <div class="text-gray-600">{{messageEventTiming(evento) }}</div>
        <div class="flex flex-col sm:flex-row md:flex-col xl:flex-row gap-3">
            <Button icon="pi pi-eye" label="Ver detalles" class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500" @click="() => router.push(`/refugio/vacunacion/${evento.id_evento_vacunacion}/`)"></Button>
            <Button v-if="!(dayDiff(evento.fecha_evento) < 0)" icon="pi pi-pencil" label="Editar" class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500" @click="() => modales.abrir('editar_evento_vacunacion',evento)"></Button>
        </div>
    </div>
</template>

<style scoped>
</style>
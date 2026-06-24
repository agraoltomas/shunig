<script setup lang="ts">
import type { IEventoVacunacion } from '@/lib/tipos/vacunacion.ts'
import { computed, onMounted } from 'vue'
import moment from 'moment'
import domicilio from '@/lib/modelos/domicilio.ts'
import EventoCardDetalle from '@/components/eventos/voluntarios/EventoCardDetalle.vue'

moment.locale('es')
const props = defineProps<{ evento: IEventoVacunacion }>()
onMounted(() => {
    console.log(props.evento)
})
const date = computed(() => {
    // TODO: ARREGLAR UTC
    return moment(props.evento.fecha_evento)
})

const cupos = computed(() => {
    const inscriptos = parseInt(props.evento.inscriptos)
    if (isNaN(inscriptos)) return props.evento.cupo_maximo
    return props.evento.cupo_maximo - inscriptos
})
</script>

<template>
    <div class="flex flex-col md:flex-row border rounded-xl p-3 gap-3 border-primary-200/40 border-1.5">
        <div class="flex md:flex-col flex-row gap-3 md:gap-1 px-3 bg-primary-200/20 rounded-lg items-center justify-center md:justify-between py-4 md:min-w-28">
            <i class="pi pi-calendar text-primary-600 text-2xl" aria-hidden="true"></i>
            <div class="flex md:flex-col flex-row items-center gap-2 md:gap-1">
                <span class="text-3xl font-bold">{{ date.format('DD') }}</span>
                <span class="text-3xl font-bold text-primary-400">{{ date.format('MMM') }}</span>
                
            </div>
            <span class="text-sm md:pt-2 text-gray-500">{{ evento.rango_horario}}</span>            
        </div>
        <EventoCardDetalle :evento="evento"></EventoCardDetalle>
        <div class="flex items-center justify-start md:justify-end">
            <slot name="end" v-bind="{...evento, cupos}"></slot>
        </div>
    </div>
</template>

<style scoped>

</style>
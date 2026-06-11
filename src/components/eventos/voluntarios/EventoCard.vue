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
    return moment(props.evento.fecha_evento)
})

const cupos = computed(() => {
    const inscriptos = parseInt(props.evento.inscriptos)
    if (isNaN(inscriptos)) return props.evento.cupo_maximo
    return props.evento.cupo_maximo - inscriptos
})
</script>

<template>
    <div class="flex flex-row border rounded-xl p-3 gap-3 border-primary-200/40 border-1.5">
        <div class="flex flex-col gap-1 px-3 bg-primary-200/20 rounded-lg items-center justify-between py-4">
            <i class="pi pi-calendar text-primary-600 text-2xl"></i>
            <span class="text-3xl text-bold">{{ date.format('DD') }}</span>
            <span class="text-3xl text-bold text-primary-400">{{ date.format('MMM') }}</span>
            <span class="text-sm pt-2 text-gray-500">{{ evento.rango_horario}}</span>
        </div>
        <EventoCardDetalle :evento="evento"></EventoCardDetalle>
        <div>
            <slot name="end" v-bind="{...evento, cupos}"></slot>
        </div>
    </div>
</template>

<style scoped>

</style>
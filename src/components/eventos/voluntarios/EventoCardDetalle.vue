<script setup lang="ts">
import type { IEventoVacunacion } from '@/lib/tipos/vacunacion.ts'
import domicilio from '@/lib/modelos/domicilio.ts'
import { computed } from 'vue'

const props = defineProps<{evento: IEventoVacunacion}>()
const cupos = computed(() => {
    const inscriptos = parseInt(props.evento.inscriptos)
    if (isNaN(inscriptos)) return props.evento.cupo_maximo
    return props.evento.cupo_maximo - inscriptos
})
</script>

<template>
    <div class="p-3 flex flex-col gap-1 grow">
        <div class="text-xl font-semibold">{{ evento.vacuna }}</div>
        <div class="flex flex-row gap-3">
            <i class="pi pi-map-marker text-zinc-500 p-1"></i>
            <div class="text-zinc-500">{{ evento.refugio_nombre }}</div>
        </div>
        <div class="text-zinc-500">- {{ domicilio.toText(evento.refugio_domicilio) }}</div>
        <div class="text-zinc-600 flex flex-row gap-3 mt-3">
            <i class="pi pi-users p-1"></i>
            Cupo máximo: {{ evento.cupo_maximo }} animales
            <div v-if="cupos > 0" class="text-amber-600 text-semibold px-2">Quedan {{ evento.cupo_maximo - parseInt(evento.inscriptos)}}</div>
        </div>
    </div>
</template>

<style scoped>

</style>
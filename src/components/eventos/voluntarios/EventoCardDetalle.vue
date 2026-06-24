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
    <div class="p-3 flex flex-col gap-2 grow min-w-0">
        <div class="text-xl font-semibold break-words">{{ evento.vacuna }}</div>
        <div class="flex flex-row gap-3 items-start">
            <i class="pi pi-map-marker text-zinc-500 p-1" aria-hidden="true"></i>
            <div class="text-zinc-500 break-words">{{ evento.refugio_nombre }}</div>
        </div>
        <div class="text-zinc-500 break-words">- {{ domicilio.toText(evento.refugio_domicilio) }}</div>
        <div class="text-zinc-600 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-3">
            <div class="flex flex-row gap-3 items-center">
                <i class="pi pi-users p-1" aria-hidden="true"></i>
                <span>Cupo máximo: {{ evento.cupo_maximo }} animales</span>
            </div>          
            
            <div v-if="cupos > 0" class="text-amber-600 font-semibold sm:px-2">Quedan {{ evento.cupo_maximo - parseInt(evento.inscriptos)}}</div>
        </div>
    </div>
</template>

<style scoped>

</style>
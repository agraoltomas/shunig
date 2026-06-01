<script setup lang="ts">
import type { IEventoVacunacion } from '@/lib/tipos/vacunacion.ts'
import { computed, onMounted } from 'vue'
import moment from 'moment'
import domicilio from '@/lib/modelos/domicilio.ts'

moment.locale('es')
const props = defineProps<{ evento: IEventoVacunacion }>()
onMounted(() => {
    console.log(props.evento)
})
const date = computed(() => {
    return moment(props.evento.fecha_evento)
})
</script>

<template>
    <div class="flex flex-row border rounded-xl p-3 gap-3 w-fit border-primary-200/40 border-1.5">
        <div class="flex flex-col gap-1 px-3 bg-primary-200/20 rounded-lg text-center justify-between py-4">
            <i class="pi pi-calendar text-primary-600 text-2xl"></i>
            <span class="text-3xl text-bold">{{ date.format('DD') }}</span>
            <span class="text-3xl text-bold text-primary-400">{{ date.format('MMM') }}</span>
        </div>
        <div class="p-3 flex flex-col gap-1">
            <div class="text-xl font-semibold">{{ evento.vacuna }}</div>
            <div class="flex flex-row gap-3">
                <i class="pi pi-map-marker text-zinc-500 p-1"></i>
                <div class="text-zinc-500">{{ evento.refugio_nombre }}</div>
            </div>
            <div class="text-zinc-500">- {{ domicilio.toText(evento.refugio_domicilio) }}</div>
            <div class="text-zinc-500 flex flex-row gap-3 mt-3">
                <i class="pi pi-users p-1"></i>
                Cupo máximo: {{ evento.cupo_maximo }} animales
                <div class="text-amber-600 text-semibold px-2">Quedan 5</div>
            </div>
        </div>
            <div>
                <slot name="end" v-bind="evento"></slot>
            </div>
    </div>
</template>

<style scoped>

</style>
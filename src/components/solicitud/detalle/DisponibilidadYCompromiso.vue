<script setup lang="ts">

import pawGreen from '@/assets/images/paw-solid-full-green.svg'
import type { ISolicitudCompleta } from '@/lib/tipos/solicitud.ts'
const props = defineProps<{ solicitud: ISolicitudCompleta }>()

</script>

<template>
    <div class="grow shadow-[0_0_10px_rgba(0,0,0,0.25)] rounded-2xl p-3">
        <div class="flex flex-row text-xl gap-3">
            <div class="bg-primary-200/30 rounded-full p-1 min-w-9 my-auto h-fit text-center">
                <i class="pi pi-clock text-primary-500 text-center"></i>
            </div>
            <div class="font-semibold h-fit my-auto">Disponibilidad y compromiso</div>
        </div>
        <div class="border-b-slate-400 grid grid-cols-12 grid-row-4 px-3">
            <i class="pi pi-check-circle  py-3  border-b-slate-200 border-b w-fit col-span-1"></i>
            <div class="col-span-9 border-b-slate-200 border-b py-2 h-fit my-auto">¿Cuántas horas estará solo?</div>
            <div class="border-b-slate-200 border-b py-2 h-fit my-auto col-span-2 pl-3  pr-3 flex justify-start font-semibold">
                <div>{{ solicitud.detalle.horas_solo}}</div>
            </div>
            <!--            2-->
            <i v-if="solicitud.detalle.tiempo_disponible_dias" class="pi pi-check-circle  py-3  border-b-slate-200 border-b w-fit col-span-1"></i>
            <div v-if="solicitud.detalle.tiempo_disponible_dias" class="col-span-9 border-b-slate-200 border-b py-2 h-fit my-auto">Dias disponibles para transito</div>
            <div v-if="solicitud.detalle.tiempo_disponible_dias" class="border-b-slate-200 border-b py-2 h-fit my-auto col-span-2 pl-3 text-end pr-3 flex justify-start font-semibold">
                {{ solicitud.detalle.tiempo_disponible_dias}}
            </div>
            <!--            3-->
            <i class="pi pi-check-circle  py-3  border-b-slate-200 border-b w-fit col-span-1"></i>
            <div class="col-span-9 border-b-slate-200 border-b py-2 h-fit my-auto">Compromiso</div>
            <div class="border-b-slate-200 border-b py-2 h-fit my-auto col-span-2 pl-3 text-end pr-3 font-semibold  flex justify-start"><span>{{ solicitud.compromiso ? 'Sí' :'No' }}</span></div>

        </div>
    </div>
</template>

<style scoped>

</style>
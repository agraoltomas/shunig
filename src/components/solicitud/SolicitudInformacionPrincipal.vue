<script setup lang="ts">

import type { ISolicitudCompleta } from '@/lib/tipos/solicitud.ts'
import moment from 'moment'
import TipoSolicitud from '@/components/solicitud/TipoSolicitud.vue'
const props = defineProps<{ solicitud: ISolicitudCompleta }>()

</script>

<template>
    <div class="grow shadow-[0_0_10px_rgba(0,0,0,0.25)] rounded-2xl p-3 flex flex-col">
        <div class="flex flex-row text-xl gap-3 pb-3">
            <div class="bg-primary-200/30 rounded-full p-1 min-w-9 text-center">
                <i class="pi pi-info-circle text-primary-500 text-center"></i>
            </div>
            <div class="font-semibold h-fit my-auto">Información principal</div>
        </div>
        <div class="border-b-slate-400 grid grid-cols-12 grid-row-3 px-3">
            <i class="pi pi-clipboard py-3 border-b-slate-200 border-b w-fit col-span-1"></i>
            <div class="col-span-7 border-b-slate-200 border-b py-2 h-fit my-auto">Tipo de solicitud</div>
            <div class="border-b-slate-200 border-b py-2 h-fit my-auto col-span-4 text-sm  pr-3 flex justify-start">
                <TipoSolicitud :solicitud="solicitud" />
            </div>
            <i class="pi pi-calendar py-3 border-b-slate-200 border-b w-fit col-span-1"></i>
            <div class="col-span-7 border-b-slate-200 border-b py-2 h-fit my-auto">Fecha de solicitud</div>
            <div class="border-b-slate-200 border-b py-2 h-fit my-auto col-span-4 text-end pr-3 flex justify-start">
                <span>{{ moment(solicitud.fecha_creacion).format('DD/MM/YYYY') }}</span>
            </div>
            <i class="pi pi-user  py-3  border-b-slate-200 border-b w-fit col-span-1"></i>
            <div class="col-span-7 border-b-slate-200 border-b py-2 h-fit my-auto">Responsable principal</div>
            <div class="border-b-slate-200 border-b py-2 h-fit my-auto col-span-4 text-end pr-3 font-semibold  flex justify-start"><span>{{ solicitud.responsable_principal }}</span></div>
        </div>
    </div>
</template>

<style scoped>

</style>
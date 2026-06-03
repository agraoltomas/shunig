<script setup lang="ts">
import type { ISolicitudCompleta } from '@/lib/tipos/solicitud.ts'

const props = defineProps<{ solicitud: ISolicitudCompleta }>()
</script>

<template>
    <div class="grow shadow-[0_0_10px_rgba(0,0,0,0.25)] rounded-2xl p-3 text-sm">
        <div class="flex flex-row text-xl gap-3">
            <div class="bg-primary-200/30 rounded-full p-1 min-w-9 text-center">
                <i class="pi pi-home text-primary-500 text-center"></i>
            </div>
            <div class="font-semibold h-fit my-auto">Vivienda</div>
        </div>
        <div class="border-b-slate-400 grid grid-cols-12 grid-row-5 px-3">
<!--            1-->
            <i class="pi pi-building-columns  py-3  border-b-slate-200 border-b w-fit col-span-1"></i>
            <div class="col-span-9 border-b-slate-200 border-b py-2 h-fit my-auto">Tipo de vivienda</div>
            <div class="border-b-slate-200 border-b py-2 h-fit my-auto col-span-2 pl-3  pr-3 flex justify-start font-semibold">
                <div>{{ solicitud.detalle.tipo_vivienda}}</div>
            </div>
            <!--            2-->
            <i class="pi pi-check-circle  py-3  border-b-slate-200 border-b w-fit col-span-1"></i>
            <div class="col-span-9 border-b-slate-200 border-b py-2 h-fit my-auto">¿Tiene patio?</div>
            <div class="border-b-slate-200 border-b py-2 h-fit my-auto col-span-2 pl-3 text-end pr-3 flex justify-start font-semibold">
                {{ solicitud.detalle.tiene_patio ? 'Sí' :'No' }}
            </div>
            <!--            3-->
            <i class="pi pi-check-circle  py-3  border-b-slate-200 border-b w-fit col-span-1"></i>
            <div class="col-span-9 border-b-slate-200 border-b py-2 h-fit my-auto">¿La mascota vivirá adentro?</div>
            <div class="border-b-slate-200 border-b py-2 h-fit my-auto col-span-2 pl-3 text-end pr-3 font-semibold  flex justify-start"><span>{{ solicitud.detalle.vive_adentro ? 'Sí' :'No' }}</span></div>
            <!--            4-->
            <i class="pi pi-users  py-3  border-b-slate-200 border-b w-fit col-span-1"></i>
            <div class="col-span-9 border-b-slate-200 border-b py-2 h-fit my-auto">Cantidad de personas</div>
            <div class="border-b-slate-200 border-b py-2 h-fit my-auto col-span-2 pl-3 text-end pr-3 font-semibold  flex justify-start"><span>{{ solicitud.detalle.cantidad_personas }}</span></div>
            <!--            5-->
            <i class="pi pi-discord  py-3  border-b-slate-200 border-b w-fit col-span-1"></i>
            <div class="col-span-9 border-b-slate-200 border-b py-2 h-fit my-auto">¿Hay niños?</div>
            <div class="border-b-slate-200 border-b py-2 h-fit my-auto col-span-2 pl-3 text-end pr-3 font-semibold  flex justify-start"><span>{{ solicitud.detalle.hay_ninios ? 'Sí' :'No' }}</span></div>
        </div>
    </div>
</template>

<style scoped>

</style>
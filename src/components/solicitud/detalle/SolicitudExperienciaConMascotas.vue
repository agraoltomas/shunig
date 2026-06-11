<script setup lang="ts">
import type { ISolicitudCompleta } from '@/lib/tipos/solicitud.ts'
import pawGreen from '@/assets/images/paw-solid-full-green.svg'

const props = defineProps<{ solicitud: ISolicitudCompleta }>()
</script>

<template>
    <div class="grow shadow-[0_0_10px_rgba(0,0,0,0.25)] rounded-2xl p-3">
        <div class="flex flex-row text-xl gap-3">
            <div class="bg-primary-200/30 rounded-full p-1 min-w-9 my-auto h-fit text-center">
                <img :src="pawGreen" class="" />
            </div>
            <div class="font-semibold h-fit my-auto">Experiencia con mascotas</div>
        </div>
        <div class="border-b-slate-400 grid grid-cols-12 grid-row-7 px-3">
            <i class="pi pi-check-circle  py-3  border-b-slate-200 border-b w-fit col-span-1"></i>
            <div class="col-span-9 border-b-slate-200 border-b py-2 h-fit my-auto">¿Tuvo mascotas?</div>
            <div class="border-b-slate-200 border-b py-2 h-fit my-auto col-span-2 pl-3  pr-3 flex justify-start font-semibold">
                <div>{{ solicitud.detalle.tipo_vivienda}}</div>
            </div>
            <!--            2-->
            <i class="pi pi-check-circle  py-3  border-b-slate-200 border-b w-fit col-span-1"></i>
            <div class="col-span-9 border-b-slate-200 border-b py-2 h-fit my-auto">¿Tiene mascotas actualmente?</div>
            <div class="border-b-slate-200 border-b py-2 h-fit my-auto col-span-2 pl-3 text-end pr-3 flex justify-start font-semibold">
                {{ solicitud.detalle.tiene_patio ? 'Sí' :'No' }}
            </div>
            <!--            3-->
            <i class="pi pi-check-circle  py-3  border-b-slate-200 border-b w-fit col-span-1"></i>
            <div class="col-span-9 border-b-slate-200 border-b py-2 h-fit my-auto">¿Están vacunadas?</div>
            <div class="border-b-slate-200 border-b py-2 h-fit my-auto col-span-2 pl-3 text-end pr-3 font-semibold  flex justify-start"><span>{{ solicitud.detalle.vive_adentro ? 'Sí' :'No' }}</span></div>
            <!--            4-->
            <i class="pi pi-check-circle  py-3  border-b-slate-200 border-b w-fit col-span-1"></i>
            <div class="col-span-9 border-b-slate-200 border-b py-2 h-fit my-auto">¿Están castradas?</div>
            <div class="border-b-slate-200 border-b py-2 h-fit my-auto col-span-2 pl-3 text-end pr-3 font-semibold  flex justify-start"><span>{{ solicitud.detalle.mascotas_castradas ? 'Sí' :'No' }}</span></div>
            <!--            5-->
            <i class="pi pi-check-circle  py-3  border-b-slate-200 border-b w-fit col-span-1"></i>
            <div class="col-span-9 border-b-slate-200 border-b py-2 h-fit my-auto">¿Tiene experiencia transitando?</div>
            <div class="border-b-slate-200 border-b py-2 h-fit my-auto col-span-2 pl-3 text-end pr-3 font-semibold  flex justify-start"><span>{{ solicitud.detalle.hay_ninios ? 'Sí' :'No' }}</span></div>
        </div>
    </div>
</template>

<style scoped>

</style>
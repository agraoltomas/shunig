<script setup lang="ts">

import paw from '@/assets/images/paw-solid-full-purple.svg'
import moment from 'moment'
import type { IDatosSolicitud } from '@/lib/tipos/solicitud.ts'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import EstadoSolicitud from '@/components/solicitud/EstadoSolicitud.vue'
import TipoSolicitud from '@/components/solicitud/TipoSolicitud.vue'
import SinImagen from '@/components/generales/SinImagen.vue'
const props = defineProps<{ solicitud: IDatosSolicitud}>()


</script>

<template>
    <div class=" rounded-lg flex flex-row gap-3 justify-between border border-gray-300">
        <div class="max-h-50 overflow-hidden my-3 rounded-lg text-center flex items-center mx-auto">
            <img v-if="solicitud.imagen" class="w-40 rounded-lg " :src="solicitud.imagen" />
            <SinImagen v-else class="w-20"></SinImagen>
        </div>
        <div class="flex flex-col justify-start gap-2 my-5 items-start w-1/2">
            <h1 class="text-3xl font-bold">{{ solicitud.animal_nombre }}</h1>
            <span class="text-slate-500 font-semibold text-lg">{{ solicitud.raza }}</span>
            <TipoSolicitud :solicitud="solicitud"></TipoSolicitud>
            <div class="text-sm text-left self-start"><span class="pi pi-calendar p-1"></span> Solicitud enviada
                el {{ moment(solicitud.fecha_creacion).format('DD/MM/YYYY') }}
            </div>
            <div class="text-sm text-left self-start">{{ solicitud.motivo }}</div>
        </div>
        <div class="flex flex-col my-5 gap-3 items-end me-5 justify-end">
            <EstadoSolicitud :solicitud="solicitud"></EstadoSolicitud>
            <div class="bg-gray-200 rounded p-2 text-sm flex flex-col gap-3 min-w-40">
                <span>Número de solicitud</span>
                #{{ solicitud.id_solicitud }}
            </div>
            <slot name="nav-button"></slot>
        </div>
    </div>
</template>

<style scoped>

</style>
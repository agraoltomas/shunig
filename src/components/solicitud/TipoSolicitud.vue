<script setup lang="ts">
import handshake from '@/assets/images/handshake-regular-full.svg'
import paw from '@/assets/images/paw-solid-full-black.svg'

import type { IDatosSolicitud } from '@/lib/tipos/solicitud.ts'
const props = defineProps<{ solicitud: IDatosSolicitud } >()
</script>

<template>
    <div
        :class="['flex flex-row gap-1 rounded-lg px-2 py-1 font-semibold w-fit', solicitud.tipo_solicitud == 'adopcion' ? 'bg-primary-200/30 text-primary-500' : 'bg-refugio-200/40 text-refugio-500']">
        <img v-if="solicitud.tipo_solicitud == 'transito'" class="w-3" :src="handshake">
        <img v-else :src="paw" class="w-3">
        {{ solicitud.tipo_solicitud == 'adopcion' ? 'Adopción' : 'Tránsito' }}
    </div>
</template>

<style scoped>

</style>
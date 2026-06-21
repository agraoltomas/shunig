<script setup lang="ts">

import moment from 'moment/moment'
import { type INotificacion, useNotificationStore } from '@/stores/notificaciones.ts'
import { useRouter } from 'vue-router'
const props = defineProps<{ notificacion: INotificacion }>()
const router = useRouter()
const notificationStore = useNotificationStore()
const leer = () => {
    notificationStore.leerNotificacion(props.notificacion)
    router.push(props.notificacion.url_destino)
}
</script>

<template>
    <div  :class="['p-2 rounded border cursor-pointer hover:bg-primary-50 border-primary-400',notificacion.leida ? '':'']"
         @click="leer">
        <div :class="['flex flex row justify-between text-lg', notificacion.leida ? 'text-gray-500' : 'font-semibold']">{{ notificacion.titulo }}<i v-if="!notificacion.leida" class="pi pi-circle-fill text-primary-500 text-xs"></i></div>
        <div :class="[notificacion.leida ? 'text-gray-500' : '']">{{ notificacion.descripcion }}</div>
        <div :class="['self-end text-gray-400 text-xs w-fit'] ">
            {{ notificacion.fecha_creacion ? moment(notificacion.fecha_creacion).format('DD/MM/YYYY h:mm:ss a') : '-' }}
        </div>
    </div>
</template>

<style scoped>

</style>
<script setup lang="ts">

import moment from 'moment/moment'
import { type INotificacion, useNotificationStore } from '@/stores/notificaciones.ts'
import { useRouter } from 'vue-router'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
const props = defineProps<{ notificacion: INotificacion }>()
const emits = defineEmits<{ leida: [], borrada: [] }>()
const router = useRouter()
const notificationStore = useNotificationStore()
const {loading, startLoading, stopLoading} = useLoadingComposable()
const leer = () => {
    notificationStore.leerNotificacion(props.notificacion)
    emits('leida')
}

const abrir = () => {
    leer()
    router.push(props.notificacion.url_destino)
}
const borrar = () => {
    notificationStore.borrarNotificacion(props.notificacion)
    emits('borrada')

}

</script>

<template>
    <div  :class="['p-2 rounded border  flex flex-row justify-between',notificacion.leida ? '':'', notificacion.id_refugio ? 'border-refugio-400' : 'border-primary-400']">
        <div class="flex flex-col cursor-pointer hover:bg-primary-50 grow" @click="abrir">
            <div :class="['flex flex-row justify-start text-xs', notificacion.leida ? 'text-gray-500' : 'font-semibold']">
                <i :class="['pi pr-2 text-[15px]',notificacion.id_refugio ? 'pi-home text-refugio-500' : 'pi-user text-primary-500'] "/>{{ notificacion.titulo }}
            </div>
            <div :class="['text-center',notificacion.leida ? 'text-gray-500 ' : '']">{{ notificacion.descripcion }}</div>
            <div :class="['self-end text-gray-400 text-xs w-fit'] ">
                {{ notificacion.fecha_creacion ? moment(notificacion.fecha_creacion).fromNow() : '-' }}
            </div>
        </div>
        <div class="flex flex-col p-1 gap-3">
            <i v-if="!notificacion.leida" class="pi pi-circle-fill text-primary-500 text-xs w-fit self-end"></i>
            <div class="flex flex-row gap-2">
                <div class="group cursor-pointer text-xl " title="Marcar como leida" v-if="!notificacion.leida" @click="leer">
                    <Icon icon="ph:envelope-open" class=" hidden group-hover:block group-hover:"></Icon>
                    <Icon icon="ph:envelope-light" class="group-hover:hidden text-gray-500"></Icon>
                </div>
                <Icon v-if="!loading" class="text-xl text-gray-400 hover:text-red-600 cursor-pointer" icon="ph:trash" @click="borrar"></Icon>
                <ProgressSpinner v-else class="w-10 h-10"></ProgressSpinner>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
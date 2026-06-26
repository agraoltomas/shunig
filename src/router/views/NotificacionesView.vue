<script setup lang="ts">

import Contenedor from '@/components/generales/Contenedor.vue'
import { type INotificacion, useNotificationStore } from '@/stores/notificaciones.ts'
import NotificacionCard from '@/components/menu/NotificacionCard.vue'
import { onMounted, type Ref, ref } from 'vue'
import DangerButton from '@/volt/DangerButton.vue'
import { useLoadingComposable } from '@/lib/utils/loading.ts'

const notificacionesStore = useNotificationStore()
const {startLoading, stopLoading,loading} = useLoadingComposable()
const notificaciones: Ref<INotificacion[]> = ref([])

const loadNotificaciones = async () => {
    startLoading()
    notificaciones.value = await notificacionesStore.getAllNotifications()
    stopLoading()
}
onMounted(async () => {
    await loadNotificaciones()
})

const leerTodas = async () => {
    startLoading()
    const r = await notificacionesStore.leerTodas(notificaciones.value.map(n => n.id_notificacion))
    await loadNotificaciones()
    stopLoading()

}
const borrarTodas = async () => {
    startLoading()
    const r = await notificacionesStore.borrarTodas(notificaciones.value.map(n => n.id_notificacion))
    await loadNotificaciones()
    stopLoading()
}
</script>

<template>
    <Contenedor class="m-auto w-3/4">
        <div class="flex flex-row py-3 justify-end gap-3">
            <Button @click="leerTodas">
                <div v-if="loading">
                    <ProgressSpinner class="m-auto" stroke-width="8" style="width: 20px !important; height: 20px !important;"></ProgressSpinner>
                </div>
                <div v-else class="flex flex-row gap-3 items-center">
                <Icon icon="ph:envelope-open"></Icon>
                <span>Marcar todas como leidas</span>
                </div>
            </Button>
            <DangerButton variant="outlined" @click="borrarTodas">
                <div v-if="loading">
                    <ProgressSpinner class="m-auto" stroke-width="8" style="width: 20px !important; height: 20px !important;"></ProgressSpinner>
                </div>
                <div v-else class="flex flex-row gap-3 items-center">
                    <Icon icon="ph:trash"></Icon>
                    <span>Borrar todas</span>
                </div>
            </DangerButton>
        </div>
        <div v-if="loading">
            <ProgressSpinner></ProgressSpinner>
        </div>
        <div v-else-if="notificaciones.length == 0">
            <div class="w-full h-full text-center p-3 border border-gray-200 rounded-lg m-1 ">No hay notificaciones</div>
        </div>
        <div v-else class="flex flex-col gap-3">
            <NotificacionCard v-for="n in notificaciones" :notificacion="n" @leida="() => n.leida = true" @borrada="() => loadNotificaciones()"></NotificacionCard>
        </div>
    </Contenedor>
</template>

<style scoped>

</style>
<script setup lang="ts">
import {  onMounted, onUnmounted, useTemplateRef } from 'vue'
import { useNotificationStore } from '@/stores/notificaciones.ts'
import Popover from '@/volt/Popover.vue'


const notificacionesStore = useNotificationStore()
import { useRouter } from 'vue-router'
import NotificacionCard from '@/components/menu/NotificacionCard.vue'
import { useLoadingComposable } from '@/lib/utils/loading.ts'


const router = useRouter()
const notificacionesPop = useTemplateRef<typeof Popover>('notificaciones')
const {startLoading,loading,stopLoading} = useLoadingComposable()
onMounted(() => {
})
onUnmounted(() => {
    notificacionesStore.unmount()
})
const leerTodas = async () => {
    startLoading()
    const r = await notificacionesStore.leerTodas(notificacionesStore.notificaciones.map(n => n.id_notificacion))
    stopLoading()

}
const borrarTodas = async () => {
    startLoading()
    const r = await notificacionesStore.borrarTodas(notificacionesStore.notificaciones.map(n => n.id_notificacion))
    stopLoading()
}
</script>

<template>
    <Button :badge="notificacionesStore.count > 0 ? notificacionesStore.count.toString() : ''" icon="pi pi-bell" @click="notificacionesPop?.toggle"></Button>
    <Popover ref="notificaciones" class=" bg-[#f7f8f9]!" pt:content="py-3 px-0!">
        <div class="flex flex-col  max-w-100">
            <div class="flex flex-row justify-end gap-3 py-1 px-3">
                <div class="text-primary-600 hover:text-primary-400  cursor-pointer" @click="leerTodas">Marcar todas como
                    leídas
                </div>
                <div class="text-red-600 hover:text-red-400  cursor-pointer" @click="borrarTodas">Borrar todas</div>
            </div>
            <div v-if="notificacionesStore.sortedNotifications.length == 0" class="flex flex-col h-[40vh] overflow-y-auto gap-1 py-3 px-2 border-t border-surface-200 mx-5 mt-2">
                <span class="self-center text-gray-500">
                    No hay notificaciones
                </span>
            </div>
            <div v-else class="flex flex-col h-[40vh] overflow-y-auto gap-1 py-3 px-2 ">
                <NotificacionCard v-for="not in notificacionesStore.sortedNotifications" :notificacion="not" />
            </div>
            <div
                class="flex  px-3 py-1 w-fit self-end font-semibold cursor-pointer hover:text-primary-500 gap-2 items-center"
                @click="() => router.push('/usuario/notificaciones')">
                <div class="h-fit">Ver todas</div>
                <i class="pi pi-arrow-right text-sm h-fit"></i>
            </div>
        </div>
    </Popover>
</template>

<style scoped>

</style>
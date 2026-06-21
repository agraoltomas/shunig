<script setup lang="ts">
import type { Maybe } from '@/lib/tipos/generics'
import { type Ref, ref, onMounted, onUnmounted, useTemplateRef } from 'vue'
import { useNotificationStore } from '@/stores/notificaciones.ts'
import Popover from '@/volt/Popover.vue'


const notificationStore = useNotificationStore()
import { useRouter } from 'vue-router'
import NotificacionCard from '@/components/menu/NotificacionCard.vue'
import { useWebsocket } from '@/lib/notificaciones.ts'


const router = useRouter()
const notificacionesPop = useTemplateRef<typeof Popover>('notificaciones')
const {addOnMessageListener} = useWebsocket('localhost:8080')

onMounted(() => {

    addOnMessageListener((ws, event) => {
        console.log('Received message', event)
        try {
            const notificacion = JSON.parse(event.data)
            notificationStore.addNotification(notificacion)
        } catch (error) {
            console.error(error)
        }
    })
})
onUnmounted(() => {
    notificationStore.unmount()
})
</script>

<template>
    <Button :badge="notificationStore.count.toString()" icon="pi pi-bell" @click="notificacionesPop?.toggle"></Button>
    <Popover ref="notificaciones" class=" bg-[#f7f8f9]!" pt:content="py-3 px-0!">
        <div class="flex flex-col  max-w-100">
            <div class="flex flex-row justify-end gap-3 py-1 px-3">
                <div class="text-primary-600 hover:text-primary-400 font-semibold cursor-pointer">Marcar todas como
                    leídas
                </div>
                <div class="text-red-600 hover:text-red-400 font-semibold cursor-pointer">Borrar todas</div>
            </div>
            <div class="flex flex-col h-[40vh] overflow-y-auto gap-1 py-3 px-2 ">
                <NotificacionCard v-for="not in notificationStore.sortedNotifications" :notificacion="not" />
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
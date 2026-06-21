<script setup lang="ts">

import Contenedor from '@/components/generales/Contenedor.vue'
import { useNotificationStore } from '@/stores/notificaciones.ts'
import NotificacionCard from '@/components/menu/NotificacionCard.vue'
const notificacionesStore = useNotificationStore()
</script>

<template>
    <Contenedor>
        <div class="flex flex-col gap-3">
            <NotificacionCard v-for="n in notificacionesStore.sortedNotifications" :notificacion="n"></NotificacionCard>
        </div>
    </Contenedor>
</template>

<style scoped>

</style>
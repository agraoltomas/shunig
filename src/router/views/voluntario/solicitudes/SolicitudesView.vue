<script setup lang="ts">

import { computed, onMounted, type Ref, ref } from 'vue'
import type { MessageResponse } from '@/lib/tipos/generics'
import type { IDatosSolicitud } from '@/lib/tipos/solicitud.ts'
import { useAxios } from '@/lib/axios.ts'
import { rutas_api } from '@/rutas_api.ts'
import { useAuthStore } from '@/stores/auth.ts'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
import ProgressSpinner from '@/volt/ProgressSpinner.vue'
import paw from '@/assets/images/paw-solid-full-purple.svg'
import moment from 'moment'
import ItemSolicitud from '@/components/solicitud/ItemSolicitud.vue'

const { axios } = useAxios()
const { user } = useAuthStore()
const { loading, stopLoading, startLoading } = useLoadingComposable()
const solicitudes: Ref<IDatosSolicitud[]> = ref([])
const loadSolicitudes = async () => {
    startLoading()
    if (!user) return
    try {
        const r = await axios.value.get(rutas_api.solicitud.USUARIO(user.id_usuario))
        const response: MessageResponse<IDatosSolicitud[]> = r.data
        solicitudes.value = response.data
    } catch (error) {

    }finally {
        stopLoading()
    }
}
onMounted(async () => {
    await loadSolicitudes()
})

</script>

<template>
    <div class="max-h-[60vh] mx-10 max-w-screen">
        <div v-if="loading">
            <ProgressSpinner></ProgressSpinner>
        </div>
        <div v-else-if="solicitudes.length == 0">
            No tiene solcitudes. Adopte hoy!
        </div>
        <div v-else class="overflow-y-auto  flex flex-col gap-3 p-3">
          <ItemSolicitud v-for="solicitud in solicitudes" :solicitud="solicitud">

          </ItemSolicitud>
        </div>
    </div>
</template>

<style scoped>

</style>
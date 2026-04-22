<script setup lang="ts">

import MascotasRefugio from '@/components/mascotas/MascotasRefugio.vue'
import { onMounted, ref, type Ref } from 'vue'
import type { MessageResponse } from '@/lib/tipos/generics'
import type {  IMascotaVoluntario } from '@/lib/tipos/mascotas'
import { useAxios } from '@/lib/axios.ts'
import { useAuthStore } from '@/stores/auth.ts'
import MascotasVoluntario from '@/components/mascotas/MascotasVoluntario.vue'
const mascotas: Ref<IMascotaVoluntario[]> = ref([]);
const authStore = useAuthStore()
const axiosStore = useAxios()

onMounted(async () => {
        if(!authStore.user)return;

        const r = await axiosStore.axios.value.get(`/animal/usuario/${authStore.user.id_usuario}/`)
    if (r.status == 200) {
        let response: MessageResponse<IMascotaVoluntario[]> = r.data
        mascotas.value = response.data
        console.log(response)
    }
})
</script>

<template>
    <div class="grid  gap-3 p-3 h-screen ">
        <Panel class="border-white! border-2 overflow-auto">
            <template #header></template>
            <MascotasVoluntario :mascotas="mascotas"></MascotasVoluntario>
        </Panel>
    </div>
</template>

<style scoped>

</style>
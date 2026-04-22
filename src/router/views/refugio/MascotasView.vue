<script setup lang="ts">
import MascotasRefugio from '@/components/mascotas/MascotasRefugio.vue'
import { onMounted, type Ref, ref } from 'vue'
import { useAxios } from '@/lib/axios.ts'
import type { MessageResponse } from '@/lib/tipos/generics'
import type { IMascota } from '@/lib/tipos/mascotas'
import { useAuthStore } from '@/stores/auth.ts'
import { useRefugioStore } from '@/stores/refugio.ts'
const mascotas: Ref<IMascota[]> = ref([]);
const axiosStore = useAxios()
const authStore = useAuthStore()
const refugioStore = useRefugioStore()
onMounted(async () => {
    if(!refugioStore.refugio)return;
    const r = await axiosStore.axios.value.get(`animal/refugio/${refugioStore.refugio.id_refugio}/`)
    if (r.status == 200) {
        let response: MessageResponse<IMascota[]> = r.data
        mascotas.value = response.data
        console.log(response)
    }
})
</script>

<template>
    <div class="grid grid-cols-4 grid-rows-12 p-3 h-screen">
        <div class="col-span-4 row-span-12">
            <Panel class="border-white! border-2 overflow-auto">
                <template #header></template>
                <MascotasRefugio :mascotas="mascotas"></MascotasRefugio>
            </Panel>
        </div>
    </div>
</template>

<style scoped>

</style>
<script setup lang="ts">

import MascotasRefugio from '@/components/mascotas/MascotasRefugio.vue'
import { onMounted, ref, type Ref } from 'vue'
import type { IMascota } from '@/lib/tipos/mascotas'
import { useRefugioStore } from '@/stores/refugio.ts'
import { useAxios } from '@/lib/axios.ts'
import type { MessageResponse } from '@/lib/tipos/generics'
import MascotasRefugioTransito from '@/components/mascotas/MascotasRefugioTransito.vue'
const mascotas: Ref<IMascota[]> = ref([]);
const refugioStore = useRefugioStore()
const axiosService = useAxios()
onMounted(async () => {
    if(!refugioStore.refugio)return;
    try{
        const r = await axiosService.axios.value.get(`animal/refugio/${refugioStore.refugio.id_refugio}/`)
        const response: MessageResponse<IMascota[]> = r.data;
        mascotas.value = response.data;
    }catch (error){

    }
})
</script>

<template>
    <Panel class="p-3 m-3" >
        <MascotasRefugioTransito :mascotas="mascotas"></MascotasRefugioTransito>
    </Panel>
</template>

<style scoped>

</style>
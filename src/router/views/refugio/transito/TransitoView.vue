<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import type { IMascota, IMascotaTransito } from '@/lib/tipos/mascotas'
import { useRefugioStore } from '@/stores/refugio.ts'
import { useAxios } from '@/lib/axios.ts'
import type { MessageResponse } from '@/lib/tipos/generics'
import MascotasRefugioTransito from '@/components/mascotas/MascotasRefugioTransito.vue'
const mascotas: Ref<IMascota[]> = ref([]);
const refugioStore = useRefugioStore()
const axiosService = useAxios()
onMounted(async () => {
    console.log(refugioStore.refugio)
    if(!refugioStore.refugio)return;
    try{
        const r = await axiosService.axios.value.get(`animal/refugio/${refugioStore.refugio.id_refugio}/transitos/`)
        const response: MessageResponse<IMascotaTransito[]> = r.data;
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
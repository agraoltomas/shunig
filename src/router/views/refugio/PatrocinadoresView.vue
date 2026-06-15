
<script setup lang="ts">
import Patrocinadores from '@/components/patrocinadores/PatrocinadoresRefugio.vue'
import { onMounted, type Ref, ref } from 'vue'
import { useAxios } from '@/lib/axios.ts'
import type { MessageResponse } from '@/lib/tipos/generics'
import type { IPatrocinador } from '@/lib/tipos/patrocinadores'
import { useAuthStore } from '@/stores/auth.ts'
import { useRefugioStore } from '@/stores/refugio.ts'

const patrocinadores: Ref<IPatrocinador[]> = ref([]);

const metricas = ref({
    solicitudes_donacion: 0,
    donaciones_recibidas: 0
})


const axiosStore = useAxios()
const refugioStore = useRefugioStore()

onMounted(async () => {
    if (!refugioStore.refugio) return;
    const idRefugio = refugioStore.refugio.id_refugio;
    const r = await axiosStore.axios.value.get(`patrocinador/refugio/${idRefugio}/`);

    if (r.status == 200) {
        const response: MessageResponse<IPatrocinador[]> = r.data
        patrocinadores.value = response.data
    }

    const rMetricas = await axiosStore.axios.value.get(`patrocinador/refugio/${idRefugio}/metricas`);
    if (rMetricas.status == 200) {
        metricas.value = rMetricas.data.data
    }
})
</script>

<template>
    <div class="grid grid-cols-4 grid-rows-12 p-3 h-screen w-3/4 m-auto mb-15">
        <div class="col-span-4 row-span-12">
            <Panel class="border-white! shadow-[0_0_10px_rgba(0,0,0,0.25)] rounded-2xl border-0 overflow-auto" pt:header="p-0!">
                <template #header>
                    <div class="w-full h-full">
                         <div class="bg-refugio-500 px-7 py-5 w-full h-full text-center text-4xl font-bold pl-3 py-4">
                            <span class="text-white">Patrocinadores</span>
                        
                        </div>
                    </div>
                </template>
                <Patrocinadores :patrocinadores="patrocinadores" :total-solicitudes-donacion="metricas.solicitudes_donacion"
    :total-donaciones-recibidas="metricas.donaciones_recibidas"></Patrocinadores>
            </Panel>
        </div>
    </div>
</template>

<style scoped>

</style>
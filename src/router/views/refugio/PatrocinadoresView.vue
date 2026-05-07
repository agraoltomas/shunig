
<script setup lang="ts">
import Patrocinadores from '@/components/patrocinadores/PatrocinadoresRefugio.vue'
import { onMounted, type Ref, ref } from 'vue'
import { useAxios } from '@/lib/axios.ts'
import type { MessageResponse } from '@/lib/tipos/generics'
import type { IPatrocinador } from '@/lib/tipos/patrocinadores'
import { useAuthStore } from '@/stores/auth.ts'
import { useRefugioStore } from '@/stores/refugio.ts'

const patrocinadores: Ref<IPatrocinador[]> = ref([]);
const axiosStore = useAxios()
const refugioStore = useRefugioStore()

onMounted(async () => {
    if(!refugioStore.refugio)return;
    const r = await axiosStore.axios.value.get(`patrocinador/refugio/${refugioStore.refugio.id_refugio}/`)
    if (r.status == 200) {
        let response: MessageResponse<IPatrocinador[]> = r.data
        patrocinadores.value = response.data
        console.log(response)
    }
})
</script>

<template>
    <div class="grid grid-cols-4 grid-rows-12 p-3 h-screen">
        <div class="col-span-4 row-span-12">
            <Panel class="border-white! border-0 overflow-auto" pt:header="p-0!">
                <template #header>
                    <div class="w-full h-full">
                         <div class="bg-surface-800 w-full h-full text-center text-4xl font-bold pl-3 py-4">
                            <span class="text-white">Patrocinadores</span>
                        
                        </div>
                    </div>
                </template>
                <Patrocinadores :patrocinadores="patrocinadores"></Patrocinadores>
            </Panel>
        </div>
    </div>
</template>

<style scoped>

</style>
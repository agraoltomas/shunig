<script setup lang="ts">
import MascotasRefugio from '@/components/mascotas/MascotasRefugio.vue'
import { onMounted, type Ref, ref } from 'vue'
import { useAxios } from '@/lib/axios.ts'
import type { MessageResponse } from '@/lib/tipos/generics'
import type { IMascota } from '@/lib/tipos/mascotas'
import { useAuthStore } from '@/stores/auth.ts'
import { useRefugioStore } from '@/stores/refugio.ts'
import Contenedor from '@/components/generales/Contenedor.vue'

const mascotas: Ref<IMascota[]> = ref([])
const axiosStore = useAxios()
const authStore = useAuthStore()
const refugioStore = useRefugioStore()
onMounted(async () => {
    if (!refugioStore.refugio) return
    const r = await axiosStore.axios.value.get(`animal/refugio/${refugioStore.refugio.id_refugio}/`)
    if (r.status == 200) {
        let response: MessageResponse<IMascota[]> = r.data
        mascotas.value = response.data
        console.log(response)
    }
})
</script>

<template>
    <div class=" w-3/4 m-auto mt-5 mb-15 flex flex-col gap-3">
        <div class="w-full">
            <div class="bg-refugio-500 px-7 rounded-lg w-full h-full text-center text-4xl font-bold pl-3 py-4">
                <span class="text-white">Mis animales</span>
            </div>
        </div>
        <Contenedor class="border-white!  shadow-[0_0_10px_rgba(0,0,0,0.25)] rounded-2xl border-0 overflow-auto"
                    pt:header="p-0!">
            <MascotasRefugio :mascotas="mascotas"></MascotasRefugio>
        </Contenedor>
    </div>
</template>

<style scoped>

</style>
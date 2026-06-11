
<script setup lang="ts">
import Productos from '@/components/inventario/InventarioRefugio.vue'
import { onMounted, type Ref, ref } from 'vue'
import { useAxios } from '@/lib/axios.ts'
import type { MessageResponse } from '@/lib/tipos/generics'
import type { IProducto } from '@/lib/tipos/productos'
import { useRefugioStore } from '@/stores/refugio.ts'
import { useToast } from '@/lib/toast/toast.ts'
import type { IPatrocinador } from '@/lib/tipos/patrocinadores'

const productos: Ref<IProducto[]> = ref([]);
const patrocinadores: Ref<IPatrocinador[]> = ref([])
const axiosStore = useAxios()
const refugioStore = useRefugioStore()
const toast = useToast();

onMounted(async () => {
    if(!refugioStore.refugio) return;
    const rProductos = await axiosStore.axios.value.get(`producto/refugio/${refugioStore.refugio.id_refugio}/`)
    if (rProductos.status == 200) {
        let response: MessageResponse<IProducto[]> = rProductos.data
        productos.value = response.data
        console.log(response)
    }
    const rPatrocinadores = await axiosStore.axios.value.get(
        `patrocinador/refugio/${refugioStore.refugio.id_refugio}`
    )
    if (rPatrocinadores.status == 200) {
        const response: MessageResponse<IPatrocinador[]> = rPatrocinadores.data
        patrocinadores.value = response.data
    }
})

</script>

<template>
    <div class="grid grid-cols-4 grid-rows-12 p-3 h-screen w-3/4 m-auto">
        <div class="col-span-4 row-span-12">
            <Panel class="border-white! shadow-[0_0_10px_rgba(0,0,0,0.25)] rounded-2xl border-0 overflow-auto" pt:header="p-0!">
                <template #header>
                    <div class="w-full h-full">
                        <div class="bg-refugio-500 px-7 py-5 w-full h-full text-center text-4xl font-bold pl-3">
                            <span class="text-white">Control de stock</span>
                        
                        </div>
                    </div>
                </template>
                <Productos :productos="productos" :patrocinadores="patrocinadores"></Productos>
            </Panel>
        </div>
    </div>
</template>

<style scoped>

</style>
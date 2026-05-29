<script setup lang="ts">
import { onMounted, type Ref, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/lib/axios.ts'
import type { IProducto } from '@/lib/tipos/productos'
import type { Maybe } from '@/lib/tipos/generics'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
import cryingDog from "@/assets/images/crying_dog.jpg"
import { AxiosError } from 'axios'
import ProgressSpinner from 'primevue/progressspinner';
import Producto from "@/components/inventario/Producto.vue"

const route = useRoute()
const producto: Ref<Maybe<IProducto>> = ref(null)
const { loading, stopLoading, startLoading } = useLoadingComposable()
const loadProducto = async () => {
    startLoading();
    try{
        const r = await axios.get(`/producto/${route.params.id}`)
        if (r.status == 200) {
            console.log(r.data)
            producto.value = r.data.data
        }
    }catch (error) {
        if(error instanceof AxiosError) {
            if(error.status == 404) {
                producto.value = null
            }
        }
    }
    stopLoading();

}
onMounted(async () => {
    console.log(route.params.id)
    await loadProducto()
});

watch(() => route.params.id, async () => {
    startLoading();
    await loadProducto()
    stopLoading();
})
</script>

<template>
    <Panel v-if="loading" class="border-surface-800! border-2 overflow-auto m-3" pt:header="p-0! text-center">
        <div class="text-center align-middle p-3">Cargando</div>
        <ProgressSpinner class="m-auto h-20! text-center" pt:circle="stroke-red-100 p-progressspinner-circle" pt:root="p-progressspinner w-full!" pt:spin="p-progressspinner-spin" />
    </Panel>
    <Producto  v-if="producto" :producto="producto" @actualizado="(productoActualizado) => 
        producto = productoActualizado"></Producto>
    <Panel class="m-auto! text-center max-w-fit" v-else-if="!loading">
        <div class="p-5 flex justify-center">
            <Image pt:root="m-auto text-center" class="" :src="cryingDog"/>
        </div>
        <span class="text-2xl text-semibold text-red-500 p-3">Producto no encontrado</span>
    </Panel>
</template>

<style scoped>

</style>
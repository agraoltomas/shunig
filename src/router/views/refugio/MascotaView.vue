<script setup lang="ts">
import Mascota from "@/components/mascotas/Mascota.vue"
import { onMounted, type Ref, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/lib/axios.ts'
import type { IMascota } from '@/lib/tipos/mascotas'
import type { Maybe } from '@/lib/tipos/generics'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
import cryingDog from "@/assets/images/crying_dog.jpg"
const route = useRoute()
const mascota: Ref<Maybe<IMascota>> = ref(null)
const { loading, stopLoading, startLoading } = useLoadingComposable()
onMounted(async () => {
    startLoading();
    try{
        const r = await axios.get(`/animal/${route.params.id}`)
        if (r.status == 200) {
            console.log(r.data)
            mascota.value = r.data.data
        }
    }catch (error) {

    }finally{
        stopLoading();
    }
})
</script>

<template>
    <Panel v-if="loading" class="border-surface-800! border-2 overflow-auto m-3" pt:header="p-0! text-center">
        <div class="text-center align-middle p-3">Cargando</div>
    </Panel>
    <Mascota class="" v-if="mascota" :mascota="mascota"></Mascota>
    <Panel class="m-auto! text-center max-w-fit" v-else-if="!loading">
        <div class="p-5">
            <Image pt:root="m-auto text-center" class="" :src="cryingDog"/>
        </div>
        <span class="text-2xl text-semibold text-red-500 p-3">Animal no encontrado</span>
    </Panel>
</template>

<style scoped>

</style>
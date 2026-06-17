<script setup lang="ts">
import Mascota from "@/components/mascotas/Mascota.vue"
import { onMounted, type Ref, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/lib/axios.ts'
import type { IMascota } from '@/lib/tipos/mascotas'
import type { Maybe } from '@/lib/tipos/generics'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
import cryingDog from "@/assets/images/crying_dog.jpg"
import { AxiosError } from 'axios'
import ProgressSpinner from 'primevue/progressspinner';
import Contenedor from '@/components/generales/Contenedor.vue'

const route = useRoute()
const mascota: Ref<Maybe<IMascota>> = ref(null)
const { loading, stopLoading, startLoading } = useLoadingComposable()
const loadMascota = async () => {
    startLoading();
    try{
        const r = await axios.get(`/animal/${route.params.id}`)
        if (r.status == 200) {
            console.log(r.data)
            mascota.value = r.data.data
        }
    }catch (error) {
        if(error instanceof AxiosError) {
            if(error.status == 404) {
                mascota.value = null
            }
        }
    }
    stopLoading();

}
onMounted(async () => {
    await loadMascota()
});

watch(() => route.params.id, async () => {
    await loadMascota()
})
</script>

<template>
    <Panel v-if="loading" class="overflow-auto m-3" pt:header="p-0! text-center">
        <div class="text-center align-middle p-3">Cargando</div>
        <ProgressSpinner class="m-auto h-20! text-center" pt:circle="stroke-red-100 p-progressspinner-circle" pt:root="p-progressspinner w-full!" pt:spin="p-progressspinner-spin" />
    </Panel>
    <Mascota  v-if="mascota" :mascota="mascota" @actualizado="loadMascota"></Mascota>
    <Contenedor class="m-auto! text-center max-w-fit" v-else-if="!loading">
        <div class="p-5">
            <Image pt:root="m-auto text-center" class="" :src="cryingDog"/>
        </div>
        <span class="text-2xl text-semibold text-red-500 p-3">Animal no encontrado</span>
    </Contenedor>
</template>

<style scoped>

</style>
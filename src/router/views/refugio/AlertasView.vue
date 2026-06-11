<script setup lang="ts">

import Contenedor from '@/components/generales/Contenedor.vue'
import { onMounted, type Ref, ref } from 'vue'
import { useAxios } from '@/lib/axios.ts'
import { useResponse } from '@/lib/utils/response.ts'
import { useRefugioStore } from '@/stores/refugio.ts'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
import type { IAlerta } from '@/components/refugio/Dashboard/AlertasResumen.vue'
import Alerta from '@/components/generales/Alerta.vue'
import { EAlerta } from '@/components/generales/alertas.ts'

const alertas: Ref<IAlerta[]> = ref([])

const {axios} = useAxios()
const {unwrap} = useResponse()
const refugioStore = useRefugioStore()
const {loading, stopLoading, startLoading} = useLoadingComposable()

onMounted(async () => {
    if(!refugioStore.refugio) return
    startLoading()
    try{
        const r = await unwrap(axios.value.get(`dashboard/${refugioStore.refugio?.id_refugio}/alertas/`))
        alertas.value = r.data
    }catch(e){

    }finally {
        stopLoading()
    }
})
</script>

<template>
    <div class="w-[75vw] m-auto">
        <div class="w-full flex flex-row py-5">
            <div class="text-3xl font-semibold">Alertas del refugio</div>
        </div>
        <Contenedor>
            <div class="flex flex-col gap-3">
                <Alerta  v-for="alerta in alertas" :alerta="alerta">

                </Alerta>
            </div>
        </Contenedor>
    </div>
</template>

<style scoped>

</style>
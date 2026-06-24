<script setup lang="ts">

import Contenedor from '@/components/generales/Contenedor.vue'
import { computed, onMounted, type Ref, ref } from 'vue'
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

const alertasInformativas = computed(() => {
    return alertas.value.filter((alerta) => Number(alerta.prioridad) === 1)
})

const alertasModeradas = computed(() => {
    return alertas.value.filter((alerta) => Number(alerta.prioridad) === 2)
})

const alertasCriticas = computed(() => {
    return alertas.value.filter((alerta) => Number(alerta.prioridad) === 3)
})
</script>

<template>
    <div class="w-3/4 m-auto mt-10 mb-15">
            <div class="bg-refugio-500 px-7 py-5 w-full h-full text-center text-4xl font-bold rounded-2xl">
                <span class="text-white">Alertas del refugio</span>
            </div>
            <div class="grid grid-cols-3 gap-5 mt-10">
            <!-- Alertas críticas -->
            <Contenedor>
                <div class="flex flex-row justify-between items-center mb-4">
                    <div class="flex flex-row text-xl gap-3">
                        <div class="bg-red-200/40 rounded-full p-1 min-w-9 h-fit text-center">
                            <i class="pi pi-exclamation-triangle text-red-700"></i>
                        </div>

                        <div class="font-semibold h-fit my-auto">
                            Alertas críticas
                        </div>
                    </div>

                <Tag
                severity="danger"
                :value="`${alertasCriticas.length}`"
                />
                </div>

                <div v-if="alertasCriticas.length" class="flex flex-col gap-3">
                    <Alerta
                        v-for="alerta in alertasCriticas"
                        :key="`${alerta.tipo_alerta}-${alerta.id_referencia}-${alerta.fecha}`"
                        :alerta="alerta"
                    />
                </div>

                <div v-else class="text-gray-500 p-3 text-center">
                    No hay alertas críticas
                </div>
            </Contenedor>

            <!-- Alertas moderadas -->
            <Contenedor>
                <div class="flex flex-row justify-between items-center mb-4">
                    <div class="flex flex-row text-xl gap-3">
                        <div class="bg-orange-200/40 rounded-full p-1 min-w-9 h-fit text-center">
                            <i class="pi pi-exclamation-circle text-orange-700"></i>
                        </div>

                        <div class="font-semibold h-fit my-auto">
                            Alertas moderadas
                        </div>
                    </div>

                    <Tag
                    severity="warn"
                    :value="`${alertasModeradas.length}`"
                    />
                </div>

                <div v-if="alertasModeradas.length" class="flex flex-col gap-3">
                    <Alerta
                    v-for="alerta in alertasModeradas"
                    :key="`${alerta.tipo_alerta}-${alerta.id_referencia}-${alerta.fecha}`"
                    :alerta="alerta"
                    />
                </div>

                <div v-else class="text-gray-500 p-3 text-center">
                 No hay alertas moderadas
                </div>
            </Contenedor>

            <!-- Alertas informativas -->
            <Contenedor>
                <div class="flex flex-row justify-between items-center mb-4">
                    <div class="flex flex-row text-xl gap-3">
                        <div class="bg-blue-200/40 rounded-full p-1 min-w-9 h-fit text-center">
                            <i class="pi pi-info-circle text-blue-700"></i>
                        </div>

                        <div class="font-semibold h-fit my-auto">
                            Alertas informativas
                        </div>
                    </div>

                    <Tag
                    severity="info"
                    :value="`${alertasInformativas.length}`"
                    />
                </div>

                <div v-if="alertasInformativas.length" class="flex flex-col gap-3">
                    <Alerta
                    v-for="alerta in alertasInformativas"
                    :key="`${alerta.tipo_alerta}-${alerta.id_referencia}-${alerta.fecha}`"
                    :alerta="alerta"
                    />
                </div>

                <div v-else class="text-gray-500 p-3 text-center">
                    No hay alertas informativas
                </div>
            </Contenedor>
        </div>
            
    </div>    
</template>

<style scoped>

</style>
<script setup lang="ts">

import type { IVacuna } from '@/lib/tipos/vacunacion.ts'
import { rutas_api } from '@/rutas_api.ts'
import type { IMascota } from '@/lib/tipos/mascotas'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
import { onMounted, ref, type Ref } from 'vue'
import { useResponse } from '@/lib/utils/response.ts'
import { useAxios } from '@/lib/axios.ts'
import moment from 'moment'
import Timeline from '@/volt/Timeline.vue'

const props = defineProps<{ mascota: IMascota }>()
const { loading, stopLoading, startLoading } = useLoadingComposable()
const { unwrap } = useResponse()
const { axios } = useAxios()
const vacunas: Ref<IVacuna[]> = ref([])
const getVacunas = async (): Promise<IVacuna[]> => {
    startLoading()
    try {
        const r = await unwrap<IVacuna[]>(axios.value.get(rutas_api.vacunas.ANIMAL(props.mascota.id_animal)))
        vacunas.value = r.data
        return r.data
    } catch (error) {
        return []
    } finally {
        stopLoading()
    }
}
onMounted(async () => {
    await getVacunas()
})
</script>

<template>
    <div class="flex flex-col">
        <div>
            <Timeline :value="vacunas" align="left" class="w-full" pt:eventopposite="hidden">
                <template #marker="{item}">
                    <i :class="['text-primary-500 text-center p-1 bg-primary-50 rounded-full',item.icon]"></i>
                </template>
                <template #content="{item}">
                    <div class="flex flex-col gap-1">
                        <div class="font-semibold">{{ item.vacuna }}<i v-if="item.observaciones"
                                                                       class="pi pi-info-circle px-1 text-gray-400"
                                                                       :title="item.observaciones"></i></div>
                        <div class="text-gray-400">{{ moment(item.fecha_vacunacion).format('DD/MM/YYYY') }}</div>
                        <!--                    <div class="text-sm text-gray-400">{{ item.observaciones}}</div>-->
                    </div>
                </template>
            </Timeline>
        </div>
    </div>
</template>

<style scoped>

</style>
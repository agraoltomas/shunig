<script setup lang="ts">

import TieneVacuna from '@/components/vacunacion/TieneVacuna.vue'
import SinImagen from '@/components/generales/SinImagen.vue'
import Checkbox from '@/volt/Checkbox.vue'
import type { IEventoVacunacion, IVacuna } from '@/lib/tipos/vacunacion.ts'
import type { IMascota } from '@/lib/tipos/mascotas'
import { computed, onBeforeMount, onMounted, ref, type Ref } from 'vue'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
import { useAxios } from '@/lib/axios.ts'
import { useResponse } from '@/lib/utils/response.ts'
import { rutas_api } from '@/rutas_api.ts'
import { useEventosVacunacionStore } from '@/stores/vacunas.ts'

const loadingVacunas = useLoadingComposable()
const {axios} = useAxios()
const {unwrap} = useResponse()
const eventosStore = useEventosVacunacionStore()

const props = defineProps<{ evento: IEventoVacunacion, animal: IMascota }>()
const vacunas: Ref<IVacuna[]> = ref([])
const selected = defineModel()

const getVacunas = async (): Promise<IVacuna[]> => {
    loadingVacunas.startLoading()
    try{
        const r = await unwrap<IVacuna[]>(axios.value.get(rutas_api.vacunas.ANIMAL(props.animal.id_animal)))
        vacunas.value = r.data;
        // const tiene = _tieneVacuna(props.animal)
        // observers.value.forEach((resolve) => resolve(tiene))
        return r.data;
    }catch(error){
        console.log(error)
        // observers.value.forEach((resolve) => resolve(false))
        return []
    }finally {
        loadingVacunas.stopLoading()
    }
}

const tieneVacuna = computed(() => {
    return vacunas.value.map(v => v.id_tipo_vacuna).includes(props.evento.vacuna_tipo.toString())
})
const estaInscripto = computed(() => {
    return eventosStore.getInscripcionesForEvento(props.evento.id_evento_vacunacion).map(i => i.id_animal).includes(props.animal.id_animal)
})

onMounted(async () => {
    await getVacunas()
})

const deshabilitado = computed(() => tieneVacuna.value || estaInscripto.value)
</script>

<template>
    <div :class="['flex flex-row p-3 gap-3 justify-around', deshabilitado ? 'bg-gray-100':'']">
        <Checkbox :disabled="tieneVacuna || estaInscripto" class="m-auto" v-model="selected" :value="animal.id_animal"></Checkbox>
        <div v-if="animal.imagen" class="flex items-center overflow-x-hidden rounded-lg">
            <img class="w-30 my-auto" :src="animal.imagen" />
        </div>
        <SinImagen v-else></SinImagen>
        <div class="flex flex-col gap-3">
            <div class="py-1 text-2xl font-semibold">
                {{ animal.nombre }}
            </div>
            <div class="flex flex-row gap-3 items-center">
                <div>{{ animal.especie }}</div>
                <i class="pi pi-circle-fill text-[4px]"></i>
                <div>{{ animal.sexo }}</div>
                <i class="pi pi-circle-fill text-[4px]"></i>
                <div>{{ animal.raza }}</div>
            </div>
            <div>
                {{ animal.edad }} {{ animal.edad > 1 ? 'años' : 'año' }}
            </div>
        </div>
        <div>
            <div>
                <div v-if="tieneVacuna">
                    <Tag severity="warn" value="Ya aplicada"></Tag>
                </div>
                <div v-else-if="estaInscripto">
                    <Tag severity="warn" value="Ya inscripto"></Tag>
                </div>
                <div v-else>
                    <Tag severity="success" value="Habilitado"></Tag>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
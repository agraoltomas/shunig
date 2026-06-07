<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue'

import type { IEventoVacunacion } from '@/lib/tipos/vacunacion.ts'
import EventoCardDetalle from '@/components/eventos/voluntarios/EventoCardDetalle.vue'
import SinImagen from '@/components/generales/SinImagen.vue'
import Checkbox from '@/volt/Checkbox.vue'
import { useUsuarioStore } from '@/stores/usuario.ts'

const props = defineProps<{ evento: IEventoVacunacion }>();
const { loading,animales,init } = useUsuarioStore()
const animalesInscriptos = ref([])
onBeforeMount(() => {
    init()
})
</script>

<template>
    <div class="flex flex-row border-b-gray-200 border-b">
        <i class="pi pi-calendar text-3xl text-blue-500 p-5 bg-blue-100/20 rounded-full h-fit m-auto"></i>
        <EventoCardDetalle :evento="evento"></EventoCardDetalle>
    </div>
    <div v-if="loading">
        <ProgressSpinner></ProgressSpinner>
    </div>
    <div  v-else>
        <div v-for="animal in animales" class="flex flex-row p-3 gap-3 justify-around">
            <Checkbox v-model="animalesInscriptos" :value="animal.id_animal"></Checkbox>
            <div v-if="animal.imagen" class="flex items-center overflow-x-hidden rounded-lg">
                <img class="w-30 my-auto" :src="animal.imagen"/>
            </div>
            <SinImagen v-else></SinImagen>
            <div class="flex flex-col gap-3">
                <div class="py-1 text-2xl font-semibold">
                    {{ animal.nombre}}
                </div>
                <div class="flex flex-row gap-3 items-center">
                    <div>{{animal.especie}}</div> <i class="pi pi-circle-fill text-[4px]"></i>
                    <div>{{animal.sexo}}</div> <i class="pi pi-circle-fill text-[4px]"></i>
                    <div>{{animal.raza}}</div>
                </div>
                <div>
                    {{animal.edad}} {{animal.edad > 1 ? 'años' : 'año'}}
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>

</style>
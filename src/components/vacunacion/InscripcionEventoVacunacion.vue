<script setup lang="ts">
import type { IEventoVacunacion } from '@/lib/tipos/vacunacion.ts'
import EventoCardDetalle from '@/components/eventos/voluntarios/EventoCardDetalle.vue'
import { onMounted, type Ref, ref, toRefs } from 'vue'
import { useAxios } from '@/lib/axios.ts'
import { useAuthStore } from '@/stores/auth.ts'
import { useResponse } from '@/lib/utils/response.ts'
import type { IMascota } from '@/lib/tipos/mascotas'
import SinImagen from '@/components/generales/SinImagen.vue'
const props = defineProps<{ evento: IEventoVacunacion }>();
const { axios } = useAxios()
const {user} = useAuthStore()
const {unwrap} = useResponse()
const animales: Ref<IMascota[]> = ref([])
onMounted(async () => {
    if(!user) return
    try{
        const r = await unwrap(axios.value.get(`/animal/usuario/${user.id_usuario}/`))
        animales.value = r.data
    }catch (error) {

    }
})
</script>

<template>
    <div class="flex flex-row border-b-gray-200 border-b">
        <i class="pi pi-calendar text-3xl text-blue-500 p-5 bg-blue-100/20 rounded-full h-fit m-auto"></i>
        <EventoCardDetalle :evento="evento"></EventoCardDetalle>
    </div>
    <div>
        <div v-for="animal in animales" class="flex flex-row p-3 gap-3 justify-around">
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
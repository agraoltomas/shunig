<script setup lang="ts">
import {computed, onMounted, type Ref, ref } from 'vue'
import DataTable from '@/volt/DataTable.vue'
import axios, { useAxios } from '@/lib/axios.ts'

import type { IMascota } from '@/lib/tipos/mascotas'
import type { MessageResponse } from '@/lib/tipos/generics'
import { useRouter } from 'vue-router'
import { useRefugioStore } from '@/stores/refugio.ts'

const router = useRouter()
const props = defineProps<{ mascotas: IMascota[]}>()
// const mascotas: Ref<IMascota[]> = ref([])

const busqueda = ref('')

const mascotasFiltradas = computed(() => {
    const texto = busqueda.value.trim().toLowerCase()

    if (!texto) {
        return props.mascotas
    }

    return props.mascotas.filter((mascota) => {
        return [
            mascota.nombre,
            mascota.especie,
            mascota.raza,
            mascota.sexo
        ].some((valor) => valor?.toLowerCase().includes(texto))
    })
})

</script>

<template>
    <div >
        <DataTable :value="mascotasFiltradas">
            <template #empty>
                <div class="m-auto text-gray-500 w-fit p-3">No hay resultados</div>
            </template>
            <template #header>
                <div class="flex flex-col gap-5 mt-3">
                <p class="text-gray-500">
                        Animales pertenecientes al refugio disponibles para adopción.
                    </p>
                <!-- Buscador -->
                <div class="flex gap-3 items-center mb-3">
                    <IconField class="w-96">
                        <InputText
                            v-model="busqueda"
                            class="w-full"
                            placeholder="Buscar por nombre, raza, sexo o especie..."
                        />                        
                    </IconField>
                    
<!--
                    <InputIcon class="pi pi-search" />
                    <Button
                        icon="pi pi-filter"
                        label="Filtros"
                        severity="success"
                    />-->
                </div></div>
            </template>
            <Column header="Nombre" field="nombre">
            </Column>
            <Column header="Especie" field="especie">
            </Column>
            <Column header="Sexo" field="sexo">
            </Column>
            <Column header="Raza" field="raza"></Column>
            <Column>
                <template #body="{data}">
                    <Button aria-label="Ver detalle del animal" class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500" icon="pi pi-eye" @click="() => router.push(`/refugio/mascota/${data.id_animal}`)"></Button>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped>

</style>
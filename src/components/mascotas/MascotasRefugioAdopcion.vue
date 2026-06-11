<script setup lang="ts">
import { computed, onMounted, type Ref, ref } from 'vue'
import DataTable from '@/volt/DataTable.vue'
import { useAxios } from '@/lib/axios.ts'
import { IconField } from 'primevue'

import type { IMascota, IMascotaTransito } from '@/lib/tipos/mascotas'
import type { Maybe, MessageResponse } from '@/lib/tipos/generics'
import { useRouter } from 'vue-router'
import { useRefugioStore } from '@/stores/refugio.ts'
import { useLoadingComposable } from '@/lib/utils/loading.ts'

const router = useRouter()


const mascotas: Ref<IMascota[]> = ref([]);
const refugioStore = useRefugioStore()
const axiosService = useAxios()
const {startLoading, stopLoading, loading} = useLoadingComposable()


onMounted(async () => {
    startLoading()
    console.log(refugioStore.refugio)
    if(!refugioStore.refugio)return;
    try{
        const r = await axiosService.axios.value.get(`animal/refugio/${refugioStore.refugio.id_refugio}/adopciones/`)
        const response: MessageResponse<IMascotaTransito[]> = r.data;
        mascotas.value = response.data;
    }catch (error) {

    }finally {
        stopLoading()
    }
})

const busqueda = ref('')

const mascotasFiltradas = computed(() => {
    const texto = busqueda.value.trim().toLowerCase();

    if (!texto) {
        return mascotas.value
    }

    return mascotas.value.filter((mascota) => {
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
    <div>
        <DataTable :value="mascotasFiltradas" :loading="loading">
            <template #empty>
                <div class="m-auto text-gray-500 w-fit p-3">No hay resultados</div>
            </template>
            <template #header>
                <div class="flex flex-col gap-5 mt-3">
                    <p class="text-gray-500">
                        Animales pertenecientes al refugio que están actualmente adoptados y con seguimiento
                    </p>
                </div>
                <!-- Buscador -->
                <div class="flex gap-3 items-center mt-3 mb-3">
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
                </div>
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
                    <Button label="Gestionar" class="bg-refugio-500! border-refugio-500!" @click="() => router.push(`/refugio/adopcion/${data.id_vinculo}`)"></Button>
                </template>
            </Column>
            <Column>
                <template #body="{data}">
                    <Button class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500" icon="pi pi-eye" @click="() => router.push(`/refugio/mascota/${data.id_animal}`)"></Button>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped>

</style>
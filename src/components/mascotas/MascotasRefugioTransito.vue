<script setup lang="ts">
import { onMounted, type Ref, ref } from 'vue'
import DataTable from '@/volt/DataTable.vue'
import axios, { useAxios } from '@/lib/axios.ts'

import type { IMascota } from '@/lib/tipos/mascotas'
import type { MessageResponse } from '@/lib/tipos/generics'
import { useRouter } from 'vue-router'
import { useRefugioStore } from '@/stores/refugio.ts'

const router = useRouter()
const props = defineProps<{ mascotas: IMascota[]}>()
// const mascotas: Ref<IMascota[]> = ref([])

</script>

<template>
    <div>
        <DataTable :value="mascotas">
            <template #empty>
                <div class="m-auto text-gray-500 w-fit p-3">No hay resultados</div>
            </template>
            <template #header>
                <div class="flex flex-row bg-surface-50 gap-3">
                    <div class="flex flex-row py-1 pl-3">
                        <InputText class="rounded-e-none"></InputText>
                    </div>
                    <div class="my-auto">
                        <Button>Filtrar
                            <svg class="mt-1" width="14" height="14" viewBox="0 0 14 14" fill="none"
                                 xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path
                                    d="M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z"
                                    fill="currentColor"></path>
                            </svg>
                        </Button>
                    </div>
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
                    <Button label="Gestionar" @click="() => router.push(`/refugio/transito/${data.id_animal}`)"></Button>
                </template>
            </Column>
            <Column>
                <template #body="{data}">
                    <Button icon="pi pi-eye" @click="() => router.push(`/refugio/mascota/${data.id_animal}`)"></Button>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped>

</style>
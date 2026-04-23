<script setup lang="ts">
import { onMounted, type Ref, ref } from 'vue'
import DataTable from '@/volt/DataTable.vue'
import axios from '@/lib/axios.ts'

import type { IMascota, IMascotaVoluntario } from '@/lib/tipos/mascotas'
import type { MessageResponse } from '@/lib/tipos/generics'
import { useRouter } from 'vue-router'
import handshake from "@/assets/images/handshake-regular-full.svg"
import paw from "@/assets/images/paw-solid-full-black.svg"

const router = useRouter()
const props = defineProps<{ mascotas: IMascotaVoluntario[]}>()
// const mascotas: Ref<IMascota[]> = ref([])

</script>

<template>
    <div>
        <DataTable :value="mascotas">
            <Column header="Nombre" field="nombre">
            </Column>
            <Column header="Especie" field="especie">
            </Column>
            <Column header="Sexo" field="sexo">
            </Column>
            <Column header="Raza" field="raza"></Column>
            <Column header="Tipo" field="tipo">
                <template #body="{data}">
                    <div v-if="data['tipo']=='transito'" class="flex flex-row gap-1">
                        Tránsito
                        <img class="size-5 text-white my-auto" :src="handshake"></img>
                    </div>
                    <div v-else class="flex flex-row gap-1 ">
                        Adopción
                        <img class="size-5 text-white my-auto" :src="paw"></img>
                    </div>
                </template>
            </Column>
            <Column>
                <template #body="{data}">
                    <Button icon="pi pi-eye" @click="() => router.push(`/usuario/mascota/${data.id_animal}`)"></Button>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped>

</style>
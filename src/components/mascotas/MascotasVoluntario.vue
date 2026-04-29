<script setup lang="ts">
import DataTable from '@/volt/DataTable.vue'

import type { IMascotaTransito } from '@/lib/tipos/mascotas'
import { useRouter } from 'vue-router'
import handshake from "@/assets/images/handshake-regular-full.svg"
import paw from "@/assets/images/paw-solid-full-black.svg"
import cryingDog from '@/assets/images/crying_dog_2.jpeg'

const router = useRouter()
const props = defineProps<{ mascotas: IMascotaTransito[]}>()
// const mascotas: Ref<IMascota[]> = ref([])

</script>

<template>

    <Panel class="mx-auto h-fit w-80!" v-if="mascotas.length == 0">
        <Image  pt:root="m-auto text-center" :src="cryingDog"/>
        <div class="text-lg my-2 text-center">No tenés animales asociados</div>
    </Panel>
    <Panel v-else class="border-white! border-2 overflow-auto">
        <DataTable :value="mascotas">
            <template #empty>
            </template>
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
                        <img class="size-5 text-white my-auto" :src="handshake">
                    </div>
                    <div v-else class="flex flex-row gap-1 ">
                        Adopción
                        <img class="size-5 text-white my-auto" :src="paw">
                    </div>
                </template>
            </Column>
            <Column>
                <template #body="{data}">
                    <Button icon="pi pi-eye" @click="() => router.push(`/usuario/mascota/${data.id_animal}`)"></Button>
                </template>
            </Column>
        </DataTable>
    </Panel>
</template>

<style scoped>

</style>
<script setup lang="ts">

import Tag from '@/volt/Tag.vue'
import type { IMascota } from '@/lib/tipos/mascotas'
import moment from 'moment'
import handshake from "@/assets/images/handshake-regular-full-white.svg"
import paw from "@/assets/images/paw-solid-full.svg"
import { useModalStore } from '@/stores/modales.ts'
const props = defineProps<{ mascota: IMascota }>();
const modalStore = useModalStore()
</script>

<template>
    <Panel class="border-white! border-2 overflow-auto m-3" pt:header="p-0!">
        <template #header>
            <div  v-if="mascota" class="bg-surface-800 w-full h-full text-center text-4xl font-bold pl-3 py-4 text-white">
                {{ mascota.nombre}}
            </div>
        </template>
        <div class="flex flex-row gap-4 pt-3" v-if="mascota">
            <div class="flex flex-col gap-3 mx-3">
                <Image v-if="mascota.imagen" class="" pt:image="max-w-72!" :src="mascota.imagen"></Image>
                <div v-else class="w-"></div>
                <div class="flex flex-row gap-3 justify-around">
                    <Button label="Adoptar" icon-pos="left" @click="() => modalStore.abrir('adopcion', mascota)">
                        <template #icon>
                            <img class="size-5 text-white" :src="paw"></img>
                        </template>
                    </Button>
                    <Button  label="Asignar tránsito" icon-pos="left">
                        <template #icon>
                            <img class="size-5 text-white" :src="handshake"></img>
                        </template>
                    </Button>
                </div>
                <!--                <div :hidden="" class=""></div>-->
            </div>
            <div class="flex flex-col mx-6 gap-3">
                <div class="rounded-lg bg-gray-200 px-2 py-1 text-lg font-semibold">
                    Fecha de ingreso | {{ moment(mascota.fecha_ingreso).format('DD-MM-YYYY')}}
                </div>
                <div class="w-full flex flex-row gap-3">
                    <Tag pt:label="text-lg " pt:icon="text-lg mr-2 mb-1" size="large" :severity="mascota.es_castrado ? 'success' : 'danger'" :icon="mascota.es_castrado ? 'pi pi-check' : 'pi pi-times'" value="Castrado"></Tag>
                </div>
                <div class="text-center text-lg my-auto font-semibold">{{ mascota.sexo}}</div>
            </div>
        </div>
        <Button class="absolute top-[85%] left-[92%]" icon="pi pi-pencil" label="Editar"></Button>
    </Panel>
</template>

<style scoped>

</style>
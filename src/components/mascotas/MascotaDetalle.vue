<script setup lang="ts">

import DataBlock from '@/components/generales/DataBlock.vue'
import Tag from '@/volt/Tag.vue'
import SinImagen from '@/components/generales/SinImagen.vue'
import type { IMascota } from '@/lib/tipos/mascotas'
import { useModalStore } from '@/stores/modales.ts'
import handshake from '@/assets/images/handshake-regular-full-white.svg'
import paw from '@/assets/images/paw-solid-full.svg'
import moment from 'moment'
import { useRouter } from 'vue-router'
import { TipoSolicitud } from '@/lib/tipos/solicitud.ts'

const modalStore = useModalStore()
const props = defineProps<{ mascota: IMascota }>()
const router = useRouter()

</script>

<template>
    <div class="flex flex-row gap-4 pt-3">
        <div class="flex flex-col gap-3 mx-3 h-full">
            <Image v-if="mascota.imagen" class="" pt:image="max-w-72!" :src="mascota.imagen"></Image>
            <SinImagen v-else></SinImagen>
            <div v-if="mascota.transito">
                <Button label="En tránsito" icon="pi pi-eye" icon-pos="right" @click="() => router.push(`/refugio/transito/${mascota.transito}`)"></Button>
            </div>
            <Tag v-else-if="mascota.adopcion"> ADOPTADA</Tag>
            <Tag v-else-if="mascota.solicitud">Solicitud {{ mascota.solicitud.tipo_solicitud ==TipoSolicitud.Adopcion ? 'de adopcion' : 'de transito' }} pendiente</Tag>
            <div v-else class="flex flex-row gap-3 justify-around">
                <Button label="Adoptar" icon-pos="left"
                        @click="() => modalStore.abrir<IMascota>('adopcion', mascota)">
                    <template #icon>
                        <img class="size-5 text-white" :src="paw"></img>
                    </template>
                </Button>
                <Button label="Asignar tránsito" icon-pos="left"
                        @click="() => modalStore.abrir('nuevoTransito', mascota)">
                    <template #icon>
                        <img class="size-5 text-white" :src="handshake"></img>
                    </template>
                </Button>
            </div>
            <!--                <div :hidden="" class=""></div>-->
        </div>
        <div class="flex flex-col mx-6 gap-3">
            <div class="rounded-lg bg-gray-200 px-2 py-1 text-lg font-semibold">
                Fecha de ingreso | {{ moment(mascota.fecha_ingreso).format('DD-MM-YYYY') }}
            </div>
            <div class="w-full flex flex-row gap-3">
                <Tag pt:label="text-lg " pt:icon="text-lg mr-2 mb-1" size="large"
                     :severity="mascota.es_castrado ? 'success' : 'danger'"
                     :icon="mascota.es_castrado ? 'pi pi-check' : 'pi pi-times'" value="Castrado"></Tag>
            </div>
            <DataBlock label="Sexo" :data="mascota.sexo" />
            <hr class="border-surface-500/80!" />
            <DataBlock label="Edad" :data="mascota.edad" />
            <hr class="border-surface-500/80!" />
            <DataBlock label="Raza" :data="mascota.raza" />
            <hr class="border-surface-500/80!" />
            <DataBlock label="Especie" :data="mascota.especie" />
            <hr class="border-surface-500/80!" />
            <DataBlock label="Observaciones" :data="mascota.observaciones ?? '-'" />
        </div>
    </div>
</template>

<style scoped>

</style>
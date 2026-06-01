<script setup lang="ts">

import DataBlock from '@/components/generales/DataBlock.vue'
import Tag from '@/volt/Tag.vue'
import SinImagen from '@/components/generales/SinImagen.vue'
import type { IMascota } from '@/lib/tipos/mascotas'
import { useModalStore } from '@/stores/modales.ts'


import moment from 'moment'
import { useRouter } from 'vue-router'
import { TipoSolicitud } from '@/lib/tipos/solicitud.ts'
import Popover from "@/volt/Popover.vue"
import HistorialAnimal from '@/components/mascotas/HistorialAnimal.vue'
import { useTemplateRef } from 'vue'

const modalStore = useModalStore()
const props = defineProps<{ mascota: IMascota }>()
const router = useRouter()

const historialPopover = useTemplateRef("historialPopover");
</script>

<template>
    <div class="flex flex-row gap-4 pt-3">
        <div class="flex flex-col gap-3 mx-3 h-full">
            <Image v-if="mascota.imagen" class="" pt:image="max-w-72!" :src="mascota.imagen"></Image>
            <SinImagen v-else></SinImagen>
            <slot></slot>
            <!--                <div :hidden="" class=""></div>-->
        </div>
        <div class="flex flex-col mx-6 gap-3">
            <Button class="w-fit!"  label="Ver historial" icon="pi pi-book" @click="(e) => historialPopover.toggle(e)"></Button>
            <div class="w-full flex flex-row gap-3">
                <Tag pt:label="text-lg " pt:icon="text-lg mr-2 mb-1" size="large"
                     :severity="mascota.es_castrado ? 'success' : 'danger'"
                     :icon="mascota.es_castrado ? 'pi pi-check' : 'pi pi-times'" value="Castrado"></Tag>
            </div>
            <DataBlock label="Fecha de ingreso" :data="moment(mascota.fecha_ingreso).format('DD-MM-YYYY')"></DataBlock>
            <hr class="border-surface-500/80!" />
            <DataBlock label="Sexo" :data="mascota.sexo" />
            <hr class="border-surface-500/80!" />
            <DataBlock label="Edad" :data="mascota.edad" />
            <hr class="border-surface-500/80!" />
            <DataBlock label="Raza" :data="mascota.raza" />
            <hr class="border-surface-500/80!" />
            <DataBlock label="Especie" :data="mascota.especie" />
            <hr class="border-surface-500/80!" />
            <DataBlock class="max-w-96" label="Observaciones" :data="mascota.observaciones ?? '-'" />
        </div>
    </div>
    <Popover ref="historialPopover">
        <HistorialAnimal :id_animal="mascota.id_animal"></HistorialAnimal>
    </Popover>
</template>

<style scoped>

</style>
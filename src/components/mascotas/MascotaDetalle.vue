<script setup lang="ts">
// import Cake from "~icons/i-icon-park-twotone/birthday-cake"
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
import dog from '@/assets/images/dog.png'

const historialPopover = useTemplateRef<typeof Popover>("historialPopover");
</script>

<template>
    <div class="flex flex-row gap-4 pt-3">
        <div class="flex flex-col gap-3 mx-3 h-full">
            <Image v-if="mascota.imagen" class="" pt:image="max-w-72!" :src="mascota.imagen"></Image>
            <SinImagen v-else></SinImagen>
            <slot></slot>
        </div>
        <div class="flex flex-col mx-6 gap-3">
            <Button class="w-fit!"  label="Ver historial" icon="pi pi-book" @click="(e) => historialPopover?.toggle(e)"></Button>
            <div class="w-full flex flex-row gap-3">
            </div>
            <div class=" flex flex-row gap-5 flex-wrap">
                <div class="flex flex-row gap-3 bg-gray-100 p-2 rounded">
                    <img class="w-6" :src="dog" />
                    <div>{{ mascota.especie }}</div>
                </div>
                <div class="flex flex-row gap-3 bg-gray-100 p-2 rounded">
                    <i :class="['p-1 pi', mascota.id_sexo == 2 ? 'pi-venus' : 'pi-mars']"></i>
                    <div>{{mascota.sexo}}</div>
                </div>
                <div class="flex flex-row gap-3 bg-gray-100 p-2 rounded">
                    <i class="pi pi-calendar p-1"></i>
                    <div>{{ mascota.edad }} años</div>
                </div>
                <div class="flex flex-row gap-1 bg-gray-100 p-2 rounded text-gray-500">
                    <i class="pi pi-calendar p-1"></i>
                    <div class="flex flex-row gap-1">ingreso: <span class="font-semibold">{{moment(mascota.fecha_ingreso).format('DD-MM-YYYY')}}</span></div>
                </div>
                <div>

                </div>
                <Tag pt:label="text-lg " pt:icon="text-lg mr-2 mb-1" size="large"
                     :severity="mascota.es_castrado ? 'success' : 'danger'"
                     :icon="mascota.es_castrado ? 'pi pi-check' : 'pi pi-times'" value="Castrado"></Tag>
            </div>
            <div class="flex flex-row gap-6 ">
                <div class="font-semibold  text-slate-400">Especie</div>
                <div>{{mascota.especie}}</div>
            </div>
            <div class="flex flex-col gap-3">
                <div class="font-semibold  text-slate-400">Observaciones</div>
                <div>{{mascota.observaciones ?? '-'}}</div>
            </div>
        </div>
    </div>
    <div></div>
    <Popover ref="historialPopover">
        <HistorialAnimal :id_animal="mascota.id_animal"></HistorialAnimal>
    </Popover>
</template>

<style scoped>

</style>
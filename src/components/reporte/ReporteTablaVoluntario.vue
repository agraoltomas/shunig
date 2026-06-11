<script setup lang="ts">
import moment from 'moment/moment'

const STRING_LENGTH = 40
const modalStore = useModalStore()
const props = withDefaults(defineProps<{ reportes: Reporte[], mascota: IMascota, modulo?: ('transito'|'adopcion') }>(), {
    modulo: 'transito'
})
import DataTable from '@/volt/DataTable.vue'
import Column from 'primevue/column'
import type { IMascota } from '@/lib/tipos/mascotas'
import type { Reporte } from '@/lib/tipos/reportes'
import { useModalStore } from '@/stores/modales.ts'
import Modal from '@/components/modal/Modal.vue'
import ReporteIngreso from '@/components/reporte/ReporteIngreso.vue'
import SecondaryButton from '@/volt/SecondaryButton.vue'
import Popover from '@/volt/Popover.vue'
import { type Ref, ref, useTemplateRef } from 'vue'
import type { Maybe } from '@/lib/tipos/generics'
import { toBase64, useFile } from '@/lib/utils/files.ts'
import SinImagen from '@/components/generales/SinImagen.vue'
import ReporteIngresoVoluntario from '@/components/reporte/ReporteIngresoVoluntario.vue'
const fileCo = useFile()
const fotoReportePopover = useTemplateRef<typeof Popover>('fotoReportePopover');
const imageDisplay: Ref<Maybe<string>> = ref(null);


const showImage = (i: string, e: Event) => {
    // fileCo.fromString(i);
    if(!fileCo.file)return;
    imageDisplay.value = i;
    console.log(fileCo);
    fotoReportePopover.value?.show(e)
}
</script>

<template>
    <div class="flex flex-col gap-3">
        <DataTable class="grow!" :value="reportes">
            <template #empty>
                <div class="w-full">
                    <div class="text-gray-500/80 m-auto w-fit p-1">Todavía no hay reportes</div>
                </div>
            </template>
            <Column header="Fecha" field="fecha">
                <template #body="{data}">
                    {{ moment(data['fecha']).format('DD/MM/YYYY') }}
                </template>
            </Column>
            <Column header="Detalle">
                <template #body="{data}">
                    <div class=" text-wrap" :title="data['descripcion']">{{ data['descripcion'] }}
                    </div>
                </template>
            </Column>
            <Column header="Fotos">
                <template #body="{data}">
                    <SecondaryButton v-if="data['imagen']" title="Ver fotos" icon="pi pi-image" @click="(e) => showImage(data['imagen'],e)"></SecondaryButton>
                    <span v-else>Sin fotos</span>
                </template>
            </Column>
        </DataTable>
        <div class="flex flex-row justify-end p-3">
            <Button label="Cargar reporte" icon="pi pi-plus"
                    @click=" () => modalStore.abrir('reporte', props.mascota)"></Button>

        </div>

    </div>
    <Modal nombre="reporte" class="min-w-[35em] m-auto!">
        <template #header>
            <div class="p-3 text-xl font-semibold">Cargar reporte</div>
        </template>
        <template #default="{closeFn, context}">
            <ReporteIngresoVoluntario @cargado="closeFn" :mascota="context.reporte"></ReporteIngresoVoluntario>
        </template>
    </Modal>
    <Popover ref="fotoReportePopover">
        <div>
            <Image class="w-60" v-if="imageDisplay" :src="imageDisplay"></Image>
            <SinImagen v-else></SinImagen>
        </div>
    </Popover>
</template>

<style scoped>

</style>
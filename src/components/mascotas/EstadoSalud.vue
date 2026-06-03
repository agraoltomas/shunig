<script setup lang="ts">

import DataListGroup, { type DataListItem } from '@/components/generales/DataListGroup.vue'
import type { IMascota } from '@/lib/tipos/mascotas'
import { computed, onMounted, type Ref, ref } from 'vue'
import { useAxios } from '@/lib/axios.ts'
import { useResponse } from '@/lib/utils/response.ts'
import { rutas_api } from '@/rutas_api.ts'
import moment from 'moment/moment'
import Contenedor from '@/components/generales/Contenedor.vue'
import Timeline from '@/volt/Timeline.vue'
import Footer from '@/components/generales/Footer.vue'
import { useModalStore } from '@/stores/modales.ts'
import { TablaEstatica } from '@/lib/tipos/estaticos.ts'
import FormRow from '@/components/forms/FormRow.vue'
import TableSelect from '@/components/forms/TableSelect.vue'
import FormCol from '@/components/forms/FormCol.vue'
import Modal from '@/components/modal/Modal.vue'
import Label from '@/components/forms/Label.vue'

const props = defineProps<{ mascota: IMascota }>()
const { axios } = useAxios()
const { unwrap } = useResponse()

export interface EstadoSalud {
    id_estado_salud: string,
    id_animal: string,
    fecha_estado_salud: string,
    observaciones: string,
    id_estado_salud_tipo: string
    estado_salud: string
}

const registros: Ref<EstadoSalud[]> = ref([])
onMounted(async () => {
    try {
        const r = await unwrap<EstadoSalud[]>(axios.value.get(rutas_api.animales.salud.LIST(props.mascota.id_animal)))
        registros.value = r.data
    }catch (error) {}
})
const into = computed(() => {
    return registros.value.map(r => ({
        ...r,
        icon: r.estado_salud == 'Saludable' ? 'pi pi-heart' : 'pi pi-wave-pulse'
    }))
})
const modal = useModalStore()
</script>

<template>
    <Contenedor class="w-1/3">
        <div class="flex flex-row text-xl gap-3 pb-3">
            <div class="bg-primary-200/30 rounded-full p-1 min-w-9 text-center">
                <i class="text-primary-500 text-center pi pi-heart"></i>
            </div>
            <div class="font-semibold h-fit my-auto pr-2">Estado de salud</div>
        </div>
        <Timeline :value="into" align="left"  class="w-full" pt:eventopposite="hidden">
            <template #marker="{item}">
                <i :class="['text-primary-500 text-center p-1 bg-primary-50 rounded-full',item.icon]"></i>
            </template>
            <template #content="{item}">
                <div class="flex flex-col gap-1">
                    <div class="font-semibold">{{ item.estado_salud}}<i v-if="item.observaciones" class="pi pi-info-circle px-1 text-gray-400" :title="item.observaciones"></i></div>
                    <div class="text-gray-400">{{ moment(item.fecha_estado_salud).format("DD/MM/YYYY")}}</div>
<!--                    <div class="text-sm text-gray-400">{{ item.observaciones}}</div>-->
                </div>
            </template>
        </Timeline>
        <div class="flex flex-row justify-end gap-3 py-3">
            <Button label="Registrar" icon="pi pi-plus" @click="() => modal.abrir('estado_salud',mascota)"></Button>
        </div>
    </Contenedor>
    <Modal nombre="estado_salud" class="w-1/4">
        <template #default="{context}">
            <div>
                <FormRow>
                    <FormCol :span="12">
                        <Label>
                            <i class="pi pi-heart p-1"></i>Estado de salud
                        </Label>
                        <TableSelect :tipo="TablaEstatica.EstadoSalud"></TableSelect>
                    </FormCol>
                    <FormCol :span="12">
                        <Label><i class="pi pi-clipboard p-1 text-grey-300! font-normal!"></i>Observación</Label>
                        <Textarea :maxlength="150" ></Textarea>
                    </FormCol>
                </FormRow>
                        <div class="flex flex-row justify-end w-full py-3">
                            <Button label="Cargar"></Button>
                        </div>
            </div>
        </template>
    </Modal>
</template>

<style scoped>
</style>
<script setup lang="ts">

import DataListGroup, { type DataListItem } from '@/components/generales/DataListGroup.vue'
import type { IMascota } from '@/lib/tipos/mascotas'
import { computed, onMounted, reactive, type Ref, ref } from 'vue'
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
import { useToast } from '@/lib/toast/toast'
import ContenedorTitulo from '@/components/generales/ContenedorTitulo.vue'

const props = defineProps<{ mascota: IMascota }>()
const { axios } = useAxios()
const { unwrap } = useResponse()
const toast = useToast()
export interface EstadoSalud  {
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
    } catch (error) {
    }
})
const into = computed(() => {
    return registros.value.map(r => ({
        ...r,
        icon: r.estado_salud == 'Saludable' ? 'pi pi-heart' : 'pi pi-wave-pulse'
    }))
})
const modal = useModalStore()
const nuevoRegistro = reactive({
    observacion: null,
    estado_salud: null
})

const registrar = async () =>{
    if(!nuevoRegistro.observacion || !nuevoRegistro.estado_salud)return;
    try{
        const r = await unwrap(axios.value.post(rutas_api.animales.salud.REGISTRAR(props.mascota.id_animal),{
            ...nuevoRegistro
        }))
        if(r){
            Object.assign(nuevoRegistro, {
                observacion: null,
                estado_salud: null
            })
            modal.cerrar('estado_salud')
            toast.add({severity: "success", detail: "Estado de salud  registrado"})
        }
    }catch(error){

    }finally {

    }

}
</script>

<template>
    <ContenedorTitulo title="Estado de salud" icon="pi pi-heart" class="w-1/3 flex flex-col">
        <div v-if="into.length == 0" class="grow">
            <div class="text-gray-400">
                No hay registros del estado de salud
            </div>
        </div>
        <Timeline v-else :value="into" align="left" class="w-full grow" pt:eventopposite="hidden">
            <template #marker="{item}">
                <i :class="['text-primary-500 text-center p-1 bg-primary-50 rounded-full',item.icon]"></i>
            </template>
            <template #content="{item}">
                <div class="flex flex-col gap-1">
                    <div class="font-semibold">{{ item.estado_salud }}<i v-if="item.observaciones"
                                                                         class="pi pi-info-circle px-1 text-gray-400"
                                                                         :title="item.observaciones"></i></div>
                    <div class="text-gray-400">{{ moment(item.fecha_estado_salud).format('DD/MM/YYYY') }}</div>
                    <!--                    <div class="text-sm text-gray-400">{{ item.observaciones}}</div>-->
                </div>
            </template>
        </Timeline>
        <div class="flex flex-row justify-end gap-3 pt-3">
            <Button label="Registrar" icon="pi pi-plus" class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500" @click="() => modal.abrir('estado_salud',mascota)"></Button>
        </div>
    </ContenedorTitulo>
    <Modal nombre="estado_salud" class="w-1/4">
        <template #default="{context}">
            <div>
                <FormRow>
                    <FormCol :span="12">
                        <Label for="estado_salud" required>
                            <i class="pi pi-heart p-1"></i>Estado de salud
                        </Label>
                        <TableSelect id="estado_salud" v-model="nuevoRegistro.estado_salud" :tipo="TablaEstatica.EstadoSalud"></TableSelect>
                    </FormCol>
                    <FormCol :span="12">
                        <Label for="observaciones" required><i class="pi pi-clipboard p-1 text-grey-300! font-normal!"></i>Observación</Label>
                        <Textarea id="observaciones" required v-model="nuevoRegistro.observacion" :maxlength="150"></Textarea>
                    </FormCol>
                </FormRow>
                <div class="flex flex-row justify-end w-full py-3">
                    <Button label="Cargar" @click="registrar" class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500"></Button>
                </div>
            </div>
        </template>
    </Modal>
</template>

<style scoped>
</style>
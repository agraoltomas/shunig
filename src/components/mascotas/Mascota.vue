<script setup lang="ts">
import Tag from '@/volt/Tag.vue'
import type { IMascota } from '@/lib/tipos/mascotas'
import moment from 'moment'
import handshake from '@/assets/images/handshake-regular-full-white.svg'
import paw from '@/assets/images/paw-solid-full.svg'
import { useModalStore } from '@/stores/modales.ts'
import FormTransito from '@/components/transito/FormTransito.vue'
import Modal from '@/components/modal/Modal.vue'
import { type Reactive, reactive, ref, watch } from 'vue'
import FormRow from '@/components/forms/FormRow.vue'
import FormCol from '@/components/forms/FormCol.vue'
import TableSelect from '@/components/forms/TableSelect.vue'
import { TablaEstatica } from '@/lib/tipos/estaticos.ts'
import Label from '@/components/forms/Label.vue'
import ToggleSwitch from '@/volt/ToggleSwitch.vue'
import FileUpload from '@/components/forms/FileUpload.vue'
import * as yup from 'yup'

const props = defineProps<{ mascota: IMascota }>()
const modalStore = useModalStore()
const editando = ref(false)
const newValues: Reactive<{[k in keyof IMascota]?: any}> = reactive({
})

const toImageSource = (f: File): string => {
    return URL.createObjectURL(f)
}

const updateNew = (l: keyof IMascota,v : any) => {
    newValues[l] = v
}

const updateAnimalSchema = yup.object({
    nombre: yup.string().trim().min(3),
    edad: yup.number().min(1),
    // es_castrado: false,
    // id_especie: 0,
    // id_sexo: 0,
    // imagen: null,
    // observaciones: null,
    // raza: null,
} satisfies {[k in keyof IMascota]?: any})
const actualizar = () =>{

}
</script>

<template>
    <Panel v-if="mascota" class="border-white! border-0 overflow-auto m-3" pt:header="p-0!">
        <template #header>
            <div v-if="mascota"
                 class="w-full h-full">
                <div v-if="editando" class="bg-surface-800 w-full h-full text-center text-4xl font-bold pl-3 py-4 text-white">
                        <InputText @update:model-value="(v) => updateNew('nombre', v)" :value="mascota.nombre"></InputText>
                </div>
                <div v-else class="bg-surface-800 w-full h-full text-center text-4xl font-bold pl-3 py-4 text-white">
                    {{ mascota.nombre }}
                </div>
            </div>
        </template>
        <div v-if="editando" class="flex flex-row gap-4 pt-3">
            <div class="flex flex-col gap-3 mx-3">
                <Image v-if="newValues.imagen" class="m-auto" pt:image="max-w-72!" :src="toImageSource(newValues.imagen)">
                </Image>
                <div v-else class="w-"></div>
                <div class="flex flex-row gap-3 justify-around">
                    <FileUpload :preview="false" :value="mascota.imagen" @update:model-value="(i) => updateNew('imagen', i)"></FileUpload>
                </div>
                <!--                <div :hidden="" class=""></div>-->
            </div>
            <div class="flex flex-col mx-6 gap-3">
                <div class="rounded-lg bg-gray-200 px-2 py-1 text-lg font-semibold">
                    Fecha de ingreso | {{ moment(mascota.fecha_ingreso).format('DD-MM-YYYY') }}
                </div>
                <div class="w-full flex flex-row gap-3">
                    <Label class="my-auto ml-3">Castrado</Label>
                    <ToggleSwitch :value="mascota.es_castrado" @update:modelValue="(e: boolean) => updateNew('es_castrado',e)"  class="m-auto"></ToggleSwitch>
                </div>
                <FormRow class="text-start text-lg font-semibold">
                    <FormCol modo="horizontal" :span="12">
                        <Label>Sexo</Label>
                        <TableSelect @update:modelValue="(t) => updateNew('id_sexo', t)" fluid :value="mascota.id_sexo" :tipo="TablaEstatica.Sexo"></TableSelect>
                    </FormCol>
                </FormRow>
                <FormRow class="text-start text-lg font-semibold">
                    <FormCol modo="horizontal" :span="12">
                        <Label>Edad</Label>
                        <InputNumber :value="mascota.edad" @update:modelValue="(t) => updateNew('edad', t)"></InputNumber>
                    </FormCol>
                </FormRow>
                <FormRow class="text-start text-lg font-semibold">
                    <FormCol modo="horizontal" :span="12">
                        <Label>Raza</Label>
                        <InputText :value="mascota.raza" @update:modelValue="(t) => updateNew('raza', t)"></InputText>
                    </FormCol>
                </FormRow>
                <FormRow class="text-start text-lg font-semibold">
                    <FormCol modo="horizontal" :span="12">
                        <Label>Especie</Label>
                        <TableSelect :value="mascota.id_especie" :tipo="TablaEstatica.Especie" @update:modelValue="(t) => updateNew('id_especie', t)"></TableSelect>
                    </FormCol>
                </FormRow>
                <FormRow class="text-start text-lg font-semibold">
                    <FormCol modo="horizontal" :span="12">
                        <Label>Observaciones</Label>
                        <InputText :value="mascota.observaciones" @update:modelValue="(t) => updateNew('observaciones', t)"></InputText>
                    </FormCol>
                </FormRow>
            </div>
        </div>
        <div v-else class="flex flex-row gap-4 pt-3">
            <div class="flex flex-col gap-3 mx-3">
                <Image v-if="mascota.imagen" class="" pt:image="max-w-72!" :src="mascota.imagen"></Image>
                <div v-else class="w-"></div>
                <div class="flex flex-row gap-3 justify-around">
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
                <div class="text-start text-lg font-semibold">Sexo: {{ mascota.sexo }}</div>
                <div class="text-start text-lg font-semibold">Edad: {{ mascota.edad }}</div>
                <div class="text-start text-lg font-semibold">Raza: {{ mascota.raza }}</div>
                <div class="text-start text-lg font-semibold">Especie: {{ mascota.especie }}</div>
                <div class="text-start text-lg font-semibold">Observaciones: {{ mascota.observaciones }}</div>
            </div>
        </div>
        <div :class="['absolute top-[85%]  flex flex-row gap-3', editando ? 'left-[80%]' : 'left-[92%]']">
        <Button v-if="editando" icon="pi pi-check" label="Guardar"></Button>
<!--        <Button class=""-->
<!--                :icon="editando ? 'pi pi-times' : 'pi pi-pencil' "-->
<!--                :label=" editando ? 'Cancelar' : 'Editar'"-->
<!--                @click="() => editando = !editando"></Button>-->
        </div>
    </Panel>
    <Modal nombre="nuevoTransito" title="Nuevo Transito">
        <template #default="{closeFn, context}">
            <FormTransito v-if="context.nuevoTransito" @close="closeFn" :mascota="context.nuevoTransito"></FormTransito>
        </template>
    </Modal>
</template>

<style scoped>

</style>
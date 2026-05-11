<script setup lang="ts">
import type { IMascota } from '@/lib/tipos/mascotas'
import moment from 'moment'
import { useModalStore } from '@/stores/modales.ts'
import FormTransito from '@/components/transito/FormTransito.vue'
import Modal from '@/components/modal/Modal.vue'
import { type Reactive, reactive, type Ref, ref, type TemplateRef, useTemplateRef } from 'vue'
import { Form } from '@primevue/forms'
import FormRow from '@/components/forms/FormRow.vue'
import FormCol from '@/components/forms/FormCol.vue'
import TableSelect from '@/components/forms/TableSelect.vue'
import { TablaEstatica } from '@/lib/tipos/estaticos.ts'
import Label from '@/components/forms/Label.vue'
import ToggleSwitch from '@/volt/ToggleSwitch.vue'
import FileUpload from '@/components/forms/FileUpload.vue'
import * as yup from 'yup'
import SinImagen from '@/components/generales/SinImagen.vue'
import MascotaDetalle from '@/components/mascotas/MascotaDetalle.vue'
import type { Maybe, MessageResponse } from '@/lib/tipos/generics'
import type { FormSubmitEvent } from '@primevue/forms/form'
import { useAxios } from '@/lib/axios.ts'
import { toBase64 } from '@/lib/utils/files.ts'
import { AxiosError } from 'axios'
import { useToast } from '@/lib/toast/toast.ts'

const props = defineProps<{ mascota: IMascota }>()
const emit = defineEmits<{ actualizado: []}>()
const modalStore = useModalStore()
const editando = ref(false)
const newValues: Reactive<{ [k in keyof IMascota]?: any }> = reactive({})
const { axios } = useAxios();

const toImageSource = (f: File): string => {
    return URL.createObjectURL(f)
}

const updateNew = (l: keyof IMascota, v: any) => {
    newValues[l] = v
}
const toast = useToast();
const updateAnimalSchema = yup.object({
    nombre: yup.string().trim().min(3),
    edad: yup.number().min(1)
    // es_castrado: false,
    // id_especie: 0,
    // id_sexo: 0,
    // imagen: null,
    // observaciones: null,
    // raza: null,
} satisfies { [k in keyof IMascota]?: any })



const actualizar = async (e: FormSubmitEvent) => {
    if(!props.mascota) return
    const dirty = Object.keys(e.states).filter(k => e.states[k]?.dirty)
    console.log(dirty)
    const datos: {[k: string]: any} = {}
    dirty.forEach((k) => {
        datos[k] = e.values[k];
        console.log(typeof datos[k]);
    })
    console.log(datos);
    if(newImage.value){
        datos['imagen'] = await toBase64( newImage.value)
    }
    try{

        const r = await axios.value.patch(`/animal/${props.mascota.id_animal}/`,{
            ...datos
        });
        const response: MessageResponse<any> = r.data;
        toast.add({ detail: "Animal actualizado exitosamente", severity:"success" });
        editando.value = false
        emit('actualizado');
    }catch(e){
        if(e instanceof AxiosError){

        }
    }
}
const form: TemplateRef<typeof Form> = useTemplateRef("form");

const newImage: Ref<Maybe<File>> = ref(null);
const imageDisplay: Ref<Maybe<File>> = ref(props.mascota.imagen ? new File(Array.from(props.mascota.imagen), "imagen") : null)
</script>

<template>
    <Panel v-if="mascota" class="border-white! border-0 overflow-auto w-[75%] m-auto" pt:header="p-0!">
        <template #header>
            <div v-if="mascota"
                 class="w-full h-full">
                <div class="bg-surface-800 w-full h-full text-center text-4xl font-bold pl-3 py-4 text-white">
                    {{ mascota.nombre }}
                </div>
            </div>
        </template>
        <div v-if="editando" class="flex flex-row gap-4 pt-3">
            <Form ref="form" v-slot="$form" @submit="actualizar" :initial-values="mascota"  class="flex flex-row">
                <div class="flex flex-col gap-3 mx-3 min-w-96 justify-between h-full">
                    <Image v-if="newImage" class="m-auto" pt:image="max-w-72!"
                           :src="toImageSource(newImage)">
                    </Image>
                    <SinImagen v-else/>
                    <div class="flex flex-row gap-3 justify-around">
                        <FileUpload v-model="newImage" @update:model-value="(f) => {
                            if(f === undefined) return
                            newImage = f;
                            imageDisplay = f;
                        }"  :preview="false" ></FileUpload>
                    </div>
                    <!--                <div :hidden="" class=""></div>-->
                </div>
                <div class="flex flex-col mx-6 gap-3 " >
                    <FormRow class="text-start text-lg font-semibold" :gap="5">
                        <FormCol :span="3">
                            <Label>Sexo</Label>
                            <TableSelect name="id_sexo" :tipo="TablaEstatica.Sexo"></TableSelect>
                        </FormCol>
                        <FormCol :span="6">
                            <Label>Raza</Label>
                            <InputText fluid name="raza"></InputText>
                        </FormCol>
                        <FormCol :span="3">
                            <Label class="my-auto ml-3">Castrado</Label>
                            <ToggleSwitch name="es_castrado" class="m-auto"></ToggleSwitch>
                        </FormCol>
                    </FormRow>
                    <FormRow class="text-start text-lg font-semibold">
                        <FormCol :span="2">
                            <Label>Edad</Label>
                            <InputNumber fluid name="edad"></InputNumber>
                        </FormCol>
                        <FormCol :span="10">
                            <Label>Especie</Label>
                            <TableSelect class="w-fit" name="id_especie" :tipo="TablaEstatica.Especie"></TableSelect>
                        </FormCol>
                    </FormRow>
                    <FormRow class="text-start text-lg font-semibold">
                    </FormRow>
                    <FormRow class="text-start text-lg font-semibold">
                        <FormCol  :span="12">
                            <Label>Observaciones</Label>
                            <Textarea name="observaciones"></Textarea>
                        </FormCol>
                    </FormRow>
                </div>
            </Form>
        </div>
        <MascotaDetalle v-else :mascota="mascota"></MascotaDetalle>
        <div class="flex-row flex gap-3 justify-end py-5">
            <Button v-if="editando" icon="pi pi-check" label="Guardar" @click="() => form?.submit()"></Button>
            <Button class=""
                    :icon="editando ? 'pi pi-times' : 'pi pi-pencil' "
                    :label=" editando ? 'Cancelar' : 'Editar'"
                    @click="() => editando = !editando"></Button>
        </div>
    </Panel>
    <Modal nombre="nuevoTransito" title="Nuevo Transito">
        <template #default="{closeFn, context}">
            <FormTransito v-if="context.nuevoTransito" @close="closeFn" @cargada="() => {closeFn() ; $emit('actualizado')}" :mascota="context.nuevoTransito"></FormTransito>
        </template>
    </Modal>
</template>

<style scoped>
.crossed {
    background:
        linear-gradient(to top left,
        rgba(0,0,0,0) 0%,
        rgba(0,0,0,0) calc(50% - 2px),
        color-mix(in oklab, var(--color-gray-500) 30%, transparent) 50%,
        rgba(0,0,0,0) calc(50% + 2px),
        rgba(0,0,0,0) 100%);
}
</style>
<script setup lang="ts">

import { type Reactive, reactive, ref } from 'vue'
import type { IMascota } from '@/lib/tipos/mascotas'
import { Form, } from '@primevue/forms'
import axios from '@/lib/axios.ts'
import type { Maybe } from '@/lib/tipos/generics'
import { TablaEstatica } from '@/lib/tipos/estaticos.ts'

import FormRow from '@/components/forms/FormRow.vue'
import FormCol from '@/components/forms/FormCol.vue'
import Textarea from '@/volt/Textarea.vue'
import ToggleSwitch from '@/volt/ToggleSwitch.vue'
import TableSelect from '@/components/forms/TableSelect.vue'
import FileUpload from 'primevue/fileupload'
import { useToast } from 'primevue'
const toast = useToast();

type Optional<T> = { [K in keyof T]: Maybe<T[K]> }
const initialValues = reactive({
    nombre: null,
    edad: null,
    es_castrado: false,
    id_especie: null,
    id_sexo: null,
    imagen_url: null,
    observaciones: null,
    raza: null
})

interface MascotaData {
    nombre: null,
    edad: null,
    es_castrado: false,
    id_especie: null,
    id_sexo: null,
    imagen_url: null,
    observaciones: null,
    raza: null
}

const data: Reactive<Partial<Optional<IMascota>>> = reactive({
    nombre: null,
    edad: null,
    es_castrado: false,
    id_especie: null,
    id_sexo: null,
    imagen_url: null,
    observaciones: null,
    raza: null
})

const validar = () => {
    return true
}

const emits = defineEmits<{close: []}>();
const ingresar = async (d: any) => {
        console.log('cargando',d)
        const r = await axios.post(`/animal/`, {
            ...d.values
        });
        if([200,201].includes(r.status)){
            toast.add({severity:"success", summary:"Éxito!", detail: `${d.values.nombre} se ha dado de alta exitosamente`})
            emits('close')
        }
}

const resolver = ({ values }: { values: Partial<Optional<IMascota>> }) => {
    const errors: { [K in keyof MascotaData]: { message: string }[] } = {
        edad: [], es_castrado: [], id_especie: [], id_sexo: [], imagen_url: [], observaciones: [], raza: [],
        nombre: []
    }

    if (!values.nombre) {
        errors.nombre.push({ message: 'El nombre es obligatorio' })
    }
    if (!values.raza) {
        errors.raza.push({ message: 'La raza es obligatoria' })
    }
    if (!values.edad) {
        errors.edad.push({ message: 'Ingrese una edad aproximada' })
    }
    if (!values.id_sexo) {
        errors.id_sexo.push({ message: 'Seleccione el sexo del animal' })
    }
    if (!values.id_especie) {
        errors.id_especie.push({ message: 'Seleccione la especie del animal' })
    }
    return {
        values, // (Optional) Used to pass current form values to submit event.
        errors
    }
}

const ptButton = ref({
    root: 'bg-secondary-500 px-3 py-2 rounded-lg flex flex-row gap-3 cursor-pointer max-h-fit disabled:pointer-events-none disabled:opacity-60 ',
    icon: 'm-auto text-surface-800',
    label: 'text-surface-800 m-auto'
})


</script>

<template>
    <Form v-slot="$form" :initialValues :resolver @submit="ingresar" class="flex flex-col gap-4 w-full">
        <!--        <div class="flex flex-col gap-7">-->
        <FormRow class="w-full">
            <FormCol :span="6">
                <label>Nombre</label>
                <InputText fluid name="nombre"></InputText>
                <Message v-if="$form.nombre?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.nombre.error?.message }}
                </Message>
            </FormCol>
            <FormCol :span="6">
                <label>Raza</label>
                <InputText fluid name="raza"></InputText>
                <Message v-if="$form.raza?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.raza.error?.message }}
                </Message>
            </FormCol>
        </FormRow>
        <FormRow>
            <FormCol :span="3">
                <label>Especie</label>
                <TableSelect name="id_especie" v-model="data.id_especie" :tipo="TablaEstatica.Especie"></TableSelect>
                <Message v-if="$form.id_especie?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.id_especie.error?.message }}
                </Message>
            </FormCol>
            <FormCol :span="3">
                <label>Sexo</label>
                <TableSelect name="id_sexo"  v-model="data.id_sexo" :tipo="TablaEstatica.Sexo"></TableSelect>
                <Message v-if="$form.id_sexo?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.id_sexo.error?.message }}
                </Message>
            </FormCol>
            <FormCol :span="3">
                <label>Edad (Aproximada)</label>
                <InputNumber :min-fraction-digits="0" :max-fraction-digits="0" :min="0" :max="99" fluid
                             class="" name="edad"></InputNumber>
                <Message v-if="$form.edad?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.edad.error?.message }}
                </Message>
            </FormCol>
            <FormCol :span="3" modo="vertical">
                <label class="text-surface-50 select-none">.</label>
                <div class="flex flex-row border rounded-lg h-full w-full mx-auto gap-3 border-surface-400">
                    <label class="my-auto ml-3">Castrado</label>
                    <ToggleSwitch name="es_castrado" class="m-auto"></ToggleSwitch>
                </div>
            </FormCol>
        </FormRow>
        <FormRow>
            <FormCol :span="12">
                <label>Observaciones</label>
                <Textarea name="observaciones"></Textarea>
                <Message v-if="$form.observaciones?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.observaciones.error?.message }}
                </Message>
            </FormCol>
        </FormRow>
        <FormRow>
            <FormCol :span="12">
                <label>Imagen</label>
                <FileUpload :pt="{
                    root: 'flex flex-row gap-3 border rounded-lg px-3 py-6 border-surface-400',
                    input: 'hidden',
                    header: 'flex flex-row gap-3',
                    pcChooseButton: ptButton,
                    pcUploadButton: ptButton,
                    pcCancelButton: ptButton,
                    content: 'w-full',

                    file: {
                        class:'flex flex-row w-full gap-3',
                    },
                    pcFileBadge: {
                        root:'bg-orange-400 m-auto w-fit h-fit p-1 text-sm text-surface-200 rounded-lg',
                    }
                }"></FileUpload>
            </FormCol>
        </FormRow>
        <div class="flex flex-row justify-end gap-3">
            <Button type="submit" icon="pi pi-save" label="Guardar" icon-pos="right"></Button>
        </div>
    </Form>
</template>

<style scoped>
label {
    line-height: 0.5;
}
</style>
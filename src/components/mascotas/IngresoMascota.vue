<script setup lang="ts">

import { type Reactive, reactive, ref } from 'vue'
import type { IMascota } from '@/lib/tipos/mascotas'
import { Form } from '@primevue/forms'
import axios from '@/lib/axios.ts'
import type { Maybe } from '@/lib/tipos/generics'
import { TablaEstatica } from '@/lib/tipos/estaticos.ts'

import FormRow from '@/components/forms/FormRow.vue'
import FormCol from '@/components/forms/FormCol.vue'
import Textarea from '@/volt/Textarea.vue'
import ToggleSwitch from '@/volt/ToggleSwitch.vue'
import TableSelect from '@/components/forms/TableSelect.vue'
import FileUpload from '@/components/forms/FileUpload.vue'
import { useToast } from 'primevue'
import Label from '@/components/forms/Label.vue'
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
    raza: null,
    id_refugio: null,
    foto: null
})

interface MascotaData {
    nombre: Maybe<string>,
    edad: Maybe<number>,
    es_castrado: boolean,
    id_especie: Maybe<number>,
    id_sexo: Maybe<number>,
    imagen_url: Maybe<string>,
    observaciones: Maybe<string>,
    raza: Maybe<string>,
    id_refugio: Maybe<number>,
    foto: Maybe<File>
}

const data: Reactive<Partial<Optional<MascotaData>>> = reactive({
    nombre: null,
    edad: null,
    es_castrado: false,
    id_especie: null,
    id_sexo: null,
    imagen_url: null,
    observaciones: null,
    raza: null,
    id_refugio: null,
    foto: null
})


const toBase64 = (f: File): Promise<any> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(f);
    reader.onload = () => resolve(reader.result);
});
const emits = defineEmits<{close: []}>();
const ingresar = async (d: any) => {
        let foto = null;
        if(data.foto){
             foto = await toBase64(data.foto)
        }
        const r = await axios.post(`/animal/`, {
            ...d.values,
            foto
        });
        if([200,201].includes(r.status)){
            toast.add({severity:"success", summary:"Éxito!", detail: `${d.values.nombre} se ha dado de alta exitosamente`})
            emits('close')
        }
}

const resolver = ({ values }: { values: Partial<Optional<IMascota>> }) => {
    const errors: { [K in keyof MascotaData]: { message: string }[] } = {
        edad: [], es_castrado: [], id_especie: [], id_sexo: [], imagen_url: [], observaciones: [], raza: [],
        nombre: [], id_refugio: [],foto: []
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
                <Label required>Nombre</Label>
                <InputText fluid name="nombre"></InputText>
                <Message v-if="$form.nombre?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.nombre.error?.message }}
                </Message>
            </FormCol>
            <FormCol :span="6">
                <Label required>Raza</Label>
                <InputText fluid name="raza"></InputText>
                <Message v-if="$form.raza?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.raza.error?.message }}
                </Message>
            </FormCol>
        </FormRow>
        <FormRow>
            <FormCol :span="3">
                <Label required>Especie</Label>
                <TableSelect name="id_especie" v-model="data.id_especie" :tipo="TablaEstatica.Especie"></TableSelect>
                <Message v-if="$form.id_especie?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.id_especie.error?.message }}
                </Message>
            </FormCol>
            <FormCol :span="3">
                <Label required>Sexo</Label>
                <TableSelect name="id_sexo"  v-model="data.id_sexo" :tipo="TablaEstatica.Sexo"></TableSelect>
                <Message v-if="$form.id_sexo?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.id_sexo.error?.message }}
                </Message>
            </FormCol>
            <FormCol :span="3">
                <Label required>Edad (Aproximada)</Label>
                <InputNumber :min-fraction-digits="0" :max-fraction-digits="0" :min="0" :max="99" fluid
                             class="" name="edad"></InputNumber>
                <Message v-if="$form.edad?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.edad.error?.message }}
                </Message>
            </FormCol>
            <FormCol :span="3" modo="vertical">
                <Label class="text-surface-50 select-none">.</Label>
                <div class="flex flex-row border rounded-lg h-full w-full mx-auto gap-3 border-surface-400">
                    <Label class="my-auto ml-3">Castrado</Label>
                    <ToggleSwitch name="es_castrado" class="m-auto"></ToggleSwitch>
                </div>
            </FormCol>
        </FormRow>
        <FormRow>
            <FormCol :span="12">
                <Label>Observaciones</Label>
                <Textarea name="observaciones"></Textarea>
                <Message v-if="$form.observaciones?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.observaciones.error?.message }}
                </Message>
            </FormCol>
        </FormRow>
        <FormRow>
            <FormCol :span="12">
                <Label>Imagen</Label>
                <FileUpload v-model="data.foto"></FileUpload>
            </FormCol>
        </FormRow>
        <div class="flex flex-row justify-end gap-3">
            <Button type="submit" icon="pi pi-save" label="Guardar" icon-pos="right"></Button>
        </div>
    </Form>
</template>

<style scoped>
</style>
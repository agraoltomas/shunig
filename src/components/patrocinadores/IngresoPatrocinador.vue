<script setup lang="ts">

import { type Reactive, reactive, ref } from 'vue'
import type { IPatrocinador } from '@/lib/tipos/patrocinadores'
import { Form } from '@primevue/forms'
import axios from '@/lib/axios.ts'
import type { Maybe } from '@/lib/tipos/generics'

import FormRow from '@/components/forms/FormRow.vue'
import FormCol from '@/components/forms/FormCol.vue'
import { useToast } from '@/lib/toast/toast.ts'
import Label from '@/components/forms/Label.vue'
const toast = useToast();

type Optional<T> = { [K in keyof T]: Maybe<T[K]> }
const initialValues = reactive({
    nombre: null,
    contacto: null,
    email: null,
    descripcion: null
})

interface DatosPatrocinador {
    nombre: Maybe<string>,
    contacto: Maybe<string>,
    email: Maybe<string>,
    descripcion: Maybe<string>
}


const emits = defineEmits<{close: []}>();
const ingresarPatrocinador = async (d: any) => {
        const r = await axios.post(`/patrocinador/`, {
            ...d.values
        });
        if([200,201].includes(r.status)){
            toast.add({severity:"success", summary:"Éxito!", detail: `${d.values.nombre} se ha dado de alta exitosamente`})
            emits('close')
        }
}

const resolver = ({ values }: { values: Partial<Optional<IPatrocinador>> }) => {
    const errors: { [K in keyof DatosPatrocinador]: { message: string }[] } = {
        nombre: [], contacto: [], email: [], descripcion: []
    }

    if (!values.nombre) {
        errors.nombre.push({ message: 'El nombre es obligatorio' })
    }
    if (!values.contacto) {
        errors.contacto.push({ message: 'Los datos de contacto son obligatorios' })
    }
    if (!values.email) {
        errors.email.push({ message: 'El email es obligatorio' })
    }
    if (!values.descripcion) {
        errors.descripcion.push({ message: 'La descripción es obligatoria' })
    }
    return {
        values, // (Optional) Used to pass current form values to submit event.
        errors
    }
}

</script>

<template>
    <Form v-slot="$form" :initialValues :resolver @submit="ingresarPatrocinador" class="flex flex-col gap-4 w-full">
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
                <Label required>Datos de contacto</Label>
                <InputText fluid name="contacto"></InputText>
                <Message v-if="$form.contacto?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.contacto.error?.message }}
                </Message>
            </FormCol>
        </FormRow>
        <FormRow class="w-full">
            <FormCol :span="6">
                <Label required>Email</Label>
                <InputText fluid name="email"></InputText>
                <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.email.error?.message }}
                </Message>
            </FormCol>
            <FormCol :span="6">
                <Label required>Descripción</Label>
                <InputText fluid name="descripcion"></InputText>
                <Message v-if="$form.descripcion?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.descripcion.error?.message }}
                </Message>
            </FormCol>
        </FormRow>
        
        <div class="flex flex-row justify-end gap-3">
            <Button type="submit" icon="pi pi-save" label="Guardar" icon-pos="right"></Button>
        </div>
    </Form>
</template>

<style scoped>
</style>
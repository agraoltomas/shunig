<script setup lang="ts">
import { reactive } from 'vue'
import type { IPatrocinador } from '@/lib/tipos/patrocinadores'
import type { Maybe } from '@/lib/tipos/generics'
import { Form } from '@primevue/forms'
import axios from '@/lib/axios.ts'
import { useToast } from '@/lib/toast/toast.ts'

import FormRow from '@/components/forms/FormRow.vue'
import FormCol from '@/components/forms/FormCol.vue'
import Label from '@/components/forms/Label.vue'
import ContenedorTitulo from '@/components/generales/ContenedorTitulo.vue'

const toast = useToast()

type Optional<T> = { [K in keyof T]: Maybe<T[K]> }

interface DatosPatrocinador {
    nombre: Maybe<string>
    contacto: Maybe<string>
    email: Maybe<string>
    descripcion: Maybe<string>
}

const initialValues = reactive<DatosPatrocinador>({
    nombre: null,
    contacto: null,
    email: null,
    descripcion: null
})

const emits = defineEmits<{
    close: []
}>()

const ingresarPatrocinador = async (d: any) => {
    const r = await axios.post('/patrocinador/', {
        ...d.values
    })

    if ([200, 201].includes(r.status)) {
        toast.add({
            severity: 'success',
            summary: 'Éxito!',
            detail: `${d.values.nombre} se ha dado de alta exitosamente`
        })

        emits('close')
    }
}

const resolver = ({ values }: { values: Partial<Optional<IPatrocinador>> }) => {
    const errors: { [K in keyof DatosPatrocinador]: { message: string }[] } = {
        nombre: [],
        contacto: [],
        email: [],
        descripcion: []
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
        values,
        errors
    }
}

const cancelar = () => {
    emits('close')
}
</script>

<template>
    <Form
        v-slot="$form"
        :initialValues
        :resolver
        @submit="ingresarPatrocinador"
        class="flex flex-col gap-5 w-full"
    >
        <div class="flex flex-row justify-between items-center px-2">
            <div class="flex flex-col">
                <div class="text-gray-600">
                    Registrá una persona u organización que colabora con el refugio.
                </div>
            </div>            
        </div>

        <ContenedorTitulo
            title="Información del patrocinador"
            icon="pi pi-user"
            class="m-1"
        >
            <FormRow class="w-full">
                <FormCol :span="12">
                    <Label for="nombre" required>
                        Nombre o empresa
                    </Label>

                    <InputText
                        id="nombre"
                        fluid
                        name="nombre"
                        placeholder="Ej: Veterinaria Patitas"
                    />

                    <Message
                        v-if="$form.nombre?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.nombre.error?.message }}
                    </Message>
                </FormCol>
            </FormRow>

            <FormRow class="w-full">
                <FormCol :span="6">
                    <Label for="contacto" required>
                        Datos de contacto
                    </Label>

                    <InputText
                        id="contacto"
                        fluid
                        name="contacto"
                        placeholder="Ej: 11 5555-5555"
                    />

                    <Message
                        v-if="$form.contacto?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.contacto.error?.message }}
                    </Message>
                </FormCol>

                <FormCol :span="6">
                    <Label for="email" required>
                        Email
                    </Label>

                    <InputText
                        id="email"
                        fluid
                        name="email"
                        placeholder="Ej: contacto@empresa.com"
                    />

                    <Message
                        v-if="$form.email?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.email.error?.message }}
                    </Message>
                </FormCol>
            </FormRow>
            <FormRow class="w-full">
                <FormCol :span="12">
                    <Label for="descripcion" required>
                        Descripción
                    </Label>

                    <Textarea
                        id="descripcion"
                        fluid
                        name="descripcion"
                        :auto-resize="true"
                        rows="4"
                        placeholder="Ej: Veterinaria que colabora con alimento balanceado y productos de limpieza."
                    />

                    <Message
                        v-if="$form.descripcion?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.descripcion.error?.message }}
                    </Message>
                </FormCol>
            </FormRow>
        </ContenedorTitulo>

        
            

        <div class="flex flex-row justify-end gap-3 px-1 pt-2">
            <Button
                type="button" class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500"
                icon="pi pi-times"
                label="Cancelar"
                @click="cancelar"
            />

            <Button
                type="submit" class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500"
                icon="pi pi-save"
                label="Guardar patrocinador"
            />
        </div>
    </Form>
</template>

<style scoped>
</style>
<script setup lang="ts">
import { reactive } from 'vue'
import type { IMascota } from '@/lib/tipos/mascotas'
import type { Maybe } from '@/lib/tipos/generics'
import { Form } from '@primevue/forms'
import axios from '@/lib/axios.ts'
import { TablaEstatica } from '@/lib/tipos/estaticos.ts'
import { useToast } from '@/lib/toast/toast.ts'
import { toBase64 } from '@/lib/utils/files.ts'

import FormRow from '@/components/forms/FormRow.vue'
import FormCol from '@/components/forms/FormCol.vue'
import Label from '@/components/forms/Label.vue'
import Textarea from '@/volt/Textarea.vue'
import ToggleSwitch from '@/volt/ToggleSwitch.vue'
import TableSelect from '@/components/forms/TableSelect.vue'
import FileUpload from '@/components/forms/FileUpload.vue'
import ContenedorTitulo from '@/components/generales/ContenedorTitulo.vue'

const toast = useToast()

type Optional<T> = { [K in keyof T]: Maybe<T[K]> }

interface MascotaData {
    nombre: Maybe<string>
    edad: Maybe<number>
    es_castrado: boolean
    id_especie: Maybe<number>
    id_sexo: Maybe<number>
    imagen_url: Maybe<string>
    observaciones: Maybe<string>
    raza: Maybe<string>
    id_refugio: Maybe<number>
    foto: Maybe<File>
}

const initialValues = reactive<MascotaData>({
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

const emits = defineEmits<{
    close: []
}>()

const ingresar = async (d: any) => {
    const foto = initialValues.foto
        ? await toBase64(initialValues.foto)
        : null

    const r = await axios.post('/animal/', {
        ...d.values,
        id_especie: initialValues.id_especie,
        id_sexo: initialValues.id_sexo,
        es_castrado: initialValues.es_castrado,
        foto
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

const resolver = ({ values }: { values: Partial<Optional<IMascota>> }) => {
    const errors: { [K in keyof MascotaData]: { message: string }[] } = {
        nombre: [],
        edad: [],
        es_castrado: [],
        id_especie: [],
        id_sexo: [],
        imagen_url: [],
        observaciones: [],
        raza: [],
        id_refugio: [],
        foto: []
    }

    if (!values.nombre) {
        errors.nombre.push({ message: 'El nombre es obligatorio' })
    }

    if (!values.raza) {
        errors.raza.push({ message: 'La raza es obligatoria' })
    }

    if (values.edad === null || values.edad === undefined) {
        errors.edad.push({ message: 'Ingrese una edad aproximada' })
    }

    if (!initialValues.id_especie) {
        errors.id_especie.push({ message: 'Seleccione la especie del animal' })
    }

    if (!initialValues.id_sexo) {
        errors.id_sexo.push({ message: 'Seleccione el sexo del animal' })
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
        @submit="ingresar"
        class="flex flex-col gap-3 w-full"
    >
        <div class="flex flex-row justify-between items-center px-2">
            <div class="flex flex-col">
                <div class="text-gray-600">
                    Registrá un nuevo animal del refugio con sus datos principales, características e imagen.
                </div>
            </div>
        </div>

        <ContenedorTitulo
            title="Información del animal"
            icon="pi pi-heart"
            class="m-1"
        >
            <FormRow class="w-full">
                <FormCol :span="6">
                    <Label for="nombre" required>
                        Nombre
                    </Label>

                    <InputText
                        id="nombre"
                        fluid
                        name="nombre"
                        placeholder="Ej: Luna"
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

                <FormCol :span="6">
                    <Label for="raza" required>
                        Raza
                    </Label>

                    <InputText
                        id="raza"
                        fluid
                        name="raza"
                        placeholder="Ej: Mestizo"
                    />

                    <Message
                        v-if="$form.raza?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.raza.error?.message }}
                    </Message>
                </FormCol>
            </FormRow>

            <FormRow class="w-full">
                <FormCol :span="4">
                    <Label for="especie" required>
                        Especie
                    </Label>

                    <TableSelect
                        id="especie"
                        name="id_especie"
                        v-model="initialValues.id_especie"
                        :tipo="TablaEstatica.Especie"
                    />

                    <Message
                        v-if="$form.id_especie?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.id_especie.error?.message }}
                    </Message>
                </FormCol>

                <FormCol :span="4">
                    <Label for="sexo" required>
                        Sexo
                    </Label>

                    <TableSelect
                        id="sexo"
                        name="id_sexo"
                        v-model="initialValues.id_sexo"
                        :tipo="TablaEstatica.Sexo"
                    />

                    <Message
                        v-if="$form.id_sexo?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.id_sexo.error?.message }}
                    </Message>
                </FormCol>

                <FormCol :span="4">
                    <Label for="edad" required>
                        Edad aproximada
                    </Label>

                    <InputNumber
                        id="edad"
                        :min-fraction-digits="0"
                        :max-fraction-digits="0"
                        :min="0"
                        :max="99"
                        fluid
                        name="edad"
                    />

                    <Message
                        v-if="$form.edad?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.edad.error?.message }}
                    </Message>
                </FormCol>
            </FormRow>
        </ContenedorTitulo>

        <ContenedorTitulo
            title="Estado y características"
            icon="pi pi-info-circle"
            class="m-1"
        >
            <FormRow class="w-full">
                <FormCol :span="12">
                    <div class="flex flex-row items-center justify-between rounded-lg border border-surface-300 px-4 py-3">
                        <div>
                            <Label for="castrado">
                                Castrado
                            </Label>

                            <div class="text-sm text-gray-500">
                                Indicá si el animal ya se encuentra castrado.
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <ToggleSwitch
                                id="castrado"
                                name="es_castrado"
                                v-model="initialValues.es_castrado"
                            />

                            <span>
                                {{ initialValues.es_castrado ? 'Sí' : 'No' }}
                            </span>
                        </div>
                    </div>
                </FormCol>
            </FormRow>
        </ContenedorTitulo>

        <ContenedorTitulo
            title="Observaciones"
            icon="pi pi-pencil"
            class="m-1"
        >
            <FormRow class="w-full">
                <FormCol :span="12">
                    <Label for="observaciones" class="sr-only">
                        Observaciones
                    </Label>

                    <Textarea
                        id="observaciones" 
                        name="observaciones"
                        fluid
                        :auto-resize="true"
                        rows="3"
                        placeholder="Ej: Características de comportamiento, cuidados especiales o información relevante."
                    />

                    <Message
                        v-if="$form.observaciones?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.observaciones.error?.message }}
                    </Message>
                </FormCol>
            </FormRow>
        </ContenedorTitulo>

        <ContenedorTitulo
            title="Imagen del animal"
            icon="pi pi-image"
            class="m-1"
        >
            <FormRow class="w-full">
                <FormCol :span="12">
                    <Label for="foto" class="sr-only">
                        Imagen del animal
                    </Label>

                    <FileUpload
                        id="foto"
                        v-model="initialValues.foto"
                    />
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
                label="Guardar animal"
            />
        </div>
    </Form>
</template>

<style scoped>
</style>
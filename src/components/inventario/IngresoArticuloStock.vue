<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { Form } from '@primevue/forms'
import axios from '@/lib/axios.ts'
import type { Maybe } from '@/lib/tipos/generics'
import { TablaEstatica } from '@/lib/tipos/estaticos.ts'

import FormRow from '@/components/forms/FormRow.vue'
import FormCol from '@/components/forms/FormCol.vue'
import TableSelect from '@/components/forms/TableSelect.vue'
import { useToast } from '@/lib/toast/toast.ts'
import Label from '@/components/forms/Label.vue'
import DatePicker from '@/volt/DatePicker.vue'
import ContenedorTitulo from '@/components/generales/ContenedorTitulo.vue'
import moment from 'moment'

const toast = useToast()

type Optional<T> = { [K in keyof T]: Maybe<T[K]> }

interface DatosArticuloStock {
    marca: Maybe<string>
    cantidad: Maybe<number>
    fecha_vencimiento: Maybe<Date>
    id_origen_stock: Maybe<number>
    id_donacion: Maybe<number>
    descripcion: Maybe<string>
}

const initialValues: Partial<DatosArticuloStock> = reactive({
    marca: null,
    cantidad: null,
    fecha_vencimiento: null,
    id_origen_stock: null,
    id_donacion: null,
    descripcion: null
})

const props = defineProps<{
    id_producto: number
}>()

const emits = defineEmits<{
    close: []
}>()

const donaciones = ref<any[]>([])
const donacionSeleccionada = ref<any>(null)

const cargarDonacionesProducto = async () => {
    const r = await axios.get(`/donacion/producto/${props.id_producto}`)

    if ([200, 201].includes(r.status)) {
        donaciones.value = r.data.data
    }
}

const textoDonacion = (donacion: any) => {
    return `${donacion.nombre_patrocinador} | ${moment.utc(donacion.fecha_donacion).format('DD-MM-YYYY')}`
}

const origenDeLaDonacion = computed(() => {
    return Number(initialValues.id_origen_stock) === 2
})

onMounted(async () => {
    await cargarDonacionesProducto()
})

const ingresarArticuloAlStock = async (d: any) => {
    const r = await axios.post('/stock/', {
        ...d.values,
        id_producto: props.id_producto,
        fecha_vencimiento: initialValues.fecha_vencimiento
            ? moment(initialValues.fecha_vencimiento).format('YYYY-MM-DD')
            : null,
        id_origen_stock: initialValues.id_origen_stock,
        id_donacion: origenDeLaDonacion.value ? donacionSeleccionada.value?.id_donacion : null
    })

    if ([200, 201].includes(r.status)) {
        toast.add({
            severity: 'success',
            summary: 'Éxito!',
            detail: `${d.values.marca} se agregó al stock correctamente`
        })

        emits('close')
    }
}

const resolver = ({ values }: { values: Partial<Optional<DatosArticuloStock>> }) => {
    const errors: { [K in keyof DatosArticuloStock]: { message: string }[] } = {
        marca: [],
        cantidad: [],
        fecha_vencimiento: [],
        id_origen_stock: [],
        id_donacion: [],
        descripcion: []
    }

    if (!values.marca) {
        errors.marca.push({ message: 'La marca es obligatoria' })
    }

    if (values.cantidad === null || values.cantidad === undefined) {
        errors.cantidad.push({ message: 'Ingrese la cantidad' })
    } else if (Number(values.cantidad) <= 0) {
        errors.cantidad.push({ message: 'La cantidad debe ser mayor a 0' })
    }

    if (!initialValues.fecha_vencimiento) {
        errors.fecha_vencimiento.push({ message: 'La fecha de vencimiento es obligatoria' })
    }

    if (!initialValues.id_origen_stock) {
        errors.id_origen_stock.push({ message: 'Seleccione el origen del stock' })
    }

    if (origenDeLaDonacion.value && !donacionSeleccionada.value) {
        errors.id_donacion.push({ message: 'Debe seleccionar una donación' })
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
        @submit="ingresarArticuloAlStock"
        class="flex flex-col gap-3 w-full"
    >
        <div class="flex flex-row justify-between items-center px-2">
            <div class="flex flex-col">
                <div class="text-gray-600">
                    Registrá un nuevo artículo dentro del stock del producto seleccionado.
                </div>
            </div>
        </div>

        <ContenedorTitulo
            title="Información del artículo"
            icon="pi pi-box"
            class="m-1"
        >
            <FormRow class="w-full">
                <FormCol :span="6">
                    <Label for="marca" required>
                        Marca
                    </Label>

                    <InputText
                        id="marca"
                        fluid
                        name="marca"
                        placeholder="Ej: Royal Canin, Eukanuba, Genérico"
                    />

                    <Message
                        v-if="$form.marca?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.marca.error?.message }}
                    </Message>
                </FormCol>

                <FormCol :span="6">
                    <Label for="cantidad" required>
                        Cantidad
                    </Label>

                    <InputNumber
                        id="cantidad"
                        fluid
                        name="cantidad"
                    />

                    <Message
                        v-if="$form.cantidad?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.cantidad.error?.message }}
                    </Message>
                </FormCol>
            </FormRow>

            <FormRow class="w-full">
                <FormCol :span="6">
                    <Label for="fechaDeVencimiento" required>
                        Fecha de vencimiento
                    </Label>

                    <DatePicker
                        id="fechaDeVencimiento"
                        name="fecha_vencimiento"
                        v-model="initialValues.fecha_vencimiento"
                        showIcon
                        fluid
                        :showOnFocus="false"
                        date-format="dd-mm-yy"
                    />

                    <Message
                        v-if="$form.fecha_vencimiento?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.fecha_vencimiento.error?.message }}
                    </Message>
                </FormCol>

                <FormCol :span="6">
                    <Label for="origenStock" required>
                        Origen del stock
                    </Label>

                    <TableSelect
                        id="origenStock"
                        name="id_origen_stock"
                        v-model="initialValues.id_origen_stock"
                        :tipo="TablaEstatica.OrigenStock"
                    />

                    <Message
                        v-if="$form.id_origen_stock?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.id_origen_stock.error?.message }}
                    </Message>
                </FormCol>
            </FormRow>
            <FormRow class="w-full">
                <FormCol :span="12">
                    <Label for="donacion">
                        Donación
                    </Label>

                    <Select
                        v-if="origenDeLaDonacion"
                        id="donacion"
                        name="id_donacion"
                        fluid
                        v-model="donacionSeleccionada"
                        :options="donaciones"
                        :option-label="textoDonacion"
                        placeholder="Seleccione una donación"
                        filter
                    />

                    <InputText
                        v-else
                        fluid
                        disabled
                        model-value="No corresponde"
                    />

                    <Message
                        v-if="$form.id_donacion?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.id_donacion.error?.message }}
                    </Message>
                </FormCol>
            </FormRow>
            <FormRow class="w-full">
                <FormCol :span="12">
                    <Label for="descripcion">
                        Descripción
                    </Label>

                    <Textarea
                        id="descripcion"
                        fluid
                        name="descripcion"
                        :auto-resize="true"
                        rows="3"
                        placeholder="Ej: Lote recibido en buen estado, paquete cerrado, observaciones del ingreso."
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
                label="Guardar artículo"
            />
        </div>
    </Form>
</template>

<style scoped>
</style>
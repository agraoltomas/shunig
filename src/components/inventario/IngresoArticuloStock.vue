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
import DatePicker from "@/volt/DatePicker.vue"
import moment from 'moment'

//Cuando doy de alta un articulo del stock  


const toast = useToast();

type Optional<T> = { [K in keyof T]: Maybe<T[K]> }

const initialValues: Partial<DatosArticuloStock> = reactive({
    marca: null,
    cantidad: null,
    fecha_vencimiento: null,
    id_origen_stock: null,
    id_donacion: null,
    descripcion: null,
    registrar_recepcion: false
})

interface DatosArticuloStock {
    marca: Maybe<string>,
    cantidad: Maybe<number>,
    fecha_vencimiento: Maybe<Date>,
    id_origen_stock: Maybe<number>,
    id_donacion: Maybe<number>,
    descripcion: Maybe<string>,
    registrar_recepcion: boolean
}

const props = defineProps<{
    id_producto: number
}>()

const emits = defineEmits<{close: []}>();

const donaciones = ref([]);

const cargarDonacionesProducto = async () => {
    const r = await axios.get(`/donacion/producto/${props.id_producto}`)

    if ([200,201].includes(r.status)) {
        donaciones.value = r.data.data
    }
}

const donacionSeleccionada = ref<any>(null)

const textoDonacion = (donacion: any) => {
    return `${donacion.nombre_patrocinador} | ${moment.utc(donacion.fecha_donacion).format('DD-MM-YYYY')}`
}

const origenDeLaDonacion = computed(() => {
    return Number(initialValues.id_origen_stock) === 2;
})

onMounted(async () => {
    await cargarDonacionesProducto();
})

const ingresarArticuloAlStock = async (d: any) => {
    const r = await axios.post(`/stock/`, {
        ...d.values,
        id_producto: props.id_producto,
        fecha_vencimiento: initialValues.fecha_vencimiento
            ? moment(initialValues.fecha_vencimiento).format('YYYY-MM-DD')
            : null,
        id_origen_stock: initialValues.id_origen_stock,
        id_donacion: origenDeLaDonacion.value ? donacionSeleccionada.value?.id_donacion : null,
        registrar_recepcion: false
    })

    if ([200, 201].includes(r.status)) {
        toast.add({
            severity: "success",
            summary: "Éxito!",
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
        descripcion: [],
        registrar_recepcion:[]
    }

    if (!values.marca) {
        errors.marca.push({ message: 'La marca es obligatoria' })
    }
    if (values.cantidad === null || values.cantidad === undefined) {
        errors.cantidad.push({ message: 'Ingrese la cantidad' })
    } else if (Number(values.cantidad) < 0) {
        errors.cantidad.push({ message: 'La cantidad no puede ser negativa' })
    }
    if (!initialValues.fecha_vencimiento) {
    errors.fecha_vencimiento.push({ message: 'La fecha de vencimiento es obligatoria' })
    }

    if (!initialValues.id_origen_stock) {
    errors.id_origen_stock.push({ message: 'Seleccione el origen del stock' })
    }

    if (Number(initialValues.id_origen_stock) === 2 && !donacionSeleccionada.value) {
        errors.id_donacion.push({ message: 'Debe seleccionar una donación' })
    }

    return {
        values, // (Optional) Used to pass current form values to submit event.
        errors
    }
}

</script>

<template>
    <Form v-slot="$form" :initialValues :resolver @submit="ingresarArticuloAlStock" class="flex flex-col gap-4 w-full">
        <FormRow class="w-full">
            <FormCol :span="6">
                <Label for="marca" required>Marca</Label>
                <InputText fluid name="marca" id="marca"></InputText>
                <Message v-if="$form.marca?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.marca.error?.message }}
                </Message>
            </FormCol>

            <FormCol :span="6">
                <Label for="cantidad" required>Cantidad</Label>
                <InputNumber fluid name="cantidad" id="cantidad"></InputNumber>
                <Message v-if="$form.cantidad?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.cantidad.error?.message }}
                </Message>
            </FormCol>
        </FormRow>

        <FormRow class="w-full">
            <FormCol :span="6">
                <Label for="fechaDeVencimiento" required>Fecha de vencimiento</Label>
              <DatePicker id="fechaDeVencimiento" name="fecha_vencimiento" v-model="initialValues.fecha_vencimiento" 
              showIcon fluid :showOnFocus="false" date-format="dd-mm-yy"></DatePicker>
                <Message v-if="$form.fecha_vencimiento?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.fecha_vencimiento.error?.message }}
                </Message>
            </FormCol>

            <FormCol :span="6">
                <Label for="origenStock" required>Origen del stock</Label>
                <TableSelect id="origenStock" name="id_origen_stock" v-model="initialValues.id_origen_stock" :tipo="TablaEstatica.OrigenStock"></TableSelect>
                <Message v-if="$form.id_origen_stock?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.id_origen_stock.error?.message }}
                </Message>
            </FormCol>
        </FormRow>

        <FormRow class="w-full">
            <FormCol :span="6">
                <Label for="donacion">Donación</Label>
                <Select v-if="origenDeLaDonacion" name="id_donacion" id="donacion" fluid v-model="donacionSeleccionada"
                :options="donaciones" :option-label="textoDonacion" placeholder="Seleccione una donación" filter></Select>
                <InputText v-else fluid disabled model-value="-"></InputText>
                <Message v-if="$form.id_donacion?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.id_donacion.error?.message }}
                </Message>
            </FormCol>

            <FormCol :span="6">
                <Label for="descripcion">Descripción</Label>
                <InputText id="descripcion" fluid name="descripcion"></InputText>
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
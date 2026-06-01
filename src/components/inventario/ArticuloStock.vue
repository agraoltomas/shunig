<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import type {IStock} from "@/lib/tipos/stock"
import moment from 'moment'
import DataBlock from '@/components/generales/DataBlock.vue'
import axios from '@/lib/axios.ts'
import { useToast } from '@/lib/toast/toast.ts'
import { useModalStore } from '@/stores/modales'
import { useRouter } from 'vue-router'
import { Form, type FormResolverOptions } from '@primevue/forms'
import type { FormSubmitEvent } from '@primevue/forms/form'
import { TablaEstatica } from '@/lib/tipos/estaticos.ts'
import FormRow from '@/components/forms/FormRow.vue'
import FormCol from '@/components/forms/FormCol.vue'
import Label from '@/components/forms/Label.vue'
import TableSelect from '@/components/forms/TableSelect.vue'
import DatePicker from '@/volt/DatePicker.vue'

//Muestra todos los datos del articulo

const toast = useToast();
const modalesStore = useModalStore();
const router = useRouter();

const props = defineProps<{
    articulo: IStock
}>()

const emits = defineEmits<{
    close: []
    actualizado: []
    eliminado: []
}>();

const editando = ref(false);
//const form: TemplateRef<typeof Form> = useTemplateRef("form");

console.log('Artículo recibido en detalle:', props.articulo)
const valores = reactive({
    marca: props.articulo.marca,
    cantidad: props.articulo.cantidad,
    fecha_vencimiento: props.articulo.fecha_vencimiento ? moment.utc(props.articulo.fecha_vencimiento).toDate() : null,
    id_origen_stock: props.articulo.id_origen_stock,
    id_donacion: props.articulo.id_donacion,
    descripcion: props.articulo.descripcion
})

const donaciones = ref<any[]>([])

const cargarDonacionesProducto = async () => {
    const r = await axios.get(`/donacion/producto/${props.articulo.id_producto}`)

    if ([200, 201].includes(r.status)) {
        donaciones.value = r.data.data

        donacionSeleccionada.value = donaciones.value.find((donacion: any) => {
            return Number(donacion.id_donacion) === Number(valores.id_donacion)
        }) || null
    }
}

const donacionSeleccionada = ref<any>(null);

const textoDonacion = (donacion: any) => {
    return `${donacion.nombre_patrocinador} | 
    ${moment.utc(donacion.fecha_donacion).format('DD-MM-YYYY')}`
}

const origenDeLaDonacion = computed(() => {
    return Number(valores.id_origen_stock) === 2;
})

const detalleDonacion = () => {
    if (Number(props.articulo.id_origen_stock) !== 2) {
        return '-'
    }

    if (props.articulo.donacion_patrocinador) {
        return `${props.articulo.donacion_patrocinador} | ${formatearFecha(props.articulo.fecha_donacion)}`
    }

    return props.articulo.id_donacion ? `Donación ${props.articulo.id_donacion}` : '-'
}

onMounted(async () => {
    await cargarDonacionesProducto();
})

const formatearFecha = (fecha?: string | null) => {
    return fecha ? moment.utc(fecha).format('DD-MM-YYYY') : ''
}

const resolver = ({ values }: FormResolverOptions) => {
    const errors: { [K in keyof typeof valores]: { message: string }[] } = {
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

    if (!values.cantidad || values.cantidad <= 0) {
        errors.cantidad.push({ message: 'Ingrese una cantidad de paquetes' })    
    }

    if (!valores.fecha_vencimiento) {
    errors.fecha_vencimiento.push({ message: 'La fecha de vencimiento es obligatoria' })
    }

    if (!valores.id_origen_stock) {
    errors.id_origen_stock.push({ message: 'Seleccione el origen del stock' })
    }

    if (!values.descripcion) {
        errors.descripcion.push({ message: 'Ingrese una descripción' })
    }

    if (origenDeLaDonacion.value && !donacionSeleccionada.value) {
    errors.id_donacion.push({ message: 'Debe seleccionar una donación' })
    }

    return {
        values,
        errors
    }
}

const actualizarArticulo = async (e: FormSubmitEvent) => {
    console.log('Valores modificados del artículo:', e.values);
    const r = await axios.patch(`/stock/${props.articulo.id_stock}`, {
        ...e.values,
         cantidad: Number(e.values.cantidad),
        fecha_vencimiento: valores.fecha_vencimiento
            ? moment(valores.fecha_vencimiento).format('YYYY-MM-DD') : null,
        id_origen_stock: valores.id_origen_stock,
        id_donacion: origenDeLaDonacion.value ? donacionSeleccionada.value?.id_donacion : null
    })
    if ([200, 201].includes(r.status)) {
        const articuloActualizado = r.data.data

        Object.assign(valores, {
            marca: articuloActualizado.marca,
            cantidad: articuloActualizado.cantidad,
            fecha_vencimiento: articuloActualizado.fecha_vencimiento
                ? moment.utc(articuloActualizado.fecha_vencimiento).toDate()
                : null,
            id_origen_stock: articuloActualizado.id_origen_stock,
            id_donacion: articuloActualizado.id_donacion,
            descripcion: articuloActualizado.descripcion
        })

        toast.add({
            severity: 'success',
            summary: 'Éxito!',
            detail: 'El artículo se modificó exitosamente'
        })

        editando.value = false
        emits('actualizado')
    }
}

</script>

<template>
    <div class="flex flex-col gap-4">
        <div v-if="!editando">
            <div class="flex flex-row  gap-4 mb-4">
                <div class="rounded-lg bg-surface-300 px-2 py-1 text-lg font-semibold w-fit">
                    Código artículo | {{ articulo.codigo_articulo }}
                </div>

                <div class="rounded-lg bg-gray-200 px-2 py-1 text-lg font-semibold w-fit">
                    Fecha creación | {{ formatearFecha(articulo.fecha_creacion) }}
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <DataBlock label="Marca" :data="articulo.marca" />
                <DataBlock label="Cantidad" :data="articulo.cantidad"></DataBlock>
                <DataBlock 
                    label="Fecha vencimiento" 
                    :data="formatearFecha(articulo.fecha_vencimiento)"></DataBlock>
                <DataBlock 
                    label="Última modificación" 
                    :data="formatearFecha(articulo.fecha_modificacion)"></DataBlock>
                <DataBlock label="Origen del artículo" :data="articulo.origen_stock"></DataBlock>
               <DataBlock v-if="Number(articulo.id_origen_stock) === 2" label="Donación" :data="detalleDonacion()"></DataBlock>
            </div>

            <hr class="border-surface-500/80! my-3" />

            <DataBlock label="Descripción" :data="articulo.descripcion" />

            <div class="flex justify-between items-center pt-4">
                <Button icon="pi pi-undo" label="Volver" @click="emits('close')"></Button>

                <div class="flex gap-3">
                    <Button icon="pi pi-pencil" label="Editar" @click="editando = true"></Button>

                    <DangerButton icon="pi pi-trash" label="Eliminar" @click="modalesStore.abrir('eliminar', {
                        nombre: articulo.marca,
                        endpoint: `/stock/${articulo.id_stock}`,
                        volverPrincipal: `/refugio/inventario/producto/${articulo.id_producto}`})"></DangerButton>
                </div>
            </div>
        </div>

        <Form v-else v-slot="$form" :initialValues="valores" :resolver @submit="actualizarArticulo" class="flex flex-col mx-6 gap-3">
            <div class="flex flex-row gap-4">
                <div class="rounded-lg bg-surface-300 px-2 py-1 text-lg font-semibold w-fit">
                Código artículo | {{ articulo.codigo_articulo }}
            </div>
            <div class="rounded-lg bg-gray-200 px-2 py-1 text-lg font-semibold w-fit">
                    Fecha creación | {{ formatearFecha(articulo.fecha_creacion) }}
                </div>
            </div>
            
           <FormRow class="w-full">
                <FormCol :span="6">
                    <Label for="marca" required>Marca</Label>
                    <InputText id="marca" fluid name="marca"></InputText>
                    <Message v-if="$form.marca?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.marca.error?.message }}
                    </Message>
                </FormCol>

                <FormCol :span="6">
                    <Label for="cantidad" required>Cantidad</Label>
                    <InputText id="cantidad" fluid name="cantidad"></InputText>
                    <Message v-if="$form.cantidad?.invalid" severity="error" size="small" variant="simple">
                        {{ $form.cantidad.error?.message }}
                    </Message>
                </FormCol>
            </FormRow>

            <FormRow class="w-full">
                <FormCol :span="6">
                <Label for="vto" required>Fecha de vencimiento</Label>
                <DatePicker id="vto" name="fecha_vencimiento" v-model="valores.fecha_vencimiento" showIcon fluid :showOnFocus="false"
                    date-format="dd-mm-yy" append-to="body"></DatePicker>
                <Message v-if="$form.fecha_vencimiento?.invalid" severity="error" size="small" variant="simple">
                {{ $form.fecha_vencimiento.error?.message }}
                </Message>
            </FormCol>

            <FormCol :span="6">
                <Label for="origen" required>Origen del stock</Label>
                <TableSelect id="origen" name="id_origen_stock" v-model="valores.id_origen_stock"
                    :tipo="TablaEstatica.OrigenStock" ></TableSelect>
                <Message v-if="$form.id_origen_stock?.invalid" severity="error" size="small" variant="simple">
                 {{ $form.id_origen_stock.error?.message }}
                </Message>
            </FormCol>
        </FormRow>

        <FormRow class="w-full">
            <FormCol :span="6">
                <Label for="donacion">Donación</Label>
                <Select v-if="origenDeLaDonacion" v-model="donacionSeleccionada" :options="donaciones" 
                :option-label="textoDonacion" fluid name="id_donacion" id="donacion" placeholder="Seleccione una donación" filter></Select>
                <InputText v-else fluid disabled model-value="-"></InputText>
                <Message v-if="$form.id_donacion?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.id_donacion.error?.message }}
                </Message>
            </FormCol>

            <FormCol :span="6">
                <Label for="descripcion" required>Descripción</Label>
                <InputText id="descripcion" fluid name="descripcion"></InputText>
                <Message v-if="$form.descripcion?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.descripcion.error?.message }}
                </Message>
            </FormCol>
        </FormRow>
     <div class="flex justify-end gap-3 px-6 py-4">
        <Button type="submit" icon="pi pi-check" label="Guardar" />
        <Button type="button" icon="pi pi-times" label="Cancelar" @click="editando = false" />
    </div>
</Form>
    </div>
</template>

<style scoped>
</style>
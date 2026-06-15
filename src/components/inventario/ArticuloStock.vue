<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import type { IStock } from '@/lib/tipos/stock'
import moment from 'moment'
import axios from '@/lib/axios.ts'
import { useToast } from '@/lib/toast/toast.ts'
import { useModalStore } from '@/stores/modales'
import { Form, type FormResolverOptions } from '@primevue/forms'
import type { FormSubmitEvent } from '@primevue/forms/form'
import { TablaEstatica } from '@/lib/tipos/estaticos.ts'
import FormRow from '@/components/forms/FormRow.vue'
import FormCol from '@/components/forms/FormCol.vue'
import Label from '@/components/forms/Label.vue'
import TableSelect from '@/components/forms/TableSelect.vue'
import DatePicker from '@/volt/DatePicker.vue'
import ContenedorTitulo from '@/components/generales/ContenedorTitulo.vue'
import DangerButton from '@/volt/DangerButton.vue'
import type { IProducto } from '@/lib/tipos/productos'

const toast = useToast()
const modalesStore = useModalStore()

const props = defineProps<{
    articulo: IStock,
    nombreProducto: string
}>()

const emits = defineEmits<{
    close: []
    actualizado: []
    eliminado: []
}>()

const editando = ref(false)

const valores = reactive({
    marca: props.articulo.marca,
    cantidad: props.articulo.cantidad,
    fecha_vencimiento: props.articulo.fecha_vencimiento
        ? moment.utc(props.articulo.fecha_vencimiento).toDate()
        : null,
    id_origen_stock: props.articulo.id_origen_stock
        ? Number(props.articulo.id_origen_stock)
        : null,
    id_donacion: props.articulo.id_donacion
        ? Number(props.articulo.id_donacion)
        : null,
    descripcion: props.articulo.descripcion
})

const nombreProductoArticulo = computed(() => {
    return props.nombreProducto
})

const donaciones = ref<any[]>([])
const donacionSeleccionada = ref<any>(null)

const cargarDonacionesProducto = async () => {
    const r = await axios.get(`/donacion/producto/${props.articulo.id_producto}`)

    if ([200, 201].includes(r.status)) {
        donaciones.value = r.data.data

        donacionSeleccionada.value = donaciones.value.find((donacion: any) => {
            return Number(donacion.id_donacion) === Number(valores.id_donacion)
        }) || null
    }
}

const textoDonacion = (donacion: any) => {
    return `${donacion.nombre_patrocinador} | ${moment.utc(donacion.fecha_donacion).format('DD-MM-YYYY')}`
}

const origenDeLaDonacion = computed(() => {
    return Number(valores.id_origen_stock) === 2
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

const formatearFecha = (fecha?: string | null) => {
    return fecha ? moment.utc(fecha).format('DD-MM-YYYY') : '-'
}

const articuloVencido = computed(() => {
    if (!props.articulo.fecha_vencimiento) {
        return false
    }

    return moment.utc(props.articulo.fecha_vencimiento).isBefore(moment.utc(), 'day')
})

const articuloPorVencer = computed(() => {
    if (!props.articulo.fecha_vencimiento || articuloVencido.value) {
        return false
    }

    return moment.utc(props.articulo.fecha_vencimiento).diff(moment.utc(), 'days') <= 30
})

const estadoVencimiento = computed(() => {
    if (articuloVencido.value) {
        return {
            severity: 'danger',
            value: 'Vencido'
        }
    }

    if (articuloPorVencer.value) {
        return {
            severity: 'warn',
            value: 'Próximo a vencer'
        }
    }

    return {
        severity: 'success',
        value: 'Vigente'
    }
})

onMounted(async () => {
    await cargarDonacionesProducto()
})

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

    if (!values.cantidad || Number(values.cantidad) <= 0) {
        errors.cantidad.push({ message: 'La cantidad debe ser mayor a 0' })
    }

    if (!valores.fecha_vencimiento) {
        errors.fecha_vencimiento.push({ message: 'La fecha de vencimiento es obligatoria' })
    }

    if (!valores.id_origen_stock) {
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

const actualizarArticulo = async (e: FormSubmitEvent) => {
    const r = await axios.patch(`/stock/${props.articulo.id_stock}`, {
        ...e.values,
        cantidad: Number(e.values.cantidad),
        fecha_vencimiento: valores.fecha_vencimiento
            ? moment(valores.fecha_vencimiento).format('YYYY-MM-DD')
            : null,
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
            <!--detalle articulo-->
            <div class="shadow-[0_0_10px_rgba(0,0,0,0.18)] rounded-2xl p-5 bg-white mb-5">
                <div class="flex flex-row gap-5 grow">
                    <div class="rounded-full bg-primary-200/30 w-24 h-24 flex items-center justify-center shrink-0">
                        <i class="pi pi-box text-primary-500 text-4xl"></i>
                    </div>

                    <div class="flex flex-col gap-3 grow">
                        <div class="flex flex-row gap-4 items-center">
                            <div class="font-bold text-3xl">
                                {{ articulo.marca }}
                            </div>

                            <Tag
                                :severity="estadoVencimiento.severity"
                                :value="estadoVencimiento.value"
                            />
                        </div>

                        <div class="flex flex-row flex-wrap gap-4 pb-4 shadow-[0_0.5px_0_0_rgba(0,0,0,0.12)] w-fit">
                            <div class="flex flex-row gap-2 items-center">
                                <span class="pi pi-hashtag text-primary-500"></span>
                                <span>{{ articulo.codigo_articulo }}</span>
                            </div>

                            <div class="flex flex-row gap-2 items-center">
                                <span class="pi pi-calendar text-primary-500"></span>
                                <span>Creado el {{ formatearFecha(articulo.fecha_creacion) }}</span>
                            </div>

                            <div class="flex flex-row gap-2 items-center">
                                <span class="pi pi-clock text-primary-500"></span>
                                <span>Vence el {{ formatearFecha(articulo.fecha_vencimiento) }}</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-3 gap-4 mt-2">
                            <div class="flex flex-row gap-2 items-center">
                                <span class="pi pi-sort-numeric-up text-primary-500"></span>
                                <div>
                                    <div class="text-sm text-gray-500">Cantidad</div>
                                    <div class="font-semibold">{{ articulo.cantidad }}</div>
                                </div>
                            </div>

                            <div class="flex flex-row gap-2 items-center">
                                <span class="pi pi-warehouse text-primary-500"></span>
                                <div>
                                    <div class="text-sm text-gray-500">Origen</div>
                                    <div class="font-semibold">{{ articulo.origen_stock }}</div>
                                </div>
                            </div>

                            <div class="flex flex-row gap-2 items-center">
                                <span class="pi pi-refresh text-primary-500"></span>
                                <div>
                                    <div class="text-sm text-gray-500">Última modificación</div>
                                    <div class="font-semibold">{{ formatearFecha(articulo.fecha_modificacion) }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <!--fin detalle articulo-->
            <!--donacion-->
            <div class="shadow-[0_0_10px_rgba(0,0,0,0.18)] rounded-2xl p-5 bg-white mb-5">
                <div class="flex flex-row text-xl gap-3">
                <div class="bg-primary-200/30 rounded-full p-1 min-w-9 h-fit text-center">
                    <i class="pi pi-gift text-primary-500"></i>
                </div>

                <div class="font-semibold h-fit my-auto">
                    Donación asociada
                </div>
            </div>

            <div class="p-3 text-gray-700 font-semibold">
                {{ detalleDonacion() }}
            </div>

            </div>

            <!--fin donacion-->
            <!--descripcion-->
            <div class="shadow-[0_0_10px_rgba(0,0,0,0.18)] rounded-2xl p-5 bg-white mb-5">
                <div class="flex flex-row text-xl gap-3">
                <div class="bg-primary-200/30 rounded-full p-1 min-w-9 h-fit text-center">
                    <i class="pi pi-align-left text-primary-500"></i>
                </div>

                <div class="font-semibold h-fit my-auto">
                    Descripción
                </div>
            </div>

            <div class="p-3">
                <Textarea
                    fluid
                    disabled
                    :value="articulo.descripcion"
                    :auto-resize="true"
                    rows="3"
                />
            </div>


            </div>

            <!--fin descripcion-->
            <div class="flex justify-between gap-6">              

                    <Button
                        class="!bg-transparent !border-refugio-500 !text-refugio-500 hover:!bg-refugio-200" outlined
                        fluid
                        severity="secondary"
                        icon="pi pi-undo"
                        label="Volver"
                        @click="emits('close')"
                    />

                    <Button
                        fluid outlined
                        severity="success"
                        icon="pi pi-pencil"
                        label="Editar"
                        @click="editando = true"
                    />

                    <DangerButton
                        fluid outlined
                        icon="pi pi-trash"
                        label="Eliminar"
                        @click="modalesStore.abrir('eliminar', {
                            nombre: articulo.marca,
                            endpoint: `/stock/${articulo.id_stock}`,
                            volverPrincipal: `/refugio/inventario/producto/${articulo.id_producto}`
                        })"
                    />
            </div>
        </div>
       
        <!-- EDICIÓN -->
        <div
            v-else
            class="shadow-[0_0_10px_rgba(0,0,0,0.18)] rounded-2xl p-5 bg-white"
        >
            <div class="flex flex-row justify-between items-center mb-5">
                <div>
                    <div class="text-3xl font-bold mb-2">
                        Editar artículo 
                    </div>
                    <div class="text-xl mb-2">
    <span>
        <span>{{ articulo.marca}}</span>
        <span class="pi pi-hashtag text-primary-500 ml-2 mr-2"></span>
        <span>{{ articulo.codigo_articulo }}</span>
    </span>
</div>
                  

                    <div class="text-gray-500">
                        Modificá los datos del artículo registrado en stock.
                    </div>
                </div>

                <div class="rounded-full bg-primary-200/30 w-20 h-20 flex items-center justify-center">
                    <i class="pi pi-box text-primary-500 text-3xl"></i>
                </div>
            </div>

            <Form
                v-slot="$form"
                :initialValues="valores"
                :resolver
                @submit="actualizarArticulo"
                class="flex flex-col gap-3"
            >
                
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
                            <Label for="vto" required>
                                Fecha de vencimiento
                            </Label>

                            <DatePicker
                                id="vto"
                                name="fecha_vencimiento"
                                v-model="valores.fecha_vencimiento"
                                showIcon
                                fluid
                                :showOnFocus="false"
                                date-format="dd-mm-yy"
                                append-to="body"
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
                            <Label for="origen" required>
                                Origen del stock
                            </Label>

                            <TableSelect
                                id="origen"
                                name="id_origen_stock"
                                v-model="valores.id_origen_stock"
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
                </ContenedorTitulo>

                <ContenedorTitulo
                    title="Donación asociada"
                    icon="pi pi-gift"
                    class="m-1"
                >
                    <FormRow class="w-full">
                        <FormCol :span="12">
                            <Label class="sr-only" for="donacion">
                                Donación
                            </Label>

                            <Select
                                v-if="origenDeLaDonacion"
                                v-model="donacionSeleccionada"
                                :options="donaciones"
                                :option-label="textoDonacion"
                                fluid
                                name="id_donacion"
                                id="donacion"
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
                </ContenedorTitulo>

                <ContenedorTitulo
                    title="Descripción"
                    icon="pi pi-pencil"
                    class="m-1"
                >
                    <FormRow class="w-full">
                        <FormCol :span="12">
                            <Label class="sr-only" for="descripcion">
                                Descripción
                            </Label>

                            <Textarea
                                id="descripcion"
                                fluid
                                name="descripcion"
                                :auto-resize="true"
                                rows="3"
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

                <div class="flex justify-end gap-3 px-1 pt-2">
                    <Button
                        type="button" class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500"
                        icon="pi pi-times"
                        label="Cancelar"
                        @click="editando = false"
                    />

                    <Button
                        type="submit" class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500"
                        icon="pi pi-check"
                        label="Guardar"
                    />
                </div>
            </Form>
        </div>
    </div>
</template>

<style scoped>
</style>
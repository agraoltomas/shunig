<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import type { IProducto } from '@/lib/tipos/productos'
import type { IStock } from '@/lib/tipos/stock'
import moment from 'moment'
import DataTable from '@/volt/DataTable.vue'
import FormRow from '@/components/forms/FormRow.vue'
import FormCol from '@/components/forms/FormCol.vue'
import Label from '@/components/forms/Label.vue'
import axios from '@/lib/axios.ts'
import { useToast } from '@/lib/toast/toast.ts'
import { useModalStore } from '@/stores/modales'
import { Form, type FormResolverOptions } from '@primevue/forms'
import type { FormSubmitEvent } from '@primevue/forms/form'
import { TablaEstatica } from '@/lib/tipos/estaticos.ts'
import TableSelect from '@/components/forms/TableSelect.vue'
import ToggleSwitch from '@/volt/ToggleSwitch.vue'
import DangerButton from '@/volt/DangerButton.vue'

const toast = useToast()
const modalesStore = useModalStore()

const props = defineProps<{
    producto: IProducto
}>()

const emits = defineEmits<{
    actualizado: [producto: IProducto]
    eliminado: []
}>()

const editando = ref(false)
const articulosDelStock = ref<IStock[]>([])

const valores = reactive({
    nombre: props.producto.nombre,
    id_tipo_producto: props.producto.id_tipo_producto
        ? Number(props.producto.id_tipo_producto)
        : null,
    descripcion: props.producto.descripcion,
    id_unidad_stock: props.producto.id_unidad_stock
        ? Number(props.producto.id_unidad_stock)
        : null,
    medida: props.producto.medida,
    cantidad_alerta_baja: props.producto.cantidad_alerta_baja,
    cantidad_alerta_moderada: props.producto.cantidad_alerta_moderada,
    alerta_stock_activa: props.producto.alerta_stock_activa
})

const cantidadTotal = computed(() => {
    return articulosDelStock.value.reduce((total, articulo) => {
        return total + Number(articulo.cantidad || 0)
    }, 0)
})

const cantidadTotalConUnidad = computed(() => {
    return `${cantidadTotal.value} ${props.producto.unidad_stock || ''}`
})

const estadoAlertaStock = computed(() => {
    if (!props.producto.alerta_stock_activa) {
        return {
            severity: 'secondary',
            value: 'Alerta desactivada'
        }
    }

    const cantidad = Number(cantidadTotal.value || 0)
    const cantidadBaja = Number(props.producto.cantidad_alerta_baja || 0)
    const cantidadModerada = Number(props.producto.cantidad_alerta_moderada || 0)

    if (cantidad <= cantidadBaja) {
        return {
            severity: 'danger',
            value: 'Stock bajo'
        }
    }

    if (cantidad <= cantidadModerada) {
        return {
            severity: 'warn',
            value: 'Stock moderado'
        }
    }

    return {
        severity: 'success',
        value: 'Stock suficiente'
    }
})

const ultimaActualizacionProducto = computed(() => {
    const fechas = [
        props.producto.fecha_modificacion,
        ...articulosDelStock.value.map((articulo) => articulo.fecha_modificacion || articulo.fecha_creacion)
    ].filter(Boolean)

    if (fechas.length === 0) {
        return null
    }

    return fechas.reduce((fechaMasReciente, fechaActual) => {
        return moment.utc(fechaActual).isAfter(moment.utc(fechaMasReciente))
            ? fechaActual
            : fechaMasReciente
    })
})

const articulosPorVencer = computed(() => {
    return articulosDelStock.value.filter((articulo) => {
        if (!articulo.fecha_vencimiento) {
            return false
        }

        const fechaVencimiento = moment.utc(articulo.fecha_vencimiento)
        const hoy = moment.utc()

        return fechaVencimiento.isSameOrAfter(hoy) && fechaVencimiento.diff(hoy, 'days') <= 30
    }).length
})

const cantidadPorVencer = computed(() => {
    return articulosDelStock.value
        .filter((articulo) => {
            if (!articulo.fecha_vencimiento) {
                return false
            }

            const fechaVencimiento = moment.utc(articulo.fecha_vencimiento)
            const hoy = moment.utc()

            return fechaVencimiento.isSameOrAfter(hoy) && fechaVencimiento.diff(hoy, 'days') <= 30
        })
        .reduce((total, articulo) => {
            return total + Number(articulo.cantidad || 0)
        }, 0)
})

const inicialesProducto = (nombre: string) => {
    return nombre
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((parte) => parte[0])
        .join('')
        .toUpperCase()
}

const formatearFecha = (fecha?: string | null) => {
    return fecha ? moment.utc(fecha).format('DD-MM-YYYY') : '-'
}

const agregarStockProducto = async () => {
    const r = await axios.get(`/stock/producto/${props.producto.id_producto}`)

    if (r.status === 200) {
        articulosDelStock.value = r.data.data
    }
}

onMounted(async () => {
    await agregarStockProducto()
})

const actualizarProducto = async (e: FormSubmitEvent) => {
    if (!props.producto) return

    const r = await axios.patch(`/producto/${props.producto.id_producto}`, {
        ...e.values
    })

    if ([200, 201].includes(r.status)) {
        const productoActualizado = r.data.data

        Object.assign(valores, {
            nombre: productoActualizado.nombre,
            id_tipo_producto: productoActualizado.id_tipo_producto,
            descripcion: productoActualizado.descripcion,
            id_unidad_stock: productoActualizado.id_unidad_stock,
            medida: productoActualizado.medida,
            cantidad_alerta_baja: productoActualizado.cantidad_alerta_baja,
            cantidad_alerta_moderada: productoActualizado.cantidad_alerta_moderada,
            alerta_stock_activa: productoActualizado.alerta_stock_activa
        })

        toast.add({
            severity: 'success',
            summary: 'Éxito!',
            detail: `${e.values.nombre} se modificó exitosamente`
        })

        editando.value = false
        emits('actualizado', productoActualizado)
    }
}

const resolver = ({ values }: FormResolverOptions) => {
    const errors: { [K in keyof typeof valores]: { message: string }[] } = {
        nombre: [],
        id_tipo_producto: [],
        descripcion: [],
        id_unidad_stock: [],
        medida: [],
        cantidad_alerta_baja: [],
        cantidad_alerta_moderada: [],
        alerta_stock_activa: []
    }

    if (!values.nombre) {
        errors.nombre.push({ message: 'El nombre es obligatorio' })
    }

    if (!values.id_tipo_producto) {
        errors.id_tipo_producto.push({ message: 'Seleccione un tipo de producto' })
    }

    if (!values.descripcion) {
        errors.descripcion.push({ message: 'Ingrese una descripción' })
    }

    if (!values.id_unidad_stock) {
        errors.id_unidad_stock.push({ message: 'Seleccione la unidad del producto' })
    }

    if (!values.medida) {
        errors.medida.push({ message: 'Ingrese la medida' })
    }

    if (values.cantidad_alerta_baja === null || values.cantidad_alerta_baja === undefined) {
        errors.cantidad_alerta_baja.push({ message: 'Ingrese la alerta baja' })
    }

    if (values.cantidad_alerta_moderada === null || values.cantidad_alerta_moderada === undefined) {
        errors.cantidad_alerta_moderada.push({ message: 'Ingrese la alerta moderada' })
    } else if (Number(values.cantidad_alerta_moderada) <= Number(values.cantidad_alerta_baja)) {
        errors.cantidad_alerta_moderada.push({ message: 'La alerta moderada debe ser mayor a la baja' })
    }

    return {
        values,
        errors
    }
}
</script>
<!--Vista del producto-->
<template>
    <div class="w-[75vw] m-auto flex flex-col gap-4 min-h-screen w-3/4 m-auto mt-5 mb-15">
        <!-- Detalle principal con edición y sin edición-->
        <div
            v-if="producto"
            class="shadow-[0_0_10px_rgba(0,0,0,0.18)] rounded-2xl p-5 bg-white"
        >
            <div v-if="!editando" class="gap-6">
                <div class="flex flex-row justify-between items-center gap-4 pb-4 mb-5 border-b border-gray-200">
        <span class="font-bold text-2xl">
            Detalle del producto
        </span>
        <!--Seccion botones-->
        <div class="flex flex-row gap-3">
            <Button
                class="!bg-transparent !border-refugio-500 !text-refugio-500 hover:!bg-refugio-200"
                outlined
                severity="secondary"
                icon="pi pi-undo"
                label="Volver"
                @click="$router.go(-1)"
            />

            <Button
                outlined
                severity="success"
                icon="pi pi-pencil"
                label="Editar"
                @click="editando = true"
            />

            <DangerButton
                outlined
                icon="pi pi-trash"
                label="Eliminar"
                @click="modalesStore.abrir('eliminar', {
                    nombre: producto.nombre,
                    endpoint: `/producto/${producto.id_producto}`,
                    volverPrincipal: '/refugio/inventario'
                })"
            />
        </div>
        <!--fin seccion botones-->
    </div>
    <div class="flex flex-row gap-5 grow">
        <div class="rounded-full bg-primary-200/30 w-28 h-28 flex items-center justify-center shrink-0">
            <div class="text-primary-500 text-4xl font-bold">
                {{ inicialesProducto(producto.nombre) }}
            </div>
        </div>

        <div class="flex flex-col gap-3 grow">
            <div class="flex flex-row gap-4 items-center">
                <div class="font-bold text-3xl">
                    {{ producto.nombre }}
                </div>

                <Tag severity="success" :value="producto.tipo_producto" />
                <Tag :severity="estadoAlertaStock.severity" :value="estadoAlertaStock.value"/>
            </div>

            <div class="flex flex-row flex-wrap gap-4 pb-4 shadow-[0_0.5px_0_0_rgba(0,0,0,0.12)] w-fit">
                <div class="flex flex-row gap-2 items-center">
                    <span class="pi pi-hashtag text-primary-500"></span>
                    <span>{{ producto.codigo_producto }}</span>
                </div>

                <div class="flex flex-row gap-2 items-center">
                    <span class="pi pi-calendar text-primary-500"></span>
                    <span>{{ formatearFecha(producto.fecha_alta) }}</span>
                </div>

                <div class="flex flex-row gap-2 items-center">
                    <span class="pi pi-box text-primary-500"></span>
                    <span>{{ cantidadTotalConUnidad }}</span>
                </div>
            </div>

            <div class="grid grid-cols-3 gap-4 mt-2">
                <div class="flex flex-row gap-2 items-center">
                    <span class="pi pi-warehouse text-primary-500"></span>
                    <div>
                        <div class="text-sm text-gray-500">Unidad</div>
                            <div class="font-semibold">
                                {{ producto.unidad_stock || '-' }}
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-row gap-2 items-center">
                        <span class="pi pi-tag text-primary-500"></span>
                        <div>
                            <div class="text-sm text-gray-500">Medida</div>
                                <div class="font-semibold">
                                    {{ producto.medida || '-' }}
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-row gap-2 items-center">
                            <span class="pi pi-clock text-primary-500"></span>
                            <div>
                                <div class="text-sm text-gray-500">Última actualización</div>
                                    <div class="font-semibold">
                                        {{ formatearFecha(ultimaActualizacionProducto) }}
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <!-- edición -->
        <div v-else>
            <div class="flex flex-row justify-between items-center mb-5">
                <div>
                    <div class="text-3xl font-bold mb-2">
                        Editar producto
                    </div>
                    <div class="text-xl mb-2">
                        <span>
                            <span>{{ producto.nombre}}</span>
                        <span class="pi pi-hashtag text-primary-500 ml-2 mr-2"></span>
                                <span>{{ producto.codigo_producto }}</span>
                        </span>                        
                    </div>

                    <div class="text-gray-500">
                            Modificá los datos generales, la unidad y las alertas del producto.
                    </div>
                </div>

                <div class="rounded-full bg-primary-200/30 w-20 h-20 flex items-center justify-center">
                        <i class="pi pi-box text-primary-500 text-3xl"></i>
                </div>
            </div>

            <Form
                    ref="form"
                    v-slot="$form"
                    :initialValues="valores"
                    :resolver
                    @submit="actualizarProducto"
                    class="flex flex-col gap-4">

                <div class="shadow-[0_0_10px_rgba(0,0,0,0.10)] rounded-2xl p-4">
                        <div class="flex flex-row text-xl gap-3 mb-4">
                            <div class="bg-primary-200/30 rounded-full p-1 min-w-9 h-fit text-center">
                                <i class="pi pi-box text-primary-500"></i>
                            </div>

                            <div class="font-semibold h-fit my-auto">
                                Datos principales
                            </div>
                        </div>

                        <FormRow class="w-full mb-5">
                            <FormCol :span="6">
                                <Label for="nombre" required>Nombre</Label>
                                <InputText id="nombre" fluid name="nombre" />
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
                                <Label for="tipoProducto" required>Tipo de producto</Label>
                                <TableSelect
                                    id="tipoProducto"
                                    name="id_tipo_producto"
                                    :tipo="TablaEstatica.Producto"
                                />
                                <Message
                                    v-if="$form.id_tipo_producto?.invalid"
                                    severity="error"
                                    size="small"
                                    variant="simple"
                                >
                                    {{ $form.id_tipo_producto.error?.message }}
                                </Message>
                            </FormCol>
                        </FormRow>

                        <FormRow class="w-full">
                            <FormCol :span="6">
                                <Label for="unidad" required>Unidad</Label>
                                <TableSelect
                                    id="unidad"
                                    name="id_unidad_stock"
                                    :tipo="TablaEstatica.UnidadStock"
                                />
                                <Message
                                    v-if="$form.id_unidad_stock?.invalid"
                                    severity="error"
                                    size="small"
                                    variant="simple"
                                >
                                    {{ $form.id_unidad_stock.error?.message }}
                                </Message>
                            </FormCol>

                            <FormCol :span="6">
                                <Label for="medida" required>Medida</Label>
                                <InputText id="medida" fluid name="medida" />
                                <Message
                                    v-if="$form.medida?.invalid"
                                    severity="error"
                                    size="small"
                                    variant="simple"
                                >
                                    {{ $form.medida.error?.message }}
                                </Message>
                            </FormCol>
                        </FormRow>
                    </div>

                    <div class="shadow-[0_0_10px_rgba(0,0,0,0.10)] rounded-2xl p-4">
                        <div class="flex flex-row text-xl gap-3 mb-4">
                            <div class="bg-primary-200/30 rounded-full p-1 min-w-9 h-fit text-center">
                                <i class="pi pi-bell text-primary-500"></i>
                            </div>

                            <div class="font-semibold h-fit my-auto">
                                Configuración de alertas
                            </div>
                        </div>

                        <FormRow class="w-full">
                            <FormCol :span="4">
                                <Label for="cantidadBaja" required>Cantidad mínima</Label>
                                <InputNumber id="cantidadBaja" fluid name="cantidad_alerta_baja" />
                                <Message
                                    v-if="$form.cantidad_alerta_baja?.invalid"
                                    severity="error"
                                    size="small"
                                    variant="simple"
                                >
                                    {{ $form.cantidad_alerta_baja.error?.message }}
                                </Message>
                            </FormCol>

                            <FormCol :span="4">
                                <Label for="cantidadModerada" required>Cantidad moderada</Label>
                                <InputNumber id="cantidadModerada" fluid name="cantidad_alerta_moderada" />
                                <Message
                                    v-if="$form.cantidad_alerta_moderada?.invalid"
                                    severity="error"
                                    size="small"
                                    variant="simple"
                                >
                                    {{ $form.cantidad_alerta_moderada.error?.message }}
                                </Message>
                            </FormCol>

                            <FormCol :span="4">
                                <Label for="alertaStockActiva">Alertas activas</Label>
                                <div class="flex items-center gap-2 h-[42px]">
                                    <ToggleSwitch
                                        id="alertaStockActiva" name="alerta_stock_activa"
                                        v-model="valores.alerta_stock_activa"
                                    />
                                    <span>
                                        {{ valores.alerta_stock_activa ? 'Sí' : 'No' }}
                                    </span>
                                </div>
                            </FormCol>
                        </FormRow>
                    </div>

                    <div class="shadow-[0_0_10px_rgba(0,0,0,0.10)] rounded-2xl p-4">
                        <div class="flex flex-row text-xl gap-3 mb-4">
                            <div class="bg-primary-200/30 rounded-full p-1 min-w-9 h-fit text-center">
                                <i class="pi pi-pencil text-primary-500"></i>
                            </div>

                            <div class="font-semibold h-fit my-auto">
                                Descripción
                            </div>
                        </div>

                        <FormRow class="w-full">
                            <FormCol :span="12">
                                <Label for="descripcion" class="sr-only" required>Descripción</Label>
                                <Textarea
                                    id="descripcion"
                                    fluid
                                    name="descripcion"
                                    :auto-resize="true"
                                    rows="4"
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
                    </div>

                    <div class="flex justify-end gap-3 py-2">
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

        <!-- descripcion del producto -->
        <div
            v-if="producto && !editando"
            class="shadow-[0_0_10px_rgba(0,0,0,0.18)] rounded-2xl p-5 bg-white"
        >
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
                    :value="producto.descripcion"
                    :auto-resize="true"
                    rows="3"
                />
            </div>
        </div>
        <!--fin descripcion-->

        <!-- alertas -->
        <div
            v-if="producto && !editando"
            class="shadow-[0_0_10px_rgba(0,0,0,0.18)] rounded-2xl p-5 bg-white"
        >
            <div class="flex flex-row text-xl gap-3 mb-4">
                <div class="bg-primary-200/30 rounded-full p-1 min-w-9 h-fit text-center">
                    <i class="pi pi-bell text-primary-500"></i>
                </div>

                <div class="font-semibold h-fit my-auto">
                    Alertas de stock
                </div>
            </div>

            <div class="grid grid-cols-3 gap-4">
                <div class="rounded-xl border border-gray-200 p-4">
                    <div class="text-sm text-gray-500">Cantidad mínima</div>
                    <div class="text-2xl font-bold text-gray-700">
                        {{ producto.cantidad_alerta_baja ?? '-' }}
                    </div>
                </div>

                <div class="rounded-xl border border-gray-200 p-4">
                    <div class="text-sm text-gray-500">Cantidad moderada</div>
                    <div class="text-2xl font-bold text-gray-700">
                        {{ producto.cantidad_alerta_moderada ?? '-' }}
                    </div>
                </div>

                <div class="rounded-xl border border-gray-200 p-4">
                    <div class="text-sm text-gray-500">Alertas activas</div>
                    <div class="text-2xl font-bold text-gray-700">
                        {{ producto.alerta_stock_activa ? 'Sí' : 'No' }}
                    </div>
                </div>
            </div>
        </div>
        <!--fin alertas-->

        <!-- Stock del producto -->
        <div
            v-if="producto && !editando"
            class="shadow-[0_0_10px_rgba(0,0,0,0.18)] rounded-2xl p-5 bg-white"
        >
            <div class="flex flex-row justify-between items-center mb-4">
                <div class="flex flex-row text-xl gap-3">
                    <div class="bg-primary-200/30 rounded-full p-1 min-w-9 h-fit text-center">
                        <i class="pi pi-warehouse text-primary-500"></i>
                    </div>

                    <div class="font-semibold h-fit my-auto">
                        Stock
                    </div>
                </div>

                <div class="flex flex-row gap-2">
                    <Tag
                        severity="info"
                        :value="`${cantidadTotal} artículos`"
                    />

                    <Tag
                        v-if="articulosPorVencer > 0"
                        severity="warn"
                        :value="`${cantidadPorVencer} por vencer`"
                    />
                </div>
            </div>

            <DataTable :value="articulosDelStock">
                <template #empty>
                    <div class="m-auto text-gray-500 w-fit p-3">
                        No hay artículos cargados en stock
                    </div>
                </template>

                <Column header="Código artículo" field="codigo_articulo" style="width:18%"></Column>

                <Column header="Marca" field="marca" style="width:20%"></Column>

                <Column header="Fecha vencimiento" style="width:18%">
                    <template #body="{ data: articulo }">
                        {{ formatearFecha(articulo.fecha_vencimiento) }}
                    </template>
                </Column>

                <Column header="Cantidad" style="width:15%">
                    <template #body="{ data: articulo }">
                        {{ articulo.cantidad }} {{ producto.unidad_stock || '' }}
                    </template>
                </Column>

                <Column header="Acciones" style="width:12%">
                    <template #body="{ data }">
                        <Button
    icon="pi pi-eye"
    class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500"
    severity="secondary"
    @click="() => modalesStore.abrir('verArticuloStock', {
        articulo: data,
        nombreProducto: props.producto.nombre,
        actualizaStock: agregarStockProducto,
        eliminaStock: agregarStockProducto
    })"
/>
                    </template>
                </Column>
            </DataTable>

            <div class="flex justify-end mt-4">
                <Button
                    icon="pi pi-plus" class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500"
                    icon-pos="left"
                    label="Agregar artículo al stock"
                    severity="success"
                    @click="modalesStore.abrir('nuevoArticuloStock', {
                        id_producto: producto.id_producto,
                        actualizaStock: agregarStockProducto
                    })"
                />
            </div>
        </div>
        <!--fin stock del producto-->
    </div>
</template>

<style scoped>
</style>
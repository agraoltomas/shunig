<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import moment from 'moment'
import DataTable from '@/volt/DataTable.vue'
import MultiSelect from '@/volt/MultiSelect.vue'
import { useModalStore } from '@/stores/modales.ts'
import type { IProducto } from '@/lib/tipos/productos'
import type { IPatrocinador } from '@/lib/tipos/patrocinadores'
import { useRouter } from 'vue-router'
import { EAlerta } from '../generales/alertas'
import axios from '@/lib/axios.ts'
import { useToast } from '@/lib/toast/toast.ts'
import AlertaSmall from '@/components/generales/AlertaSmall.vue'
import Contenedor from '@/components/generales/Contenedor.vue'
import Avatar from '@/volt/Avatar.vue'
import { IconField } from 'primevue'

const router = useRouter()
const toast = useToast()
const modalesStore = useModalStore()

const props = withDefaults(defineProps<{
    productos?: IProducto[]
    patrocinadores?: IPatrocinador[]
}>(), {
    productos: () => [],
    patrocinadores: () => []
})

const busqueda = ref('')

const patrocinadoresPorProducto = reactive<Record<number, number[]>>({})

const productosFiltrados = computed(() => {
    const texto = busqueda.value.trim().toLowerCase()

    if (!texto) {
        return props.productos
    }

    return props.productos.filter((producto) => {
        return [
            producto.codigo_producto,
            producto.nombre,
            producto.tipo_producto,
            producto.descripcion,
            producto.unidad_stock,
            producto.medida
        ].some((valor) => valor?.toLowerCase().includes(texto))
    })
})

const totalProductos = computed(() => {
    return props.productos.length
})

const totalStock = computed(() => {
    return props.productos.reduce((total, producto) => {
        return total + Number(producto.cantidad || 0)
    }, 0)
})

const productosConAlerta = computed(() => {
    return props.productos.filter((producto) => {
        const alerta = obtenerAlertaStock(producto)
        return alerta === EAlerta.StockBajo || alerta === EAlerta.StockModerado
    }).length
})

const opcionesPatrocinadores = computed(() => {
    return props.patrocinadores.map((patrocinador) => ({
        label: patrocinador.nombre,
        value: patrocinador.id_patrocinador
    }))
})

const obtenerAlertaStock = (producto: IProducto) => {
    if (!producto.alerta_stock_activa) {
        return null
    }

    const cantidad = Number(producto.cantidad || 0)
    const cantidadBaja = Number(producto.cantidad_alerta_baja || 0)
    const cantidadModerada = Number(producto.cantidad_alerta_moderada || 0)

    if (cantidad <= cantidadBaja) {
        return EAlerta.StockBajo
    }

    if (cantidad <= cantidadModerada) {
        return EAlerta.StockModerado
    }

    return EAlerta.StockAlto
}

const solicitarDonacion = async (producto: IProducto) => {
    const patrocinadoresSeleccionados = patrocinadoresPorProducto[producto.id_producto] || []

    if (patrocinadoresSeleccionados.length === 0) {
        toast.add({
            severity: 'warn',
            summary: 'Atención',
            detail: 'Debe seleccionar al menos un patrocinador'
        })

        return
    }

    const r = await axios.post('/solicitud-donacion', {
        id_producto: producto.id_producto,
        patrocinadores: patrocinadoresSeleccionados
    })

    if ([200, 201].includes(r.status)) {
        toast.add({
            severity: 'success',
            summary: 'Solicitud enviada',
            detail: 'Se enviaron los correos a los patrocinadores seleccionados'
        })

        patrocinadoresPorProducto[producto.id_producto] = []
    }
}

const formatearFecha = (fecha?: string | null) => {
    return fecha ? moment.utc(fecha).format('DD-MM-YYYY') : '-'
}

const cantidadProducto = (producto: IProducto) => {
    return `${producto.cantidad ?? 0} ${producto.unidad_stock || ''} (${producto.medida || ''})`
}

const cantidadPorVencer = computed(() => {
    return props.productos.reduce((total, producto) => {
        return total + Number(producto.cantidad_por_vencer || 0)
    }, 0)
})
</script>

<template>
    <div class="p-4">
        <div class="flex flex-col gap-5">
            <!-- Descripción + botón -->
            <div class="flex justify-between items-center gap-4">
                <p class="text-gray-500">
                    Productos disponibles en el inventario del refugio y control de stock.
                </p>

                <Button
                    icon="pi pi-plus"
                    label="Agregar producto"
                    class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500 "
                    severity="success"
                    @click="modalesStore.abrir('nuevoProducto')"
                />
            </div>

            <!-- Buscador -->
            <div class="flex gap-3 items-center">
                <IconField class="w-96">
                    <InputText
                        v-model="busqueda"
                        class="w-full"
                        placeholder="Buscar por código, producto o tipo..."
                    />
                </IconField>
            </div>

            <!-- Tabla -->
            <DataTable
                :value="productosFiltrados"
                paginator
                :rows="10"
                stripedRows
                class="rounded-lg overflow-hidden"
            >
                <template #empty>
                    <div class="text-center text-gray-500 p-4">
                        No hay productos registrados
                    </div>
                </template>

                <Column header="Producto" style="width: 25%">
                    <template #body="{ data: producto }">
                        <div class="flex items-center gap-3">
                            <Avatar
                                :label="producto.codigo_producto?.slice(0, 2).toUpperCase()"
                                shape="circle"
                                class="bg-primary-100 text-primary-700"
                            />

                            <div>
                                <div class="font-semibold text-gray-700">
                                    {{ producto.nombre }}
                                </div>

                                <div class="text-sm text-gray-500">
                                    {{ producto.codigo_producto }}
                                </div>
                            </div>
                        </div>
                    </template>
                </Column>

                <Column header="Tipo" field="tipo_producto" style="width: 14%" />

                <Column header="Cantidad total" style="width: 13%">
                    <template #body="{ data: producto }">
                        <span class="font-semibold">
                            {{ cantidadProducto(producto) }}
                        </span>
                    </template>
                </Column>

                <Column header="Última actualización" style="width: 14%">
                    <template #body="{ data: producto }">
                        {{ formatearFecha(producto.fecha_modificacion) }}
                    </template>
                </Column>

                <Column header="Alertas" style="width: 14%">
                    <template #body="{ data: producto }">
                        <AlertaSmall
                            v-if="obtenerAlertaStock(producto) !== null"
                            :tipo="obtenerAlertaStock(producto)!"
                        />
                        <span v-else>-</span>
                    </template>
                </Column>

                <Column header="Solicitar donación" style="width: 18%">
                    <template #body="{ data: producto }">
                        <MultiSelect
                            v-model="patrocinadoresPorProducto[producto.id_producto]"
                            :options="opcionesPatrocinadores"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Seleccionar"
                            filter
                            class="w-full"
                        >
                            <template #value>
                                <span>Seleccionar</span>
                            </template>

                            <template #footer>
                                <div class="flex justify-end p-3 border-t border-surface-200">
                                    <Button
                                        size="small"
                                        class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500"
                                        icon="pi pi-send"
                                        label="Solicitar"
                                        severity="success"
                                        :disabled="!(patrocinadoresPorProducto[producto.id_producto]?.length)"
                                        @click.stop="solicitarDonacion(producto)"
                                    />
                                </div>
                            </template>
                        </MultiSelect>
                    </template>
                </Column>

                <Column header="Acciones" style="width: 10%">
                    <template #body="{ data }">
                        <div class="flex gap-2">
                            <Button
                                icon="pi pi-eye"
                                class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500"

                                severity="secondary"
                                @click="router.push(`/refugio/inventario/producto/${data.id_producto}`)"
                            />
                        </div>
                    </template>
                </Column>
            </DataTable>

            <div class="text-sm text-gray-500">
                Mostrando {{ productosFiltrados.length }} de {{ totalProductos }} productos
            </div>
        </div>
        <!--fin tabla-->

        <!-- metricas -->
        <div class="grid grid-cols-4 gap-4 mt-5">
            <Contenedor>
                <div class="flex items-center gap-4">
                    <div
                        class="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center">
                        <i class="pi pi-box text-xl"></i>
                    </div>

                    <div class="flex flex-col">
                            <span class="text-3xl font-bold text-gray-700">
                                {{ totalProductos }}
                            </span>
                        <span class="text-sm text-gray-500">
                                Total productos
                            </span>
                    </div>
                </div>
            </Contenedor>

            <Contenedor>
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                        <i class="pi pi-warehouse text-xl"></i>
                    </div>

                    <div class="flex flex-col">
                            <span class="text-3xl font-bold text-gray-700">
                                {{ totalStock }}
                            </span>
                        <span class="text-sm text-gray-500">
                                Stock total
                            </span>
                    </div>
                </div>
            </Contenedor>

            <Contenedor>
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center">
                        <i class="pi pi-exclamation-triangle text-xl"></i>
                    </div>

                    <div class="flex flex-col">
                            <span class="text-3xl font-bold text-gray-700">
                                {{ productosConAlerta }}
                            </span>
                        <span class="text-sm text-gray-500">
                                Productos con alerta
                            </span>
                    </div>
                </div>
            </Contenedor>
            <Contenedor>
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                        <i class="pi pi-calendar-clock text-xl"></i>
                    </div>

                    <div class="flex flex-col">
                        <span class="text-3xl font-bold text-gray-700">
                        {{ cantidadPorVencer }}
                        </span>
                        <span class="text-sm text-gray-500">
                        Artículos por vencer
                        </span>
                    </div>
                </div>
            </Contenedor>
        </div>
        <!--fin metricas-->
    </div>
</template>

<style scoped>
</style>
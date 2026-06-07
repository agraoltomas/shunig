<script setup lang="ts">
import { computed, ref } from 'vue'
import moment from 'moment'
import DataTable from '@/volt/DataTable.vue'
import DangerButton from '@/volt/DangerButton.vue'
import { useModalStore } from '@/stores/modales.ts'
import type { IPatrocinador } from '@/lib/tipos/patrocinadores'
import { useRouter } from 'vue-router'

const router = useRouter()
const modalesStore = useModalStore()

const props = withDefaults(defineProps<{
    patrocinadores?: IPatrocinador[]
}>(), {
    patrocinadores: () => []
})

const busqueda = ref('')

const patrocinadoresFiltrados = computed(() => {
    const texto = busqueda.value.trim().toLowerCase()

    if (!texto) {
        return props.patrocinadores
    }

    return props.patrocinadores.filter((patrocinador) => {
        return [
            patrocinador.nombre,
            patrocinador.contacto,
            patrocinador.email,
            patrocinador.descripcion
        ].some((valor) => valor?.toLowerCase().includes(texto))
    })
})

const totalPatrocinadores = computed(() => {
    return props.patrocinadores.length
})

const inicialesPatrocinador = (nombre: string) => {
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
</script>

<template>
    <div class="p-4">
            <div class="flex flex-col gap-5">

                <!-- Descripción + botón -->
                <div class="flex justify-between items-center gap-4">
                    <p class="text-gray-500">
                        Personas y organizaciones que apoyan económicamente al refugio.
                    </p>

                    <Button
                        icon="pi pi-plus"
                        label="Nuevo patrocinador" class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500 "
                        severity="success"
                        @click="modalesStore.abrir('nuevoPatrocinador')"
                    />
                </div>

                <!-- Buscador -->
                <div class="flex gap-3 items-center">
                    <IconField class="w-96">
                        <InputText
                            v-model="busqueda"
                            class="w-full"
                            placeholder="Buscar por nombre, email o contacto..."
                        />
                        
                    </IconField>
                    
<!--
                    <InputIcon class="pi pi-search" />
                    <Button
                        icon="pi pi-filter"
                        label="Filtros"
                        severity="success"
                    />-->
                </div>

                <!-- Tabla -->
                <DataTable
                    :value="patrocinadoresFiltrados"
                    paginator
                    :rows="10"
                    stripedRows
                    class="rounded-lg overflow-hidden"
                >
                    <template #empty>
                        <div class="text-center text-gray-500 p-4">
                            No hay patrocinadores registrados
                        </div>
                    </template>

                    <Column header="Patrocinador" style="width: 28%">
                        <template #body="{ data }">
                            <div class="flex items-center gap-3">
                                <Avatar
                                    :label="inicialesPatrocinador(data.nombre)"
                                    shape="circle"
                                    class="bg-primary-100 text-primary-700"
                                />

                                <div>
                                    <div class="font-semibold text-gray-700">
                                        {{ data.nombre }}
                                    </div>

                                    <div class="text-sm text-gray-500">
                                        {{ data.contacto }}
                                    </div>
                                </div>
                            </div>
                        </template>
                    </Column>

                    <Column
                        header="Email"
                        field="email"
                        style="width: 22%"
                    />

                    <Column header="Descripción" style="width: 28%">
                        <template #body="{ data }">
                            <span
                                class="block max-w-[280px] truncate text-gray-600"
                                :title="data.descripcion"
                            >
                                {{ data.descripcion }}
                            </span>
                        </template>
                    </Column>

                    <Column header="Fecha de alta" style="width: 14%">
                        <template #body="{ data }">
                            {{ formatearFecha(data.fecha_alta) }}
                        </template>
                    </Column>

                    <Column header="Acciones" style="width: 12%">
                        <template #body="{ data }">
                            <div class="flex gap-2">
                                <Button
                                size="small" class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500"
                                    icon="pi pi-eye"
                                    severity="secondary"
                                    @click="router.push(`/refugio/patrocinador/${data.id_patrocinador}`)"
                                />

                               
                            </div>
                        </template>
                    </Column>
                </DataTable>

                <div class="text-sm text-gray-500">
                    Mostrando {{ patrocinadoresFiltrados.length }} de {{ totalPatrocinadores }} patrocinadores
                </div>
            </div>
       

        <!-- Métricas -->
        <div class="grid grid-cols-2 gap-4 mt-5">
            <Card>
                <template #content>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center">
                            <i class="pi pi-users text-xl"></i>
                        </div>

                        <div class="flex flex-col">
                            <span class="text-3xl font-bold text-gray-700">
                                {{ totalPatrocinadores }}
                            </span>
                            <span class="text-sm text-gray-500">
                                Total patrocinadores
                            </span>
                        </div>
                    </div>
                </template>
            </Card>

            <Card>
                <template #content>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                            <i class="pi pi-search text-xl"></i>
                        </div>

                        <div class="flex flex-col">
                            <span class="text-3xl font-bold text-gray-700">
                                {{ patrocinadoresFiltrados.length }}
                            </span>
                            <span class="text-sm text-gray-500">
                                Resultados visibles
                            </span>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>

<style scoped>
</style> 
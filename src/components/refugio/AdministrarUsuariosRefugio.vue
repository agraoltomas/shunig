<script setup lang="ts">
import DataTable from '@/volt/DataTable.vue'
import { onMounted, ref, type Ref, computed } from 'vue'
import type { User } from '@/lib/tipos/usuarios'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
import { useAxios } from '@/lib/axios.ts'
import type { MessageResponse } from '@/lib/tipos/generics'

const usuarios: Ref<User[]> = ref([])
const busqueda = ref('')

const { stopLoading, startLoading } = useLoadingComposable()
const { axios } = useAxios()

const usuariosFiltrados = computed(() => {
    const texto = busqueda.value.trim().toLowerCase()

    if (!texto) {
        return usuarios.value
    }

    return usuarios.value.filter((usuario) => {
        return [
            usuario.nombre,
            usuario.apellido,
            usuario.email
        ].some((valor) => valor?.toLowerCase().includes(texto))
    })
})

onMounted(async () => {
    startLoading()

    try {
        const r = await axios.value.get('/usuario')
        const response: MessageResponse<User[]> = r.data
        usuarios.value = response.data
    } finally {
        stopLoading()
    }
})
</script>

<template>
    <div class="w-[75vw] m-auto flex flex-col gap-4 mt-5 mb-15">
        <div class="shadow-[0_0_10px_rgba(0,0,0,0.18)] rounded-2xl p-5 bg-white">
            <div class="flex flex-row justify-between items-center gap-4 pb-4 mb-5 border-b border-gray-200">
                <div>
                    <div class="font-bold text-2xl">
                        Administrar usuarios
                    </div>

                    <div class="text-gray-500 mt-1">
                        Consultá los usuarios registrados en el sistema.
                    </div>
                </div>

                <div class="rounded-full bg-primary-200/30 w-20 h-20 flex items-center justify-center">
                    <i class="pi pi-users text-primary-500 text-3xl"></i>
                </div>
            </div>

            <div class="flex gap-3 items-center mb-4">
                <IconField class="w-96">
                    <InputText
                        v-model="busqueda"
                        class="w-full"
                        placeholder="Buscar usuario..."
                    />
                </IconField>
            </div>

            <DataTable
                :value="usuariosFiltrados"
                paginator
                :rows="10"
                stripedRows
                class="rounded-lg overflow-hidden"
            >
                <template #empty>
                    <div class="text-center text-gray-500 p-4">
                        No hay usuarios registrados
                    </div>
                </template>

                <Column header="Usuario" style="width:45%">
                    <template #body="{ data }">
                        <div class="flex items-center gap-3">
                            <Avatar
                                :label="`${data.nombre?.[0] || ''}${data.apellido?.[0] || ''}`.toUpperCase()"
                                shape="circle"
                                class="bg-primary-100 text-primary-700"
                            />

                            <div>
                                <div class="font-semibold text-gray-700">
                                    {{ data.nombre }} {{ data.apellido }}
                                </div>

                                <div class="text-sm text-gray-500">
                                    {{ data.email }}
                                </div>
                            </div>
                        </div>
                    </template>
                </Column>

                <Column header="Mail" field="email" style="width:45%" />
            </DataTable>

            <div class="text-sm text-gray-500 mt-3">
                Mostrando {{ usuariosFiltrados.length }} de {{ usuarios.length }} usuarios
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>
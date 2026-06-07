<script setup lang="ts">
import type { User } from '@/lib/tipos/usuarios'
import { useAxios } from '@/lib/axios.ts'
import { onMounted, type Ref, ref, computed } from 'vue'
import { useResponse } from '@/lib/utils/response.ts'
import { rutas_api } from '@/rutas_api.ts'
import { useRefugioStore } from '@/stores/refugio.ts'
import DangerButton from '@/volt/DangerButton.vue'
import { useToast } from '@/lib/toast/toast.ts'
import DataTable from '@/volt/DataTable.vue'

interface UsuarioRefugio extends User {
    created_at: string
    usuario_rechazado: boolean
}

const { axios } = useAxios()
const { unwrap, tryLogError } = useResponse()
const toast = useToast()
const { refugio } = useRefugioStore()

const usuarios: Ref<UsuarioRefugio[]> = ref([])
const busqueda = ref('')

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

const totalUsuarios = computed(() => usuarios.value.length)

const usuariosActivos = computed(() => {
    return usuarios.value.filter((usuario) => !usuario.usuario_rechazado).length
})

const usuariosRechazados = computed(() => {
    return usuarios.value.filter((usuario) => usuario.usuario_rechazado).length
})

const loadUsuarios = async () => {
    if (!refugio) return

    const r = await unwrap<UsuarioRefugio[]>(
        axios.value.get(rutas_api.refugio.USUARIOS(refugio.id_refugio.toString()))
    )

    usuarios.value = r.data
}

onMounted(async () => {
    await loadUsuarios()
})

const rechazar = async (usuario: UsuarioRefugio) => {
    if (!refugio) return

    if (!confirm(`Confirma que rechaza al usuario ${usuario.email}?`)) {
        return
    }

    try {
        const r = await unwrap(
            axios.value.post(rutas_api.refugio.RECHAZAR_USUARIO(refugio.id_refugio.toString()), {
                id_usuario: usuario.id_usuario
            })
        )

        if (r.ok) {
            toast.add({
                detail: r.message,
                severity: 'success'
            })

            await loadUsuarios()
        }
    } catch (err) {
        tryLogError(<Error>err, toast)
    }
}
</script>

<template>
    <div class="w-[75vw] m-auto flex flex-col gap-4 mt-5 mb-15">
        <div class="shadow-[0_0_10px_rgba(0,0,0,0.18)] rounded-2xl p-5 bg-white">
            <div class="flex flex-row justify-between items-center gap-4 pb-4 mb-5 border-b border-gray-200">
                <div>
                    <div class="font-bold text-2xl">
                        Usuarios del refugio
                    </div>

                    <div class="text-gray-500 mt-1">
                        Gestioná los usuarios vinculados al refugio y sus solicitudes de acceso.
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
                        placeholder="Buscar por nombre, apellido o email..."
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

                <Column header="Usuario" style="width:35%">
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

                <Column header="Mail" field="email" style="width:35%" />

                <Column header="Estado" style="width:15%">
                    <template #body="{ data }">
                        <Tag
                            v-if="data.usuario_rechazado"
                            severity="danger"
                            value="Rechazado"
                        />

                        <Tag
                            v-else
                            severity="success"
                            value="Activo"
                        />
                    </template>
                </Column>

                <Column header="Acciones" style="width:15%">
                    <template #body="{ data }">
                        <DangerButton
                            v-if="!data.usuario_rechazado"
                            size="small"
                            outlined
                            icon="pi pi-times"
                            label="Rechazar"
                            @click="() => rechazar(data)"
                        />

                        <span v-else class="text-gray-400">
                            -
                        </span>
                    </template>
                </Column>
            </DataTable>

            <div class="text-sm text-gray-500 mt-3">
                Mostrando {{ usuariosFiltrados.length }} de {{ totalUsuarios }} usuarios
            </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
            <Card>
                <template #content>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center">
                            <i class="pi pi-users text-xl"></i>
                        </div>

                        <div class="flex flex-col">
                            <span class="text-3xl font-bold text-gray-700">
                                {{ totalUsuarios }}
                            </span>
                            <span class="text-sm text-gray-500">
                                Total usuarios
                            </span>
                        </div>
                    </div>
                </template>
            </Card>

            <Card>
                <template #content>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                            <i class="pi pi-check text-xl"></i>
                        </div>

                        <div class="flex flex-col">
                            <span class="text-3xl font-bold text-gray-700">
                                {{ usuariosActivos }}
                            </span>
                            <span class="text-sm text-gray-500">
                                Usuarios activos
                            </span>
                        </div>
                    </div>
                </template>
            </Card>

            <Card>
                <template #content>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                            <i class="pi pi-times text-xl"></i>
                        </div>

                        <div class="flex flex-col">
                            <span class="text-3xl font-bold text-gray-700">
                                {{ usuariosRechazados }}
                            </span>
                            <span class="text-sm text-gray-500">
                                Rechazados
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
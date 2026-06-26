<script setup lang="ts">
import DataTable from '@/volt/DataTable.vue'
import { onMounted, ref, type Ref, computed } from 'vue'
import type { User } from '@/lib/tipos/usuarios'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
import { useAxios } from '@/lib/axios.ts'
import Dialog from '@/volt/Dialog.vue'
import Avatar from '@/volt/Avatar.vue'
import { useResponse } from '@/lib/utils/response.ts'
import { rutas_api } from '@/rutas_api.ts'
import { useRefugioStore } from '@/stores/refugio.ts'

const usuarios: Ref<User[]> = ref([])
const allUsers: Ref<User[]> = ref([])

const busqueda = ref('')
const addUserDialog = ref(false)
const refugioStore = useRefugioStore()
const { stopLoading, startLoading, loading } = useLoadingComposable()
const { axios } = useAxios()
const { unwrap } = useResponse()

const usuariosFiltrados = computed(() => {
    const texto = busqueda.value.trim().toLowerCase()
    if (!texto)return usuarios.value
    return usuarios.value.filter((usuario) => {
        return [
            usuario.nombre,
            usuario.apellido,
            usuario.email
        ].some((valor) => valor?.toLowerCase().includes(texto))
    })
})

onMounted(async () => {
    if(!refugioStore.refugio)return
    startLoading()
    try {
        const r = await unwrap(axios.value.get(rutas_api.refugio.PERSONAL(refugioStore.refugio.id_refugio.toString())))
        usuarios.value = r.data
    } finally {
        stopLoading()
    }
})

const showAddUsers = async () => {
    const a = getAllUsers()
    addUserDialog.value = true

}
const getAllUsers = async () => {
    if(!refugioStore.refugio)return
    try {
        const r = await unwrap(axios.value.get(rutas_api.refugio.USUARIOS(refugioStore.refugio.id_refugio.toString())))
        allUsers.value = r.data
    }catch(err) {
        console.log(err)
    }
}
const isRefugioUser = (u: User) => {
    const us = usuarios.value.filter((us: User) => us.id_usuario == u.id_usuario)
    return us.length > 0
}
const addUser = async (u: User) => {
    if(!refugioStore.refugio)return
    console.log(u)
    try{
        const r = await unwrap(axios.value.post(rutas_api.refugio.PERSONAL(refugioStore.refugio.id_refugio.toString()),{
            id_usuario: u.id_usuario,
        }))
    }catch (error){
        console.log(error)
    }
}
</script>

<template>
    <div class="w-3/4 m-auto flex flex-col gap-4 mt-5 mb-15">
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

            <div class="flex gap-3 items-center mb-4 justify-between">
                <IconField class="w-96">
                    <InputText
                        v-model="busqueda"
                        class="w-full"
                        placeholder="Buscar usuario..."
                    />
                </IconField>
                    <Button class="mr-5 bg-refugio-500 border-refugio-500" icon="pi pi-plus" @click="showAddUsers"></Button>
            </div>

            <DataTable
                :value="usuariosFiltrados"
                paginator
                :rows="10"
                stripedRows
                class="rounded-lg overflow-hidden"
                :loading="loading"
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

                <Column header="Mail" field="email" class="w-[45%]" />
                <Column>
                    <template #body="{data}">
                        <div v-if="data['id_rol'] == 1">
                            <Badge class="bg-refugio-500" value="Administrador"></Badge>
                        </div>
                        <div v-else>
                            <Badge class="bg-refugio-500" value="Personal"></Badge>
                        </div>

                    </template>
                </Column>
            </DataTable>

            <div class="text-sm text-gray-500 mt-3">
                Mostrando {{ usuariosFiltrados.length }} de {{ usuarios.length }} usuarios
            </div>
        </div>
    </div>
    <Dialog v-model:visible="addUserDialog" modal>
        <DataTable
            :value="allUsers"
            paginator
            :rows="10"
            stripedRows
            class="rounded-lg overflow-hidden"
            :loading="loading"
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

            <Column header="Mail" field="email" class="w-[45%]" />
            <Column>
                <template #body="{data}">
                    <div v-if="isRefugioUser(data)">
                        <Badge class="bg-refugio-500" value="Usuario"></Badge>
                    </div>
                    <Button v-else variant="outlined" icon="pi pi-plus" title="Dar permisos" label="Agregar" class="text-refugio-500! hover:bg-refugio-100! border-refugio-500!" @click="() => addUser(data)"></Button>
                </template>
            </Column>
        </DataTable>
    </Dialog>
</template>

<style scoped>
</style>
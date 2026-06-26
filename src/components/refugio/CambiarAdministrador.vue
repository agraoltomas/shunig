<script setup lang="ts">
import Select from '@/volt/Select.vue'
import { computed, onMounted, ref, type Ref } from 'vue'
import type { User } from '@/lib/tipos/usuarios'
import { rutas_api } from '@/rutas_api.ts'
import { useRefugioStore } from '@/stores/refugio.ts'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
import { useAxios } from '@/lib/axios.ts'
import { useResponse } from '@/lib/utils/response.ts'
import type { Maybe } from '@/lib/tipos/generics'
const usuarios: Ref<User[]> = ref([])
const refugioStore = useRefugioStore()
const { stopLoading, startLoading, loading } = useLoadingComposable()
const { axios } = useAxios()
const { unwrap } = useResponse()

const newAdminUser: Ref<Maybe<User>> = ref(null)
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
const cambiarAdmin = () => {
    if(!confirm("esta seguro que desea cambiar el usuario administrador? esta accion no puede deshacerse y solo se podra cambiar desde la cuenta del nuevo usuario administrador"))return
    console.log("cambiarAdmin", newAdminUser.value)
}
const filteredUsuarios = computed(() => {
    return usuarios.value.filter((u) => u['id_rol'] != 1)
})
</script>

<template>
    <div class="m-auto flex flex-col gap-4 mt-5 ">
        <div class="shadow-[0_0_10px_rgba(0,0,0,0.18)] rounded-2xl p-5 bg-white">
            <div class="flex flex-row justify-between items-center gap-4 pb-4 mb-5 border-b border-gray-200">
                <div>
                    <div class="font-bold text-2xl">
                        Cambiar usuario administrador
                    </div>
                    <div class="text-gray-500 mt-1">
                        Seleccioná el usuario que quedará como administrador principal del refugio.
                    </div>
                </div>

                <div class="rounded-full bg-primary-200/30 w-20 h-20 flex items-center justify-center">
                    <i class="pi pi-user-edit text-primary-500 text-3xl"></i>
                </div>
            </div>

            <div class="flex flex-row gap-3">
                <Select
                    v-model="newAdminUser"
                    fluid
                    class="grow"
                    placeholder="Seleccionar usuario administrador"
                    :option-label="(u) => `${u.nombre} ${u.apellido} - ${u.email}`"
                    :options="filteredUsuarios"
                />

                <Button
                    :disabled="!newAdminUser"
                    icon="pi pi-check"
                    label="Confirmar"
                    class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500"
                    @click="cambiarAdmin"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>
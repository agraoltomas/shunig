<script setup lang="ts">
import DataTable from '@/volt/DataTable.vue'
import { onMounted, ref, type Ref } from 'vue'
import type { User } from '@/lib/tipos/usuarios'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
import { useAxios } from '@/lib/axios.ts'
import type { MessageResponse } from '@/lib/tipos/generics'

const usuarios: Ref<User[]> = ref([])
const { loading, stopLoading, startLoading } = useLoadingComposable()
const { axios } = useAxios()
onMounted(async () => {
    startLoading()
    try {
        const r = await axios.value.get('/usuario')
        const response: MessageResponse<User[]> = r.data
        usuarios.value = response.data
    } catch (error) {

    } finally {
        stopLoading()

    }
})
</script>

<template>
    <div class="text-2xl">Administrar Usuarios</div>
    <DataTable :value="usuarios">
        <Column header="Nombre">
            <template #body="{data}">
                {{ data['nombre'] }} {{ data['apellido'] }}
            </template>
        </Column>
        <Column header="Mail" field="email"></Column>
    </DataTable>
</template>

<style scoped>

</style>
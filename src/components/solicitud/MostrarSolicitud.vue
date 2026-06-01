<script setup lang="ts">

import DangerButton from '@/volt/DangerButton.vue'
import type { IDatosSolicitud } from '@/lib/tipos/solicitud.ts'
import type { Maybe } from '@/lib/tipos/generics'
import { useAxios } from '@/lib/axios.ts'
import { onMounted, watch } from 'vue'

const props = defineProps<{ solicitud: Maybe<IDatosSolicitud> }>()
const { axios } = useAxios()
const emit = defineEmits<{ updated: [] }>()
onMounted(() => {

})
const cambiarEstado = async (e: ('aceptar' | 'rechazar')) => {
    if (!props.solicitud) return
    console.log(e)
    try {
        const r = axios.value.post(`/solicitud/${props.solicitud.id_solicitud}/${e}/`)
        emit('updated')
    } catch (e) {

    }
}
watch(() => props.solicitud, () => {

})
</script>

<template>
    <div class="flex flex-col gap-3">
        <div>datos usuario</div>
        <div>datos mascota</div>
        <div class="flex flex-row gap-3">
            <DangerButton label="Rechazar" @click="() => cambiarEstado('rechazar')"></DangerButton>
            <Button label="Aceptar" @click="() => cambiarEstado('aceptar')"></Button>
        </div>
    </div>
</template>

<style scoped>

</style>
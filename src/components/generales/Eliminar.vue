<script setup lang="ts">

import { ref } from 'vue'
import axios from '@/lib/axios.ts'
import { useToast } from '@/lib/toast/toast.ts'
import { useRouter } from 'vue-router'
import { useModalStore } from '@/stores/modales'
import DangerButton from '@/volt/DangerButton.vue';


const toast = useToast();
const router = useRouter();
const modalesStore = useModalStore();


const emits = defineEmits<{close: []}>();

const cancelar = () => {
    errorEliminacion.value = null
    emits('close')
}

const errorEliminacion = ref<string | null>(null)
const eliminando = ref(false)


const confirmarEliminacion = async () => {
    if (eliminando.value) return

    const eliminar = modalesStore.context.eliminar

    errorEliminacion.value = null
    eliminando.value = true

    try {
        const r = await axios.delete(eliminar.endpoint)

        if ([200, 201].includes(r.status)) {
            toast.add({
                severity: "success",
                summary: "Éxito!",
                detail: `${eliminar.nombre} se ha eliminado correctamente`
            })

            emits('close')

            if (eliminar.volverPrincipal) {
                router.push(eliminar.volverPrincipal)
            }
        }
    } catch (error: any) {
        errorEliminacion.value =
            error.response?.data?.message || "No se pudo eliminar el registro"
    } finally {
        eliminando.value = false
    }
}

</script>

<template>
    <div class="flex flex-col w-full pt-6">
        <div class="font-semibold m-auto text-xl pb-5">
            ¿Estás seguro de que querés eliminar {{modalesStore.context.eliminar.nombre}}?
        </div>
        <Message v-if="errorEliminacion" severity="error" size="small" class="mb-4">
            {{ errorEliminacion }}
        </Message>
    
        <div class="flex flex-row justify-end gap-3">
            
            <DangerButton icon="pi pi-trash" outlined label="Eliminar" :disabled="eliminando"
            @click="confirmarEliminacion"></DangerButton>
            <Button icon="pi pi-times" outlined label="Cancelar" :disabled="eliminando" @click="cancelar"></Button>
        </div>
    </div>
   
</template>

<style scoped>
</style>
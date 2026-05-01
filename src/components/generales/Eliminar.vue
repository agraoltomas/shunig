<script setup lang="ts">

import axios from '@/lib/axios.ts'
import { useToast } from '@/lib/toast/toast.ts'
import { useRouter } from 'vue-router'
import { useModalStore } from '@/stores/modales'
import DangerButton from '@/volt/DangerButton.vue';


const toast = useToast();
const router = useRouter();
const modalesStore = useModalStore();


const emits = defineEmits<{close: []}>();

const cancelar = () => {emits('close')}



const confirmarEliminacion = async () => {
        const eliminar = modalesStore.context.eliminar;
        const r = await axios.delete(eliminar.endpoint);
        if([200,201].includes(r.status)){
            toast.add({severity:"success", summary:"Éxito!", 
            detail: `${eliminar.nombre} se ha eliminado correctamente`})
            emits('close')

            if(eliminar.volverPrincipal){
                router.push(eliminar.volverPrincipal);
            }
        }
}


</script>

<template>
    <div class="flex flex-col w-full pt-6">
        <div class="font-semibold m-auto text-xl pb-5">
            ¿Estás seguro de que querés eliminar {{modalesStore.context.eliminar.nombre}}?
        </div>
        </div>
        <div>
        <div class="flex flex-row justify-end gap-3">
            
            <DangerButton icon="pi pi-trash" label="Eliminar" 
            @click="confirmarEliminacion"></DangerButton>
            <Button icon="pi pi-times" label="Cancelar" @click="cancelar"/>
        </div>
    </div>
   
</template>

<style scoped>
</style>
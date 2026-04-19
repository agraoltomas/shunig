<script setup lang="ts">

import Dialog from '@/volt/Dialog.vue'
import IngresoMascota from '@/components/mascotas/IngresoMascota.vue'
import { useModalStore } from '@/stores/modales.ts'
import { ref } from 'vue'
import FormAdopcion from '@/components/adopcion/FormAdopcion.vue'
const store = useModalStore()
const data = ref("")
</script>

<template>
    <Dialog v-model:visible="store.modales.nuevoAnimal" modal header="Alta de Animal" class="w-[60%]"

            pt:header="border-b-2 mb-5 border-surface-400">
        <template #header>
            <div class="flex flex-col w-full">
                <div class="font-semibold m-auto text-2xl pb-0!">
                    Alta de Animal
                </div>
            </div>
        </template>
        <IngresoMascota class="mt-3" @close="() => store.cerrar('nuevoAnimal')"></IngresoMascota>
    </Dialog>
    <Dialog v-model:visible="store.modales.nuevoTransito">Transito</Dialog>
    <Dialog v-model:visible="store.modales.vacunacion">Vacunación</Dialog>
    <Dialog v-model:visible="store.modales.adopcion" class="max-w-[80%]!">
        <template #header>
            <div class="text-2xl font-bold m-auto">Formulario de adopción</div>
        </template>
        <FormAdopcion @close="() => store.cerrar('adopcion')"></FormAdopcion>
    </Dialog>
</template>

<style scoped>

</style>
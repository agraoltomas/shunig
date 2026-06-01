<script setup lang="ts">

import Dialog from '@/volt/Dialog.vue'
import IngresoMascota from '@/components/mascotas/IngresoMascota.vue'
import IngresoVacunacion from '@/components/vacunacion/IngresoVacunacion.vue'
import { useModalStore } from '@/stores/modales.ts'
import { ref } from 'vue'
import FormAdopcion from '@/components/adopcion/FormAdopcion.vue'
import FormTransito from '@/components/transito/FormTransito.vue'
import Modal from '@/components/modal/Modal.vue'
import IngresoPatrocinador from './patrocinadores/IngresoPatrocinador.vue'
import Eliminar from './generales/Eliminar.vue'

const store = useModalStore()
const data = ref('')
</script>

<template>
    <Dialog v-model:visible="store.modales.nuevoAnimal" modal header="Alta de animal" class="w-[60%]"
            pt:header="border-b-2 mb-5 border-surface-400">
        <template #header>
            <div class="flex flex-col w-full">
                <div class="font-semibold m-auto text-2xl pb-0!">
                    Alta de animal
                </div>
            </div>
        </template>
        <IngresoMascota class="mt-3" @close="() => store.cerrar('nuevoAnimal')"></IngresoMascota>
    </Dialog>

    <Dialog v-model:visible="store.modales.vacunacion" modal header="Alta de evento de vacunación" class="w-[60%]"
            pt:header="border-b-2 mb-5 border-surface-400">
        <template #header>
            <div class="flex flex-col w-full">
                <div class="font-semibold m-auto text-2xl pb-0!">
                    Alta de evento de vacunación
                </div>
            </div>
        </template>
        <IngresoVacunacion class="mt-3" @close="() => store.cerrar('vacunacion')"></IngresoVacunacion>
    </Dialog>


    <Modal v-if="store.context.adopcion" nombre="adopcion" class="max-w-[80%]!" title="Formulario de adopción">
        <template #default="{ context, closeFn}">
            <FormAdopcion v-if="context.adopcion?.mascota" :mascota="context.adopcion?.mascota"
                          :user="context.adopcion.usuario" @close="closeFn"
                          @cargada="closeFn"
                          @cerrar="closeFn"
            ></FormAdopcion>

        </template>
    </Modal>

    <Dialog v-model:visible="store.modales.nuevoPatrocinador" modal header="Alta de patrocinador" class="w-[60%]"
            pt:header="border-b-2 mb-5 border-surface-400">
        <template #header>
            <div class="flex flex-col w-full">
                <div class="font-semibold m-auto text-2xl pb-0!">
                    Alta de patrocinador
                </div>
            </div>
        </template>
        <IngresoPatrocinador class="mt-3" @close="() => store.cerrar('nuevoPatrocinador')"></IngresoPatrocinador>
    </Dialog>

    <Dialog v-model:visible="store.modales.eliminar" modal :show-header="false" class="w-[30%]">
        <Eliminar class="mt-3" @close="() => store.cerrar('eliminar')"></Eliminar>
    </Dialog>
    <Modal nombre="nuevoTransito" title="Nuevo Transito">
        <template #default="{closeFn, context}">
            <FormTransito v-if="context.nuevoTransito?.mascota" @close="closeFn"
                          @cargada="() => {closeFn() ; $emit('actualizado')}"
                          @cerrar="() => closeFn()"
                          :mascota="context.nuevoTransito?.mascota" :user="context.nuevoTransito?.usuario"></FormTransito>
        </template>
    </Modal>

</template>

<style scoped>

</style>
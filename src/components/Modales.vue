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
import IngresoProducto from './inventario/IngresoProducto.vue'
import ArticuloStock from "./inventario/ArticuloStock.vue"
import IngresoArticuloStock from "./inventario/IngresoArticuloStock.vue"

const store = useModalStore()
const data = ref('')
</script>

<template>
    <Dialog v-model:visible="store.modales.nuevoAnimal" modal header="Alta de animal" class="w-[60%] max-h-[82vh]"
            pt:header="border-b-2 mb-5" pt:content="max-h-[68vh] overflow-y-auto">
        <template #header>
            <div class="flex flex-col w-full">
                <div class="font-semibold m-auto text-2xl pb-0! my-3">
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

    <Dialog v-model:visible="store.modales.nuevoPatrocinador" modal header="Alta de patrocinador" class="w-[60%] max-h-[82vh]"
            pt:header="border-b-2 mb-5" pt:content="max-h-[68vh] overflow-y-auto">
        <template #header>            
               <div class="font-semibold m-auto text-2xl pb-0! my-3">
                    Alta de patrocinador
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

    <Dialog v-model:visible="store.modales.nuevoProducto" modal header="Alta de producto" class="w-[60%] max-h-[82vh]"
            pt:header="border-b-2 mb-5" pt:content="max-h-[68vh] overflow-y-auto">
        <template #header>
                <div class="font-semibold m-auto text-2xl pb-0! my-3">
                    Alta de producto
                </div>
        </template>
        <IngresoProducto class="mt-3" @close="() => store.cerrar('nuevoProducto')"></IngresoProducto>
    </Dialog>

    <Dialog v-model:visible="store.modales.nuevoArticuloStock" modal header="Alta de artículo" class="w-[60%] max-h-[82vh]"
            pt:header="border-b-2 mb-5" pt:content="max-h-[68vh] overflow-y-auto">
        <template #header>
            <div class="flex flex-col w-full">
                <div class="font-semibold m-auto text-2xl pb-0! my-3">
                    Alta de artículo
                </div>
            </div>
        </template>
        <IngresoArticuloStock  v-if="store.context.nuevoArticuloStock" class="mt-3" :id_producto="store.context.nuevoArticuloStock.id_producto"
                               @close="() => store.cerrar('nuevoArticuloStock')"></IngresoArticuloStock>
    </Dialog>

    <Dialog v-model:visible="store.modales.verArticuloStock" modal header="Detalle del artículo" class="w-[60%] max-h-[82vh]"
            pt:header="border-b-2 mb-5" pt:content="max-h-[68vh] overflow-y-auto">
        <template #header>
            <div class="flex flex-col w-full">
                <div class="font-semibold m-auto text-2xl pb-0! my-3">
                    Detalle del artículo
                </div>
            </div>
        </template>
        <ArticuloStock v-if="store.context.verArticuloStock" :articulo="store.context.verArticuloStock.articulo"
        :nombre-producto="store.context.verArticuloStock.nombreProducto"
                       class="mt-3" @close="() => store.cerrar('verArticuloStock')" @eliminado="() => {
            store.context.verArticuloStock.eliminaStock?.()
            store.cerrar('verArticuloStock')}"
                       @actualizado="() => {
            store.context.verArticuloStock.actualizaStock?.()
            store.cerrar('verArticuloStock')}"></ArticuloStock>
    </Dialog>


</template>

<style scoped>

</style>
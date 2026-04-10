<script setup lang="ts">
import Menubar from "@/components/Menubar.vue"
import Menu from "@/volt/Menu.vue"
import type { MenuItem } from 'primevue/menuitem'
import Dialog from "@/volt/Dialog.vue"
import { onMounted, reactive, ref, type Ref, useTemplateRef } from 'vue'
import axios from '@/lib/axios.ts'
import type { IRefugio } from '@/lib/tipos/refugio'
import type { Maybe } from '@/lib/tipos/generics'
import IngresarMascota from '@/components/mascotas/IngresarMascota.vue'
import { useRouter } from 'vue-router'
const refugio: Ref<Maybe<IRefugio>> = ref(null);
const router = useRouter();
onMounted(async () => {
    const r = await axios.get(`refugio/1/`);
    if(r.status == 200){
        refugio.value = r.data;
    }
    console.log(refugio.value);
})
const itemsMenuAccesoRapido: Ref<MenuItem[]> = ref([
    {
        label: "Gestiones",
        items:[
            {
                label:"Mis Animales",
                command: () => router.push('/refugio/mascotas')
            },
            {
                label: "Animales en Tránsito",
                command: () => router.push('/refugio/transito')
            },
            {
                label: "Eventos de Vacunación" ,
                command: () => router.push('refugio/vacunas')
            },
            {
                label: "Control de Stock",
                command: () => router.push('refugio/stock')
            }
        ],
    }
]);
const menuAccesoRapido = useTemplateRef("menuAccesoRapido");
const toggle = (event: Event) => {
    menuAccesoRapido.value?.toggle(event)
}


const modales = reactive({
    nuevoAnimal: false,
    nuevoTransito: false,
    vacunacion: false
});
const mostrarAnimal = () => {
    modales.nuevoAnimal = true;
    modales.nuevoTransito = false;
    modales.vacunacion = false;
}

const mostrarTransito = () => {
    modales.nuevoAnimal = false;
    modales.nuevoTransito = true    ;
    modales.vacunacion = false;
}
const mostrarVacunacion = () => {
    modales.nuevoAnimal = false;
    modales.nuevoTransito = false;
    modales.vacunacion = true;
}

</script>

<template>
    <Menubar>
        <template #end>
            <div v-if="refugio" class="h-full w-full text-center flex flex-row justify-start">
                <div class="font-semibold text-3xl text-white m-auto">
                    {{ refugio.nombre}}
                </div>
            </div>
        </template>
    </Menubar>
    <div class="mx-3 rounded-lg flex flex-row justify-between">
        <div class="w-[50%] my-auto">
                <Button type="button" icon="pi pi-bars" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" />
            <Menu pt:submenulabel="text-black font-semibold text-center bg-gray-100" ref="menuAccesoRapido" id="overlay_menu" :model="itemsMenuAccesoRapido" :popup="true" >
            </Menu>
        </div>
        <div class="flex flex-row gap-3">
            <Button icon="pi pi-plus" icon-pos="left" label="Animal" @click="() => modales.nuevoAnimal = true"></Button>
            <Button disabled icon="pi pi-plus" icon-pos="left" label="Tránsito" @click="() => modales.nuevoTransito = true"></Button>
            <Button disabled icon="pi pi-plus" icon-pos="left" label="Evento de Vacunación" @click="() => modales.vacunacion = true"></Button>
        </div>
<!--        <Dialog :visible="true" modal class="bg-white!">-->
<!--            hola-->
<!--        </Dialog>-->
    </div>
    <RouterView >
    </RouterView>
    <Dialog v-model:visible="modales.nuevoAnimal" modal header="Alta de Animal" class="w-[60%]"

    pt:header="border-b-2 mb-5 border-surface-400">
        <template #header>
            <div class="flex flex-col w-full">
                <div class="font-semibold m-auto text-2xl pb-0!">
                    Alta de Animal
                </div>
            </div>
        </template>
        <IngresarMascota class="mt-3"  @close="() => modales.nuevoAnimal = false"></IngresarMascota>
    </Dialog>
    <Dialog v-model:visible="modales.nuevoTransito">Transito</Dialog>
    <Dialog v-model:visible="modales.vacunacion">Vacunación</Dialog>

</template>

<style scoped>

</style>
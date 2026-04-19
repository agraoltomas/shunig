<script setup lang="ts">
import Menubar from '@/components/Menubar.vue'
import Menu from '@/volt/Menu.vue'
import type { MenuItem } from 'primevue/menuitem'
import {  ref, type Ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
import { useRefugioStore } from '@/stores/refugio.ts'
import { useAuthStore } from '@/stores/auth.ts'
import { useModalStore } from '@/stores/modales.ts'

const modalesStore = useModalStore()
const refugioStore = useRefugioStore()
const authStore = useAuthStore()
const itemsMenuAccesoRapido: Ref<MenuItem[]> = ref([
    {
        label: 'Gestiones',
        items: [
            {
                label: 'Mis Animales',
                command: () => router.push('/refugio/mascotas')
            },
            {
                label: 'Animales en Tránsito',
                command: () => router.push('/refugio/transito')
            },
            {
                label: 'Eventos de Vacunación',
                command: () => router.push('refugio/vacunas')
            },
            {
                label: 'Control de Stock',
                command: () => router.push('refugio/stock')
            }
        ]
    }
])
const menuAccesoRapido = useTemplateRef('menuAccesoRapido')
const toggle = (event: Event) => {
    menuAccesoRapido.value?.toggle(event)
}
if (!authStore.user) {
    router.push('/login')
}



</script>

<template>
    <Menubar>
        <template #end>
            <div v-if="refugioStore.refugio" class="h-full w-full text-center flex flex-row justify-start">
                <div class="font-semibold text-3xl text-white m-auto px-5">
                    {{ refugioStore.refugio?.nombre }}
                </div>
                <div v-if="authStore.user" class="flex flex-col">
                    <div class="size-10 rounded-full border-2 border-white mx-3 p-2.5 bg-[#eadec6] text-3xl pb-3 leading-[0.5]">
                        {{ authStore.user.nombre[0] }}
                    </div>
                    <span class="font-semibold text-white text-xs">{{ authStore.user.nombre }}</span>
                    <span class="font-semibold text-white text-xs">{{ authStore.user.apellido }}</span>
                </div>
            </div>
        </template>
    </Menubar>
    <div class="mx-3 rounded-lg flex flex-row justify-between">
        <div class="w-[50%] my-auto">
            <Button type="button" icon="pi pi-bars" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" />
            <Menu pt:submenulabel="text-black font-semibold text-center bg-gray-100" ref="menuAccesoRapido"
                  id="overlay_menu" :model="itemsMenuAccesoRapido" :popup="true">
            </Menu>
        </div>
                <div class="flex flex-row gap-3">
                    <Button icon="pi pi-plus" icon-pos="left" label="Animal" @click="() => modalesStore.abrir('nuevoAnimal')"></Button>
                    <Button disabled icon="pi pi-plus" icon-pos="left" label="Tránsito" @click="() => modalesStore.abrir('nuevoTransito')"></Button>
                    <Button disabled icon="pi pi-plus" icon-pos="left" label="Evento de Vacunación" @click="() => modalesStore.abrir('vacunacion')"></Button>
                </div>
<!--                <Dialog :visible="true" modal class="bg-white!">-->
<!--                    hola-->
<!--                </Dialog>-->
    </div>
    <RouterView>
    </RouterView>

</template>

<style scoped>

</style>
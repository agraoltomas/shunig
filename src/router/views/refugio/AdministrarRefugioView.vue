<script setup lang="ts">

import DataBlock from '@/components/generales/DataBlock.vue'
import DangerButton from '@/volt/DangerButton.vue'
import RefugioActualizarDatos from '@/components/refugio/RefugioActualizarDatos.vue'
import type { MenuItem } from 'primevue/menuitem'
import Menu from "@/volt/Menu.vue"
import { type Ref, ref } from 'vue'
import CambiarAdministrador from '@/components/refugio/CambiarAdministrador.vue'
import AdministrarUsuariosRefugio from '@/components/refugio/AdministrarUsuariosRefugio.vue'
const opciones: MenuItem[] = [
    {label: "General", active: true, icon: "pi pi-cog", command: () => menuSelected.value = 'general'},
    {label: "Actualizar datos", icon: "pi pi-sync", command: () => menuSelected.value = 'datos'},
    {label: "Administrar permisos", icon: "pi pi-lock", command: () => menuSelected.value = 'permisos'},
]
const menuSelected: Ref<('general'|'datos'|'permisos')> = ref('general')
</script>

<template>
    <div class="flex flex-row">
        <Menu v-model:model="opciones"  class="m-3! h-fit">
            <template #start>
                <div class="p-3 text-2xl font-semibold border-b border-b-surface-500">Menú</div>
            </template>
        </Menu>
        <Panel v-if="menuSelected == 'general'" class="m-3">
            <h1 class="text-2xl p-3">Zona de peligro</h1>
            <div class="border border-surface-500 p-3 rounded-lg">
                <div class="flex flex-row justify-between">
                    <DataBlock class="max-w-[75%]" label="Desactivar el refugio" data="Se marcará el refugio como inactivo y no se podrán realizar acciones en éste"></DataBlock>
                    <DangerButton label="Desactivar" class="h-fit! my-auto mr-5!" icon="pi pi-trash"></DangerButton>
                </div>
            </div>
        </Panel>
        <Panel v-else-if="menuSelected == 'datos'" class="m-3">
            <RefugioActualizarDatos class="py-5"/>
        </Panel>
        <Panel v-else-if="menuSelected == 'permisos'" class="m-3">
            <CambiarAdministrador class="w-[75%]!"></CambiarAdministrador>
            <hr class="my-5 border-surface-400"/>
            <div class="h-96 overflow-y-auto">
                <AdministrarUsuariosRefugio></AdministrarUsuariosRefugio>
            </div>
        </Panel>
    </div>
</template>

<style scoped>

</style>
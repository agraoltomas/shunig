<script setup lang="ts">

import DataBlock from '@/components/generales/DataBlock.vue'
import DangerButton from '@/volt/DangerButton.vue'
import RefugioActualizarDatos from '@/components/refugio/RefugioActualizarDatos.vue'
import type { MenuItem } from 'primevue/menuitem'
import Menu from "@/volt/Menu.vue"
import { type Ref, ref } from 'vue'
import CambiarAdministrador from '@/components/refugio/CambiarAdministrador.vue'
import AdministrarUsuariosRefugio from '@/components/refugio/AdministrarUsuariosRefugio.vue'
import { useAxios } from '@/lib/axios.ts'
import { useRefugioStore } from '@/stores/refugio.ts'
import { AxiosError } from 'axios'
import { useToast } from '@/lib/toast/toast.ts'
import type { MessageResponse } from '@/lib/tipos/generics'
import { useAuthStore } from '@/stores/auth.ts'
import AdministrarRechazos from '@/components/refugio/AdministrarRechazos.vue'
const opciones: MenuItem[] = [
    {label: "General", active: true, icon: "pi pi-cog", command: () => menuSelected.value = 'general'},
    {label: "Actualizar datos", icon: "pi pi-sync", command: () => menuSelected.value = 'datos'},
    {label: "Administrar permisos", icon: "pi pi-lock", command: () => menuSelected.value = 'permisos'},
    {label: "Administrar usuarios rechazados", icon: "pi pi-users", command: () => menuSelected.value = 'rechazos'},
]
const menuSelected: Ref<('general'|'datos'|'permisos'|'rechazos')> = ref('general')
const {axios} = useAxios();
const { refugio, loadContextRefugio } = useRefugioStore();
const {user} = useAuthStore();
const toast = useToast();
const desactivarRefugio = async () => {
    if(!confirm("Confirmar desactivacion del refugio?"))return;
    if(!refugio) return;
    try{
        const r = await axios.value.post(`refugio/${refugio.id_refugio}/desactivar/`, {});
        const response: MessageResponse<any> = r.data;
        if(response.ok)toast.add({ detail: "Refugio deshabilitado correctamente", severity: "success" });
        if(user)await loadContextRefugio(user);
    }catch (e){
        if(e instanceof AxiosError){
            const response: MessageResponse<never> = e.response?.data;
            toast.add({ detail: response.message, severity: 'error' });
        }
    }
}
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
                    <DangerButton label="Desactivar" class="h-fit! my-auto mr-5!" @click="desactivarRefugio" icon="pi pi-trash"></DangerButton>
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
        <Panel v-else-if="menuSelected == 'rechazos'">
            <AdministrarRechazos></AdministrarRechazos>
        </Panel>
    </div>
</template>

<style scoped>

</style>
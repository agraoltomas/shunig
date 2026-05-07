<script setup lang="ts">
import type { User } from '@/lib/tipos/usuarios'
import Avatar from "@/volt/Avatar.vue"
import Menu from '@/volt/Menu.vue'
import { useAuthStore } from '@/stores/auth.ts'
import { useRouter } from 'vue-router'
import { ref, type Ref, useTemplateRef } from 'vue'
import type { MenuItem } from 'primevue/menuitem'
const props = defineProps<{ user: User }>()
const authStore = useAuthStore();
const router = useRouter()
const itemsConfiguracion: Ref<MenuItem[]> = ref([
    {
        label:"Configuración",
        items: [
            { label: 'Cambiar contraseña' },
            { label: "Administrar refugio", command: async ()  => router.push('/refugio/administrar'), roles: [1,4]},
            { label: 'Administrar perfil', command: async () => router.push('/usuario/administrar') },
            { label: "Cerrar sesión", command: async () => {
                    authStore.logout();
                    await router.push('/login')}
            },
        ]
    },
])
const toggle = (event: Event) => {
    menuSettings.value?.toggle(event)
}
const menuSettings = useTemplateRef('menuSettings')

</script>

<template>
    <div class="flex flex-col">
        <Avatar :label="user.nombre[0]" class="select-none cursor-pointer hover:bg-surface-500 my-auto" size="large" shape="circle"  @click="toggle" />
<!--        <span class="m-auto font-semibold text-white text-xs select-none">{{ user.nombre }}</span>-->
<!--        <span class="m-auto font-semibold text-white text-xs select-none">{{ user.apellido }}</span>-->
    </div>
    <Menu pt:submenulabel="text-black font-semibold text-center bg-gray-100" ref="menuSettings"
          id="overlay_menu" :model="itemsConfiguracion" :popup="true">
        <template #item="{ item, props}">
            <span class="cursor-pointer flex items-center no-underline overflow-hidden relative text-inherit px-3 py-2 gap-2 select-none outline-none" v-if="item.roles ? authStore.validarRoles(item.roles) : true">{{ item.label }}</span>
        </template>
    </Menu>

</template>

<style scoped>

</style>
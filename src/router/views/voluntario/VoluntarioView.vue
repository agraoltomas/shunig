<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.ts'
import Menubar from '@/components/Menubar.vue'
import UsuarioTag from '@/components/generales/UsuarioTag.vue'
//@ts-ignore
import { Qalendar } from 'qalendar'
import Menu from '@/volt/Menu.vue'
import { ref, type Ref, useTemplateRef } from 'vue'
import type { MenuItem } from 'primevue/menuitem'
import { useRouter } from 'vue-router'
import OverlayBadge from '@/volt/OverlayBadge.vue'
import Badge from '@/volt/Badge.vue'
import Settings from '@/router/views/Settings.vue'
import { useRefugioStore } from '@/stores/refugio.ts'
import Notificaciones from '@/components/menu/Notificaciones.vue'

const router = useRouter()
const authStore = useAuthStore()
const refugioStore = useRefugioStore()
const menuAccesoRapido = useTemplateRef('menuAccesoRapido')

const itemsMenuAccesoRapido: Ref<MenuItem[]> = ref([
    {
        label: 'Gestiones',
        items: [
            {
                label: 'Mis animales',
                command: () => router.push('/usuario/mascotas')
            },
            {
                label: 'Solicitudes',
                command: () => router.push('/usuario/solicitudes')
            },
            {
                label: 'Inscripción a eventos',
                command: () => router.push('/usuario/eventos')
            }
        ]
    }
])
const toggle = (event: Event) => {
    menuAccesoRapido.value?.toggle(event)
}

</script>

<template>
    <Menubar>
        <template #end>
            <div class="flex flex-row gap-3 w-full justify-end text-xl">
                <div v-if="authStore.user" class="font-semibold text-3xl text-white m-auto px-5">
                    ¡Hola, {{ authStore.user.nombre }}!
                </div>
                <!--                <Settings title="Configuración"></Settings>-->
                <div class="flex flex-row gap-5 justify-around" id="buttons">
                    <Notificaciones></Notificaciones>
                    <Button :title="`ir a ${refugioStore.refugio.nombre}`" v-if="refugioStore.refugio" icon="pi pi-home"
                            class="flex-col! h-fit my-auto bg-refugio-500! border-refugio-500! hover:bg-refugio-300! hover:border-refugio-300!" @click="() => router.push('/refugio')"></Button>
                </div>
                <UsuarioTag v-if="authStore.user" :user="authStore.user"></UsuarioTag>
            </div>
        </template>
    </Menubar>
    <div class="mx-3 rounded-lg flex flex-row justify-between my-2">
        <div class="w-[50%] my-auto">
                <Button type="button" icon="pi pi-bars" @click="toggle" aria-haspopup="true"
                        aria-controls="overlay_menu" />
            <Menu pt:submenulabel="text-black font-semibold text-center bg-gray-100" ref="menuAccesoRapido"
                  id="overlay_menu" :model="itemsMenuAccesoRapido" :popup="true">
                <template #item="{ item, props }">
                    <a class="flex items-center" v-bind="props.action">
                        <span :class="item.icon" />
                        <span>{{ item.label }}</span>
<!--                        <Badge severity="danger" v-if="item.badge" class="ml-auto" :value="item.badge" />-->
                    </a>
                </template>
            </Menu>
        </div>
        <div class="flex flex-row gap-3">
            <Button label="Quiero adoptar" @click="() => router.push('/usuario/adoptar')"></Button>
            <Button icon-pos="left" label="Quiero transitar" @click="() => router.push('/usuario/transitar')"></Button>
        </div>
    </div>
    <router-view></router-view>
</template>

<style scoped>

</style>
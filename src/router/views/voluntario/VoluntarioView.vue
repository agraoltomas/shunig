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
import OverlayBadge from "@/volt/OverlayBadge.vue"
import Badge from "@/volt/Badge.vue"
import Logout from '@/router/views/Logout.vue'

const router = useRouter()
const authStore = useAuthStore()
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
            },
            {
                label: 'Notificaciones',
                badge: "99+",
                command: () => {}
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
            <div class="flex flex-row gap-3">
                <div class="align-middle m-auto text-white font-bold text-3xl">VISTA VOLUNTARIO</div>
                <Logout></Logout>
                <UsuarioTag v-if="authStore.user" :user="authStore.user"></UsuarioTag>
            </div>
        </template>
    </Menubar>
    <div class="mx-3 rounded-lg flex flex-row justify-between my-2">
        <div class="w-[50%] my-auto">
            <OverlayBadge severity="danger" value="99+" >
                <Button type="button" icon="pi pi-bars" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" />
            </OverlayBadge>
            <Menu pt:submenulabel="text-black font-semibold text-center bg-gray-100" ref="menuAccesoRapido"
                  id="overlay_menu" :model="itemsMenuAccesoRapido" :popup="true">
                <template #item="{ item, props }">
                    <a class="flex items-center" v-bind="props.action">
                        <span :class="item.icon" />
                        <span>{{ item.label }}</span>
                        <Badge severity="danger" v-if="item.badge" class="ml-auto" :value="item.badge" />
                    </a>
                </template>
            </Menu>
        </div>
        <div class="flex flex-row gap-3">
            <Button  label="Quiero adoptar" disabled></Button>
            <Button disabled icon-pos="left" label="Quiero Transitar" ></Button>
        </div>
        <!--                <Dialog :visible="true" modal class="bg-white!">-->
        <!--                    hola-->
        <!--                </Dialog>-->
    </div>
    <router-view></router-view>
</template>

<style scoped>

</style>
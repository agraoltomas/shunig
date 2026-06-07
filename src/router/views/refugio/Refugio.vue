<script setup lang="ts">
import Menubar from '@/components/Menubar.vue'
import Menu from '@/volt/Menu.vue'
import type { MenuItem } from 'primevue/menuitem'
import { ref, type Ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import UsuarioTag from '@/components/generales/UsuarioTag.vue'
import { useRefugioStore } from '@/stores/refugio.ts'
import { useAuthStore } from '@/stores/auth.ts'
import { useModalStore } from '@/stores/modales.ts'
import Settings from '@/router/views/Settings.vue'

const router = useRouter()

const modalesStore = useModalStore()
const { refugio } = useRefugioStore()
const authStore = useAuthStore()
const itemsMenuAccesoRapido: Ref<MenuItem[]> = ref([
    {
        label: 'Gestiones',
        items: [
            {
                label: 'Mis animales',
                command: () => router.push('/refugio/mascotas')
            },
            {
                label: 'Animales en tránsito',
                command: () => router.push('/refugio/transito')
            },
            {
                label: 'Solicitudes pendientes',
                command: () => router.push('/refugio/solicitudes')
            },
            {
                label: 'Eventos de vacunación',
                command: () => router.push('/refugio/vacunas')
            },
            {
                label: 'Control de stock',
                command: () => router.push('/refugio/inventario')
            },
            {
                label: 'Patrocinadores',
                command: () => router.push('/refugio/patrocinadores')
            }
        ]
    }
])
const toggle = (event: Event) => {
    menuAccesoRapido.value?.toggle(event)
}
const menuAccesoRapido = useTemplateRef('menuAccesoRapido')
if (!authStore.user) {
    router.push('/login')
}


</script>

<template>
    <Menubar>
        <template #end>

            <div class="flex flex-row gap-3">
                <div v-if="refugio" class=" m-auto h-full w-full text-center flex flex-row justify-start">
                    <div class="font-semibold text-3xl text-white m-auto px-5">
                        ¡Hola, {{ refugio?.nombre }}!
                        <span class="px-3 text-red-300" v-if="!refugio.estado_activo">
                            Tu refugio esta desactivado
                        </span>
                    </div>
                </div>
                <div class="flex flex-row m-auto">
<!--                    <Settings title="Configuración"></Settings>-->
<!--                    <Logout title="Cerrar sesión"></Logout>-->
                </div>
                <Button :title="`ir a pantalla de usuario`" v-if="authStore.user" icon="pi pi-user" class="flex-col! h-fit my-auto" @click="() => router.push('/usuario')" ></Button>
                <UsuarioTag v-if="authStore.user" :user="authStore.user"></UsuarioTag>
            </div>
        </template>
    </Menubar>
    <div class="mx-3 rounded-lg flex flex-row justify-between my-2">
        <div class="w-[50%] my-auto">
            <Button type="button" icon="pi pi-bars" class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500 " @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" />
            <Menu pt:submenulabel="text-black font-semibold text-center bg-gray-100" ref="menuAccesoRapido"
                  id="overlay_menu" :model="itemsMenuAccesoRapido" :popup="true">
            </Menu>
        </div>
        <div class="flex flex-row gap-3">
            <Button icon="pi pi-plus" class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500 " icon-pos="left" label="Animal"
                    @click="() => modalesStore.abrir('nuevoAnimal')"></Button>
            <Button @click="() => router.push('/refugio/evento-vacunacion/ingresar/')"
                    icon="pi pi-plus" class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500 " icon-pos="left" label="Evento de Vacunación"></Button>
            
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
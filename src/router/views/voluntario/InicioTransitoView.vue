<script setup lang="ts">
import { onMounted, type Ref, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth.ts'
import { useResponse } from '@/lib/utils/response.ts'
import { useAxios } from '@/lib/axios.ts'
import { rutas_api } from '@/rutas_api.ts'
import { useToast } from '@/lib/toast/toast.ts'
import type { IRefugio } from '@/lib/tipos/refugio'
import domicilio from '@/lib/modelos/domicilio.ts'
import type { Maybe } from '@/lib/tipos/generics'
import { useRouter } from 'vue-router'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
import type { IMascota } from '@/lib/tipos/mascotas'
import Modal from '@/components/modal/Modal.vue'
import MascotaDetalle from '@/components/mascotas/MascotaDetalle.vue'
import { useModalStore } from '@/stores/modales.ts'
import ProgressSpinner from '@/volt/ProgressSpinner.vue'
import AnimalCard from '@/components/adopcion/AnimalCard.vue'
import ListPicker from '@/components/generales/ListPicker.vue'
import SurfaceButton from '@/volt/SurfaceButton.vue'
import handshake from '@/assets/images/handshake-regular-full-white.svg'

const refugio: Ref<Maybe<IRefugio>> = ref(null)
const refugios: Ref<IRefugio[]> = ref([])
const tipo: Ref<Maybe<string>> = ref(null)
const animales: Ref<IMascota[]> = ref([])
const authStore = useAuthStore()
const { unwrap, tryUnwrapError, tryLogError } = useResponse()
const { axios } = useAxios()
const toast = useToast()
const router = useRouter()
const modal = useModalStore()
const { loading, startLoading, stopLoading } = useLoadingComposable()
onMounted(() => {
    loadRefugios()
})
const loadRefugios = async () => {
    if (!authStore.user) return
    try {
        const r = await unwrap(axios.value.get(rutas_api.refugio.LIST()))
        refugios.value = r.data
    } catch (err) {
        tryLogError(<Error>err, toast)
    }
}
const loadAnimales = async () => {
    animales.value = []
    startLoading()
    if (!tipo.value || !refugio.value) return
    try {
        const filtros = {
            estado: 'refugio',
            especie: tipo.value
        }
        const r = await unwrap<IMascota[]>(axios.value.get(rutas_api.animales.LIST(), {
            params: {
                ...filtros
            }
        }))
        animales.value = r.data
    } catch (err) {
        tryLogError(<Error>err, toast)
    } finally {
        stopLoading()
    }
}
watch(() => tipo.value, () => {
    loadAnimales()
})
watch(() => refugio.value, () => {
    if (!refugio.value) animales.value = []
})
const showAnimal = (a: IMascota) => {

}

</script>

<template>
    <Panel class="m-3">
        <Message class="mb-3" v-if="!refugio" severity="info">
            Seleccione un refugio para comenzar
        </Message>
        <div class="flex flex-row gap-3 ">
            <ListPicker v-if="!refugio" :data="refugios" @selected="(r) => refugio = r">
                <template #default="{ item}">
                    <div class="flex flex-col gap-3 border-surface-200 w-full">
                        <div class="font-semibold text-xl">{{ item.nombre }}</div>
                        <div class="flex flex-row gap-3 pb-3">
                            <span class="pi pi-map-marker my-auto"></span>
                            <span class="pb-0.5">{{ domicilio.toText(item.domicilio) }}</span>
                        </div>
                    </div>
                </template>
            </ListPicker>
            <div v-else class="border border-surface-300 rounded-lg p-3">
                <div class="flex flex-col gap-3 border-surface-200 w-full">
                    <div class="flex flex-row justify-between">
                        <div class="font-semibold text-xl">{{ refugio.nombre }}</div>
                        <Tag class="bg-gray-100! hover:bg-gray-200! hover:cursor-pointer" icon="pi pi-times"
                             @click="() => {refugio = null; tipo = null}"></Tag>
                    </div>
                    <div class="flex flex-row gap-3 pb-3">
                        <span class="pi pi-map-marker my-auto"></span>
                        <span class="pb-0.5">{{ domicilio.toText(refugio.domicilio) }}</span>
                    </div>
                </div>
            </div>
            <ListPicker v-if="refugio && !tipo" header="Tipo de animal" :data="['Perro','Gato']" @selected="(t) => tipo = t">

            </ListPicker>
            <div v-else-if="tipo" class="border border-surface-300 rounded-lg p-3 h-fit ">
                <div class="flex flex-row gap-3 justify-between ">
                    <div class="font-semibold text-xl">{{ tipo }}</div>
                    <Tag class="bg-gray-100! hover:bg-gray-200! hover:cursor-pointer" icon="pi pi-times"
                         @click="() => {tipo = null}"></Tag>
                </div>
            </div>
        </div>
        <Panel v-if="refugio && tipo" header="Animales" class="mt-3">
            <div class="flex flex-row w-full flex-wrap gap-3 justify-center m-auto">
                <ProgressSpinner v-if="loading"></ProgressSpinner>
                <AnimalCard v-for="animal in animales" :animal="animal" label="Transitar">
                    <SurfaceButton class="mx-auto!" label="Transitar"
                                   @click.capture=" () => modal.abrir('nuevoTransito', { mascota: animal, usuario: authStore.user })">
                        <template #icon>
                            <img class="size-5 text-white" :src="handshake"></img>
                        </template>
                    </SurfaceButton>
                </AnimalCard>
            </div>
        </Panel>
    </Panel>
    <Modal nombre="mostrarAnimal" class="min-w-[35em] m-auto!" modal title="">
        <template #default="{closeFn, context}">
            <MascotaDetalle v-if="context.mostrarAnimal" :mascota="context.mostrarAnimal"></MascotaDetalle>
        </template>
    </Modal>

</template>

<style scoped>
.clipped {
    clip-path: circle(50% at 50% 50%);
}
</style>
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
import { useRoute, useRouter } from 'vue-router'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
import type { IMascota } from '@/lib/tipos/mascotas'
import Modal from '@/components/modal/Modal.vue'
import MascotaDetalle from '@/components/mascotas/MascotaDetalle.vue'
import { useModalStore } from '@/stores/modales.ts'
import ProgressSpinner from '@/volt/ProgressSpinner.vue'
import AnimalCard from '@/components/adopcion/AnimalCard.vue'
import ListPicker from '@/components/generales/ListPicker.vue'
import paw from '@/assets/images/paw-solid-full.svg'
import SurfaceButton from '@/volt/SurfaceButton.vue'
import { AxiosError } from 'axios'
import Contenedor from '@/components/generales/Contenedor.vue'
import { getDistanceTo } from '@/lib/utils/maps.ts'
import Distance from '@/components/generales/maps/Distance.vue'


const refugio: Ref<Maybe<IRefugio>> = ref(null)
const refugios: Ref<(IRefugio&{distancia: number})[]> = ref([])
const tipo: Ref<Maybe<{ label: string, id: number }>> = ref(null)
const animales: Ref<IMascota[]> = ref([])
const authStore = useAuthStore()
const { unwrap,  tryLogError } = useResponse()
const { axios } = useAxios()
const toast = useToast()
const router = useRouter()
const route = useRoute()
const modal = useModalStore()
const { loading, startLoading, stopLoading } = useLoadingComposable()
const mascota: Ref<Maybe<IMascota>> = ref(null)

onMounted(async () => {
    if (route.query.m) {
        await loadMascota()
        if (!mascota.value) {
            await loadRefugios()
        } else {
            modal.abrir('mostrarAnimal', mascota.value)
        }
    } else {
        await loadRefugios()
    }
})
const loadMascota = async () => {
    startLoading()
    try {
        const r = await axios.value.get(`/animal/${route.query.m}`)
        if (r.status == 200) {
            console.log(r.data)
            mascota.value = r.data.data
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.status == 404) {
                mascota.value = null
            }
        }
    }
    stopLoading()

}
const loadRefugios = async () => {
    if (!authStore.user) return
    try {
        const response = await unwrap<IRefugio[]>(axios.value.get(rutas_api.refugio.LIST()))
        let listRefugios: (IRefugio&{distancia?: number})[] = response.data;
        const fns = (await Promise.all(listRefugios.map(async r => {
            return {
                ...r,
                distancia: r.domicilio ? (await getDistanceTo(r.domicilio)) ?? 0 : 0
            }
        }))).sort((a, b) =>(a.distancia ?? 0)-(b.distancia ?? 0))
        console.log(fns)
        refugios.value = fns
    } catch (err) {
        tryLogError(<Error>err, toast)
    }
}
const loadAnimales = async () => {
    animales.value = []
    startLoading()
    if (!tipo.value || !refugio.value) return
    const filtros = {
        estado: ['transito', 'refugio'],
        id_especie: tipo.value.id
    }
    try {
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

watch(() => route.query.m, async () => {
    if (route.query.m) {
        await loadMascota()
        if (mascota.value) {
            modal.abrir('mostrarAnimal', mascota.value)
        } else {
            modal.cerrar('mostrarAnimal')
        }
    } else {
        loadRefugios()
    }
})
const showAnimal = (a: IMascota) => {

}
</script>

<template>
    <div :hidden="modal.modales.mostrarAnimal" class="m-3">
        <Message class="mb-3" v-if="!refugio" severity="info">
            Seleccione un refugio para comenzar
        </Message>
        <div class="flex flex-row gap-3 ">
            <ListPicker v-if="!refugio" :data="refugios" @selected="(r) => {refugio = r; getDistanceTo(r.domicilio)}">
                <template #default="{ item}">
                    <div class="flex flex-col gap-3 border-surface-200 w-full">
                        <div class="font-semibold text-xl">{{ item.nombre }}</div>
                        <div class="flex flex-row gap-3 pb-3 justify-between">
                            <div class="flex flex-row gap-3">
                                <span class="pi pi-map-marker my-auto"></span>
                                <span class="pb-0.5">{{ domicilio.toText(item.domicilio) }}</span>
                            </div>
                            <Distance v-if="item.domicilio" :domicilio="item.domicilio"></Distance>
                        </div>
                    </div>
                </template>
            </ListPicker>
            <Contenedor v-else class=" rounded-lg p-3 h-fit">
                <div class="flex flex-col gap-3 border-surface-200 w-full">
                    <div class="flex flex-row justify-between">
                        <div class="flex flex-row gap-3">
                            <i class="pi pi-home p-1 text-gray-500"></i>
                            <div class="font-semibold text-xl">{{ refugio.nombre }}</div>
                        </div>
                        <Tag class="bg-gray-100! hover:bg-gray-200! hover:cursor-pointer" icon="pi pi-times"
                             @click="() => {refugio = null; tipo = null}"></Tag>
                    </div>
                    <div class="flex flex-row gap-3 pb-3">
                        <span class="pi pi-map-marker my-auto"></span>
                        <span class="pb-0.5 text-xs text-gray-500">{{ domicilio.toText(refugio.domicilio) }}</span>
                    </div>
                </div>
            </Contenedor>
            <ListPicker v-if="refugio && !tipo" header="Tipo de animal"
                        :data="[{label: 'Perro', id: 1},{label: 'Gato', id: 2}]"
                        @selected="(t) => tipo = t">
                <template #default="{ item }">
                    <div class="text-xl font-semibold px-3 py-4  ">
                        {{ item.label }}
                    </div>
                </template>
            </ListPicker>
            <Contenedor v-else-if="tipo" class="border border-surface-300 rounded-lg p-3 h-fit ">
                <div class="flex flex-row gap-3 justify-between ">
                    <div class="font-semibold text-xl">{{ tipo.label }}</div>
                    <Tag class="bg-gray-100! hover:bg-gray-200! hover:cursor-pointer" icon="pi pi-times"
                         @click="() => {tipo = null}"></Tag>
                </div>
            </Contenedor>
        </div>
        <div v-if="refugio && tipo" class="mt-3">
            <div class="flex flex-row w-full flex-wrap gap-3 justify-center m-auto">
                <ProgressSpinner v-if="loading"></ProgressSpinner>
                <AnimalCard v-for="animal in animales" :animal="animal" label="Adoptar">
                    <SurfaceButton class="mx-auto!" label="Adoptar"
                                   @click.capture=" () => {
                                       modal.abrir('adopcion', { mascota: animal, usuario: authStore.user })
                                   }">
                        <template #icon>
                            <img class="size-5 text-white" :src="paw"></img>
                        </template>
                    </SurfaceButton>
                </AnimalCard>
            </div>
        </div>
    </div>
    <Modal nombre="mostrarAnimal" class="min-w-[35em] m-auto!" modal title="">
        <template #default="{closeFn, context}">
            <MascotaDetalle v-if="context.mostrarAnimal" :mascota="context.mostrarAnimal"></MascotaDetalle>
            <div class="flex flex-row p-3 justify-end">
                <SurfaceButton class="mx-auto!" label="Adoptar"
                               @click.capture=" () => {
                                       console.log('aca');
                                       modal.abrir('adopcion', { mascota: context.mostrarAnimal, usuario: authStore.user })
                                   }"></SurfaceButton>
            </div>
        </template>
    </Modal>
</template>

<style scoped>
.clipped {
    clip-path: circle(50% at 50% 50%);
}
</style>
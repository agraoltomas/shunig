<script setup lang="ts">

import { computed, onMounted, ref, type Ref, useTemplateRef, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { IMascota } from '@/lib/tipos/mascotas'
import { useResponse } from '@/lib/utils/response.ts'
import { useAxios } from '@/lib/axios.ts'
import { rutas_api } from '@/rutas_api.ts'
import Carrusel from '@/volt/Carrusel.vue'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
import ProgressSpinner from '@/volt/ProgressSpinner.vue'
import paw from '@/assets/images/paw-solid-full-purple.svg'
import banner from "@/assets/images/banner-intro.png"
import RefugioButton from '@/volt/RefugioButton.vue'
import { useScroll } from '@/lib/utils/scroll.ts'
import ScrollArrow from '@/components/generales/ScrollArrow.vue'

const router = useRouter()
const animales: Ref<IMascota[]> = ref([])


const { unwrap } = useResponse()
const { axios } = useAxios()

const { loading, startLoading, stopLoading } = useLoadingComposable()

onMounted(async () => {

    const filtros = {
        estado: ['transito', 'refugio']
    }
    startLoading()
    try {
        const r = await unwrap<IMascota[]>(axios.value.get(rutas_api.animales.LIST(), {
            params: {
                ...filtros
            }
        }))
        animales.value = r.data
    } catch (e) {

    } finally {
        stopLoading()
    }
});


const refugioBanner = useTemplateRef("refugioBanner");

</script>

<template>
    <Panel v-if="loading" class="w-96 m-auto">
        <ProgressSpinner class="m-auto"></ProgressSpinner>
    </Panel>
    <Panel v-else class="m-auto w-[90vw] bg-transparent border-0!">
        <div class="flex flex-row">
            <div class="basis-[50%] flex flex-col gap-3 mt-20">
                <h1 class="text-4xl py-3 pb-4 text-center font-bold">Adoptá. Rescatá. <p class="text-primary">Transitá</p></h1>
                <h1 class="text-2xl text-center w-96 mx-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit. </h1>
                <div class="flex flex-row gap-10 justify-center">
                    <Button label="Quiero ayudar" icon="pi pi-heart-fill"></Button>
                    <Button variant="outlined" label="¿Sos un refugio?" @click="() => refugioBanner?.scrollIntoView({behavior: 'smooth'})"></Button>
                </div>
            </div>
        <Carrusel class="m-auto" :animales="animales"></Carrusel>
        </div>
    </Panel>
    <div class="h-25"></div>
    <div class="w-[65vw] rounded-lg  m-auto bg-[#56448e]/20! border-0!" ref="refugioBanner">
        <div class="flex flex-row">
            <div class="flex flex-col gap-3 text-refugio-500 p-3 pr-6">
                <h1 class="text-4xl  ">¿Tenés un refugio o <br>rescatás animales?</h1>
                <h1 class="text-">Administrá adopciones, solicitudes y mascotas desde nuestra plataforma.</h1>
                <div class="flex flex-row gap-3">
                    <div class="text-center flex flex-col gap-2 w-25 text-xs">
                        <img :src="paw" class="mx-auto w-6" >
                        <span> Publicá mascotas</span>
                    </div>
                    <div class="text-center flex flex-col gap-2 w-25 text-xs">
                        <span class="pi pi-clipboard text-lg text-refugio-500"></span>
                        <span> Gestioná solicitudes</span>
                    </div>
                    <div class="text-center flex flex-col gap-2 w-25 text-xs">

                        <span class="pi pi-chart-line text-lg text-refugio-500"></span>
                        <span> Hacé seguimiento de adopciones</span>
                    </div>
                    <div class="text-center flex flex-col gap-2 w-25 text-xs">
                        <span class="pi pi-users text-lg text-refugio-500"></span>
                        <span> Administra tu propio panel</span>
                    </div>
                </div>
                <div class="flex flex-row justify-around">
                    <RefugioButton class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500 " icon="pi pi-house" label="Quiero registrar mi refugio" @click="() => router.push('/register?t=refugio')"></RefugioButton>
                    <Button class="text-refugio-500! hover:bg-refugio-200!" icon="pi pi-arrow-right" icon-pos="right" variant="text" label="Mas informacion"></Button>
                </div>
            </div>
            <div class="my-auto">
                <Image :src="banner"></Image>
            </div>
        </div>
    </div>

    <div class="flex flex-row h-50 text-center  mt-5 bg-[#edeff0]/40 border-t-0.5 border-t-slate-500/40 shadow-black shadow-lg pt-7 pb-3 px-5 justify-around">
        <div class="flex flex-col">
            <div class="flex flex-row gap-1 align-bottom">
                <img class="w-15" :src="paw" alt="Pata">
                <span class=" text-3xl vertical-bottom h-fit self-center">Shunig</span>
            </div>
        </div>
        <div>
            <span class="text-lg font-semibold">Navegación</span>
        </div>
        <div>
            <span class="text-lg font-semibold">Ayuda</span>
        </div>
        <div>
            <span class="text-lg font-semibold">Seguinos</span>
        </div>
    </div>
    <ScrollArrow></ScrollArrow>
</template>

<style scoped>

</style>
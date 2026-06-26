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
import Footer from '@/components/generales/Footer.vue'
import ContenedorPagina from '@/components/generales/ContenedorPagina.vue'

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
const urlExterna = ref('https://youtu.be/qJ2WHyCY4PA?si=AZgkN3VRpUO5QHNC');

</script>
<!--Pagina principal de SHUNIG-->
<template>
    <Panel v-if="loading" class="w-96 m-auto">
        <ProgressSpinner class="m-auto"></ProgressSpinner>
    </Panel>
    <template v-else>
        <ContenedorPagina>
            <!--titulo + sliders-->
            <Panel class="m-auto w-full bg-transparent border-0!">
            <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                <div class="w-full lg:basis-1/2 flex flex-col gap-5 mt-20">
                    <h1 class="text-4xl py-3 pb-4 text-center font-bold">Adoptá. Rescatá. <p class="text-primary">Transitá</p></h1>
                    <div class="text-xl text-gray-500 text-center max-w-1/2 m-auto">
                        Conectamos a las personas con refugios para que más animales encuentren un cálido hogar, cuidados y una mejor atención
                    </div>
                    <div class="flex flex-col sm:flex-row gap-4 sm:gap-10 justify-center">
                    <Button label="Quiero ayudar" icon="pi pi-heart-fill" @click="() => router.push('register?t=transito')"></Button>
                    <Button variant="outlined" label="¿Sos un refugio?" @click="() => refugioBanner?.scrollIntoView({behavior: 'smooth'})"></Button>
                    </div>
                </div>
                <div class="w-full lg:basis-1/2">
                    <Carrusel class="m-auto" :animales="animales"></Carrusel>
                </div>                
            </div>
            </Panel>
            <!--fin titulo + sliders-->
            <div class="h-16 sm:h-20"></div>
            <!--banner refugio-->
            <div class="w-full rounded-lg m-auto bg-[#56448e]/20! border-0!" ref="refugioBanner">
                <div class="flex flex-col lg:flex-row">
                <div class="flex flex-col gap-5 text-refugio-500 p-5 sm:p-6 lg:pr-6 grow">
                    <h2 class="text-4xl  ">¿Tenés un refugio o <br>rescatás animales?</h2>
                    <p class="text-">Administrá adopciones, solicitudes y mascotas desde nuestra plataforma.</p>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div class="text-center flex flex-col gap-2 text-xs">
                            <img :src="paw" class="mx-auto w-6" aria-hidden="true">
                            <span> Publicá mascotas</span>
                        </div>
                        <div class="text-center flex flex-col gap-2 text-xs">
                            <span class="pi pi-clipboard text-lg text-refugio-500" aria-hidden="true"></span>
                            <span> Gestioná solicitudes</span>
                        </div>
                        <div class="text-center flex flex-col gap-2 text-xs">
                            <span class="pi pi-chart-line text-lg text-refugio-500" aria-hidden="true"></span>
                            <span> Hacé seguimiento de adopciones</span>
                        </div>
                        <div class="text-center flex flex-col gap-2 text-xs">
                            <span class="pi pi-users text-lg text-refugio-500" aria-hidden="true"></span>
                            <span> Administra tu propio panel</span>
                        </div>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-3 sm:justify-around items-center">
                        <RefugioButton class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500" icon="pi pi-house" label="Quiero registrar mi refugio" @click="() => router.push('/register?t=refugio')"></RefugioButton>
                        <a class="text-refugio-500! hover:bg-refugio-200! p-2" :href="urlExterna" target="_blank" rel="noopener noreferrer">Más información<i class="pi pi-arrow-right pl-2"></i></a>
                    </div>
                </div>
                <div class="my-auto justify-center shrink-0 p-4 hidden lg:visible!">
                    <Image :src="banner"></Image>
                </div>            
            </div>
        </div>            
            <!--fin banner refugio-->
        </ContenedorPagina>
         <Footer></Footer>
        <ScrollArrow></ScrollArrow>
    </template>
</template>

<style scoped>

</style>
<script setup lang="ts">

import paw from '@/assets/images/paw-solid-full-black.svg'
import dog from '@/assets/images/dog.png'
import deco from '@/assets/images/logo_sucio.png'
import moment from 'moment/moment'
import DangerButton from '@/volt/DangerButton.vue'
import EstadoSolicitud from '@/components/solicitud/EstadoSolicitud.vue'
import SolicitudInformacionPrincipal from '@/components/solicitud/detalle/SolicitudInformacionPrincipal.vue'
import SolicitudExperienciaConMascotas from '@/components/solicitud/detalle/SolicitudExperienciaConMascotas.vue'
import SinImagen from '@/components/generales/SinImagen.vue'
import DisponibilidadYCompromiso from '@/components/solicitud/detalle/DisponibilidadYCompromiso.vue'
import SolicitudVivienda from '@/components/solicitud/detalle/SolicitudVivienda.vue'
import type { ISolicitudCompleta } from '@/lib/tipos/solicitud.ts'
import { useRefugioStore } from '@/stores/refugio.ts'
import Contenedor from '@/components/generales/Contenedor.vue'


const props = withDefaults(defineProps<{ solicitud: ISolicitudCompleta, context?: ('usuario'|'refugio') }>(), {
    context: 'usuario'
});
const { refugio} = useRefugioStore()
const emits = defineEmits<{ aceptar: [], rechazar: []}>()
</script>
<!--Vista del detalle de la solicitud sea de adopción o de tránsito-->
<template>
    <div class="w-[75vw] m-auto flex flex-col gap-3 mt-10 mb-15">
        <!--        HEADER-->
        <Contenedor class="w-full overflow-auto m-auto" pt:header="p-0!">
            <div class="flex flex-col gap-3">
                <!-- Sector de botones -->
        <div class="flex flex-row justify-between items-center gap-4 pb-4 mb-5 border-b border-gray-200">
            <span class="font-bold text-2xl">Detalle de la solicitud</span>
            <div class="flex flex-row gap-3">
                <Button
                    class="!bg-transparent !border-refugio-500 !text-refugio-500 hover:!bg-refugio-200"
                    outlined
                    severity="secondary"
                    icon="pi pi-undo"
                    label="Volver"
                    @click="$router.go(-1)"
                />

                <Button
                    v-if="context === 'refugio' && solicitud.animal"
                    outlined
                    severity="success"
                    icon="pi pi-arrow-up-right"
                    label="Ver animal"
                    @click="$router.push(`/refugio/mascota/${solicitud.animal.id_animal}/`)"
                />
            </div>
        </div>
        <!-- fin sector de botones -->
         <div class="flex flex-row gap-5">
            <!--Imagen del animal-->
             <div v-if="solicitud?.animal" class="max-h-60 overflow-hidden m-3 rounded-lg text-center " >
                <img v-if="solicitud.animal.imagen" class="w-70  rounded-lg " :src="solicitud.animal.imagen" />
                <SinImagen v-else></SinImagen>
            </div>
            <!--fin imagen del animal-->
            <div class="flex flex-col my-3 mx-2 w-1/2 gap-3">
                <div class="flex flex-row gap-4">
                    <div class="h-fit my-auto font-bold text-2xl">Solicitud #{{ solicitud.id_solicitud }}</div>
                    <EstadoSolicitud :solicitud="solicitud" class="my-auto"></EstadoSolicitud>
                </div>
                <div class="flex flex-row gap-3 pb-4 shadow-[0_0.5px_0_0_rgba(0,0,0,0.1)] w-fit ">
                    <div class="flex flex-row gap-1">
                        <img class="w-5" :src="paw" />
                        <span class="">{{ solicitud.animal.nombre }}</span>
                    </div>
                    <div class="flex flex-row gap-1">
                        <img class="w-5" :src="dog" />
                        <span class="">
                            {{ solicitud.animal.especie }}
                        </span>
                    </div>
                    <div class="flex flex-row gap-1">
                        <span class="pi pi-calendar p-1"></span>
                        <span>{{ moment(solicitud.fecha_creacion).format('DD/MM/YYYY') }}</span>
                    </div>
                </div>
                <div class="grow my-6 flex flex-row gap-3">
                    <div class="rounded-full bg-green-200/30 w-25! h-25! p-auto">
                        <div class="pi pi-user text-[4em] text-primary-500 p-4 m-auto"></div>
                    </div>
                    <div class="flex flex-col">
                        <div class="text-3xl font-semibold">{{ solicitud.usuario.nombre }}</div>
                        <div class="flex flex-row">
                            <span class="pi pi-envelope p-1 text-primary-500"></span>
                            <div>{{ solicitud.usuario.email }}</div>
                        </div>
                        <div class="flex flex-row">
                            <span class="pi pi-phone p-1 text-primary-500"></span>
                            <div>{{ solicitud.usuario.telefono }}</div>
                        </div>
                    </div>
                </div>

            </div>
             <div v-if="context == 'refugio'  && solicitud.id_estado == '2' && refugio" class="shadow-[rgba(0,0,0,0.1)] grow flex flex-col gap-3 ml-5 m-2">
                <span class="font-semibold">Estado de la solicitud:</span>
                <Button fluid outlined severity="success" icon="pi pi-check" label="Aceptar" @click="() => $emit('aceptar')"></Button>
                <DangerButton fluid outlined severity="danger" icon="pi pi-times" label="Rechazar" @click="() => $emit('rechazar')"></DangerButton>
            </div>

         </div>
        </div>    
        </Contenedor>
        <!--        END HEADER-->
        <div class="flex flex-row gap-3 w-full">
            <SolicitudInformacionPrincipal v-if="solicitud" :solicitud="solicitud"></SolicitudInformacionPrincipal>
            <SolicitudVivienda :solicitud="solicitud"></SolicitudVivienda>
            <SolicitudExperienciaConMascotas :solicitud="solicitud"></SolicitudExperienciaConMascotas>
        </div>
        <div class="flex flex-row gap-3 w-full">
            <DisponibilidadYCompromiso class="h-fit p-3!" :solicitud="solicitud"></DisponibilidadYCompromiso>

            <div class="grow shadow-[0_0_10px_rgba(0,0,0,0.25)] rounded-2xl p-3 h-fit">
                <div class="flex flex-row text-xl gap-3">
                    <div class="bg-primary-200/30 rounded-full p-1 min-w-9 my-auto h-fit text-center">
                        <i class="pi pi-heart-fill text-primary-500 text-center"></i>
                    </div>
                    <div class="font-semibold h-fit my-auto">Motivación</div>
                </div>
                <div class="p-3">
                    <Textarea fluid disabled :value="solicitud.detalle.motivo"></Textarea>
                </div>
            </div>
            <div class="overflow-hidden bg-transparent w-60! "><img class="" :src="deco" /></div>
        </div>
    </div>
</template>

<style scoped>

</style>
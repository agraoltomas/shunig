<script setup lang="ts">
import { computed, onMounted, type Ref, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useResponse } from '@/lib/utils/response.ts'
import { useAxios } from '@/lib/axios.ts'
import { rutas_api } from '@/rutas_api.ts'
import type { IEventoVacunacion } from '@/lib/tipos/vacunacion.ts'
import type { Maybe } from '@/lib/tipos/generics'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
import Contenedor from '@/components/generales/Contenedor.vue'
import DangerButton from '@/volt/DangerButton.vue'
import { dayDiff } from '@/lib/utils/eventos.ts'
import moment from 'moment'
import { useRefugioStore } from '@/stores/refugio.ts'
import domicilio from '@/lib/modelos/domicilio.ts'
import ContenedorTitulo from '@/components/generales/ContenedorTitulo.vue'
import DataListGroup, { type DataListItem } from '@/components/generales/DataListGroup.vue'
import { type InscripcionEvento, useEventosVacunacionStore } from '@/stores/vacunas.ts'
import InscripcionEventoVacunacion from '@/components/vacunacion/InscripcionEventoVacunacion.vue'
import KPI from '@/components/refugio/Dashboard/KPI.vue'
import SinImagen from '@/components/generales/SinImagen.vue'
import { useModalStore } from '@/stores/modales.ts'

const route = useRoute()
const { unwrap } = useResponse()
const { axios } = useAxios()
const evento: Ref<Maybe<IEventoVacunacion>> = ref(null)
const { loading, startLoading, stopLoading } = useLoadingComposable()
const { refugio } = useRefugioStore()
const eventoStore = useEventosVacunacionStore()
const router = useRouter()
const modales = useModalStore()
onMounted(() => {
    if (!route.params.id) return
    loadEvento(route.params.id.toString())
    eventoStore.cargarInscripcionesEvento(route.params.id.toString())
})

const loadEvento = async (id_evento: string) => {
    startLoading()
    try {
        const r = await unwrap(axios.value.get(rutas_api.eventos_vacunacion.GET(id_evento.toString())))
        evento.value = r.data
    } catch (error) {
    } finally {
        stopLoading()
    }
}

const cupos = computed(() => {
    if (!evento.value) return 0
    const inscriptos = parseInt(evento.value.inscriptos)
    if (isNaN(inscriptos)) return evento.value.cupo_maximo
    return evento.value.cupo_maximo - inscriptos
})


const confirmarVacunacion = async (i: InscripcionEvento) => {
    if(!evento.value)return
    if(moment(evento.value.fecha_evento).isAfter(moment())){
        alert("No se puede aplicar la vacuna antes del evento")
        return
    }
    if (!confirm('¿Quiere confirmar que se aplico esta vacuna?')) return
    console.log(i)
    try{
        const r = await unwrap(axios.value.post(rutas_api.vacunas.APLICAR(i.id_evento_vacunacion, i.id_animal)))

    }catch (error){

    }finally{

    }
}

</script>
<!--Vista del detalle del evento de vacunación-->
<template>
    <Contenedor v-if="loading">
        <ProgressSpinner
            class="m-auto h-20! text-center"
            pt:circle="stroke-red-100 p-progressspinner-circle"
            pt:root="p-progressspinner w-full!"
            pt:spin="p-progressspinner-spin"
        />
    </Contenedor>
    <div v-else-if="evento" class="w-[75vw] m-auto mt-10 mb-15">
        <Contenedor class="overflow-auto w-full mb-5" pt:header="p-0!">
            <div class="flex flex-col gap-3">
                <!-- Sector de botones -->
                <div class="flex flex-row justify-between items-center gap-4 pb-4 mb-5 border-b border-gray-200">
                    <span class="font-bold text-2xl">Detalle del evento de vacunación</span>

                    <div class="flex flex-row gap-3">
                        <Button @click="$router.go(-1)" outlined
                                severity="secondary"
                                icon="pi pi-undo"
                                label="Volver"
                                class="!bg-transparent !border !border-refugio-500 !text-refugio-500
                            hover:!bg-refugio-200 rounded-md px-4 py-2 flex flex-row gap-2 items-center no-underline">
                        </Button>
                        <Button
                            outlined
                            severity="success"
                            icon="pi pi-pencil"
                            label="Editar evento"
                            @click="() => modales.abrir('editar_evento_vacunacion',evento)"
                        />
                        <DangerButton outlined
                                      icon="pi pi-trash"
                                      label="Cancelar evento"
                        />
                    </div>
                </div>
                <!-- fin sector de botones -->

                <div class="flex flex-row gap-5 w-full">
                    <!-- Icono evento -->
                    <div class="rounded-full bg-primary-200/30 w-28 h-28 flex items-center justify-center shrink-0">
                        <i class="pi pi-heart text-primary-500 text-4xl"></i>
                    </div>

                    <!-- Datos resumen -->
                    <div class="flex flex-col gap-4 flex-1 min-w-0">
                        <div class="flex flex-row flex-wrap gap-4 items-center">
                            <div class="font-bold text-3xl">
                                {{ evento.descripcion }}
                            </div>

                            <Tag
                                v-if="dayDiff(evento.fecha_evento) == 0"
                                value="Hoy"
                                severity="danger"
                            />

                            <Tag
                                v-else-if="dayDiff(evento.fecha_evento) > 0"
                                value="Próximo"
                                severity="warn"
                            />

                            <Tag
                                v-else
                                value="Finalizado"
                                severity="success"
                            />

                            <Tag
                                v-if="cupos == 0"
                                value="Cupo completo"
                                severity="danger"
                            />
                        </div>

                        <div class="flex flex-row flex-wrap gap-4 pb-4 shadow-[0_0.5px_0_0_rgba(0,0,0,0.12)] w-fit">
                            <div class="flex flex-row gap-2 items-center">
                                <span class="pi pi-calendar text-primary-500"></span>
                                <span>{{ moment(evento.fecha_evento).format('DD/MM/YYYY') }}</span>
                            </div>

                            <div class="flex flex-row gap-2 items-center">
                                <span class="pi pi-clock text-primary-500"></span>
                                <span>{{ evento.rango_horario }}</span>
                            </div>

                            <div class="flex flex-row gap-2 items-center">
                                <span class="pi pi-map-marker text-primary-500"></span>
                                <span>{{ domicilio.short(refugio?.domicilio) }}</span>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </Contenedor>
        <!--KPIs-->
        <div class="grid grid-cols-3 gap-4 mb-5">
            <Contenedor class="w-full">
                <KPI title="Animales inscriptos" :value="`${evento.inscriptos}/${evento.cupo_maximo}`"
                     icon="pi pi-chart-pie" subtitle="sobre el total">
                </KPI>
            </Contenedor>
            <Contenedor class="w-full">
                <KPI title="Cupos libres" :value="`${evento.cupo_maximo - parseInt(evento.inscriptos)}`"
                     icon="pi pi-user-plus" subtitle="Disponibilidad">
                </KPI>
            </Contenedor>
            <Contenedor class="w-full">
                <KPI title="Cantidad vacunados" :value="0" icon="pi pi-check-circle" subtitle="Animales con vacuna">
                </KPI>
            </Contenedor>
        </div>
        <!--fin KPIs-->

        <div class="grid grid-cols-12 gap-5 items-start">
            <!--Animales para inscribir al evento-->
            <Contenedor class="col-span-8 h-fit">
                <DataTable :value="eventoStore.inscripcionesEvento">
                    <Column header="Animal">
                        <template #body="{data}">
                            <div class="flex flex-row items-center gap-3">
                                <div class="overflow-hidden ">
                                    <img v-if="data['imagen']" class="w-15 h-15  rounded-full object-cover" :src="data['imagen']" />
                                    <SinImagen v-else class="w-15"></SinImagen>
                                </div>
                                <div class="flex flex-col gap-3">
                                    <div class="px-1 font-semibold h-fit">{{ data['nombre'] }}</div>
                                    <div class="text-sm"> {{ data['especie'] }}</div>
                                    <div class="text-sm"> {{ data['raza'] }}</div>
                                </div>
                            </div>
                        </template>
                    </Column>
                    <Column header="Responsable">
                        <template #body="{data}">
                            <div class="flex flex-col gap-3">
                                <div>{{ data['nombre_usuario'] }}</div>
                                <div class="text-sm">{{ data['email'] }}</div>
                                <div class="text-sm">{{ data['telefono'] }}</div>
                            </div>
                        </template>
                    </Column>
                    <Column header="Acciones">
                        <template #body="{data}">
                            <div class="flex flex-row gap-3">
                                <Button icon="pi pi-eye" aria-label="Ver detalle del animal" outlined
                                        class=" border-refugio-500! text-refugio-500! hover:bg-refugio-200!"
                                @click="() => router.push(`/refugio/mascota/${data['id_animal']}/`)"></Button>
                                <Button v-if="!data['aplicada']" aria-label="Confirmar vacunación" icon="pi pi-check"
                                        outlined class=" border-refugio-500! text-refugio-500! hover:bg-refugio-200!"
                                        @click="() => confirmarVacunacion(data)"></Button>
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </Contenedor>
            <!--fin animales para inscribir al evento-->
            <!--Informacion del evento-->
            <ContenedorTitulo class="col-span-4 h-fit" title="Información del evento"
                              icon="pi pi-info-circle">
                <div v-if="loading">
                    <ProgressSpinner></ProgressSpinner>
                </div>
                <div v-else-if="evento" class="flex flex-col gap-5">
                    <div class="flex flex-row text-sm justify-between px-5 border-b-gray-200 border-b pb-3">
                        <div class="w-20 text-wrap font-semibold">Vacuna</div>
                        <div class="h-fit text-gray-500">{{ evento.vacuna }}</div>
                    </div>
                    <div class="flex flex-row text-sm justify-between px-5 border-b-gray-200 border-b pb-3">
                        <div class="w-20 text-wrap font-semibold">Observaciones</div>
                        <div class="h-fit text-gray-500">{{ evento.observaciones }}</div>
                    </div>
                    <div class="flex flex-row text-sm justify-between px-5 border-b-gray-200 border-b pb-3">
                        <div class="w-20 text-wrap font-semibold">Fecha del evento</div>
                        <div class="h-fit text-gray-500">{{ moment(evento.fecha_evento).format('DD/MM/YYYY') }}</div>
                    </div>
                    <div class="flex flex-row text-sm justify-between px-5 border-b-gray-200 border-b pb-3">
                        <div class="w-20 text-wrap font-semibold">Rango horario</div>
                        <div class="h-fit text-gray-500">{{ evento.rango_horario }}</div>
                    </div>
                    <div class="flex flex-row text-sm justify-between px-5 border-b-gray-200 border-b pb-3">
                        <div class="w-20 text-wrap font-semibold">Ubicacion</div>
                        <div class="h-fit text-gray-500">{{ domicilio.short(refugio?.domicilio) }}</div>
                    </div>
                    <div class="flex flex-row text-sm justify-between px-5 border-b-gray-200 border-b pb-3">
                        <div class="w-20 text-wrap font-semibold">Veterinario responsable</div>
                        <div class="h-fit text-gray-500">{{ evento.veterinario_responsable ?? '-' }}</div>
                    </div>
                </div>
                <div></div>
            </ContenedorTitulo>
            <!--fin informacion del evento-->
        </div>


    </div>

    <div v-else>
        <Contenedor>
            <div class="text-center">
                Evento inexistente
            </div>
        </Contenedor>
    </div>
</template>

<style scoped>

</style>
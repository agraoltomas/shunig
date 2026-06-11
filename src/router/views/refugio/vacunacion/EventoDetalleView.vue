<script setup lang="ts">
import { computed, onMounted, type Ref, ref } from 'vue'
import { useRoute } from 'vue-router'
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

const route = useRoute()
const { unwrap } = useResponse()
const { axios } = useAxios()
const evento: Ref<Maybe<IEventoVacunacion>> = ref(null)
const { loading, startLoading, stopLoading } = useLoadingComposable()
const { refugio } = useRefugioStore()
const eventoStore = useEventosVacunacionStore()
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

const confirmarVacunacion = (i: InscripcionEvento) => {
    if (!confirm('¿Quiere confirmar que se aplico esta vacuna?')) return
    console.log(i)
}

</script>

<template>
    <Contenedor v-if="loading"></Contenedor>
    <div class="w-[70vw] m-auto" v-else-if="evento">
        <RouterLink :to="{ path: '/refugio/vacunacion'}"
                    class="mb-8 cursor-pointer flex flex-row gap-5 items-center font-semibold"><i
            class="pi pi-arrow-left"></i>
            <div class="h-fit">Volver a eventos de vacunacion</div>
        </RouterLink>
        <div class="flex flex-row justify-between gap-5">
            <div class="text-3xl font-semibold">{{ evento.descripcion }}</div>
            <div class="flex flex-row gap-3">
                <Button class="h-fit" size="small" variant="outlined" label="Editar evento"
                        icon="pi pi-pencil"></Button>
                <DangerButton class="h-fit py-1!" icon="pi pi-trash" label="Cancelar evento"></DangerButton>
            </div>
        </div>
        <div class="py-3">
            <Tag v-if="dayDiff(evento.fecha_evento) == 0" value="Hoy" severity="danger"></Tag>
            <Tag v-else-if="dayDiff(evento.fecha_evento) > 0" value="Próximo" severity="warn"></Tag>
            <Tag v-else value="Finalizado" severity="success"></Tag>
            <Tag v-if="cupos == 0" value="Cupo completo" severity="success"></Tag>
        </div>
        <div class="grid grid-cols-5 grid-rows-4 gap-4">
            <div class="flex flex-row justify-center gap-3 col-span-3">
                <Contenedor class="">
                    <KPI title="Cantidad de animales"  :value="evento.inscriptos" icon="pi pi-clipboard" subtitle="Inscriptos">
                    </KPI>
                </Contenedor>
                <Contenedor class="">
                    <KPI title="Cantidad de animales"  :value="0" icon="pi pi-clipboard" subtitle="Vacunados">
                    </KPI>
                </Contenedor>
                <Contenedor class="">
                    <KPI title="Cupos libres"  :value="`${evento.cupo_maximo - parseInt(evento.inscriptos)}/${evento.cupo_maximo}`" icon="pi pi-user-plus" subtitle="Sobre total">
                    </KPI>
                </Contenedor>
            </div>
            <ContenedorTitulo class="row-span-3 col-span-2 col-start-4" title="Información del evento"
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
            <Contenedor class="col-span-3 row-span-2 mt-0!">
                <DataTable :value="eventoStore.inscripcionesEvento">
                    <Column header="Animal">
                        <template #body="{data}">
                            <div class="flex flex-row items-center gap-3">
                                <div class="overflow-hidden ">
                                    <img class="w-15 h-15  rounded-full object-cover" :src="data['imagen']" />
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
                                <Button icon="pi pi-eye" outlined
                                        class="border-refugio-500! text-refugio-500!"></Button>
                                <Button icon="pi pi-check" outlined class="border-refugio-500! text-refugio-500!"
                                        @click="() => confirmarVacunacion(data)"></Button>
                            </div>
                        </template>
                    </Column>
                </DataTable>

            </Contenedor>
        </div>
    </div>
    <div v-else>
        <Contenedor>
            Evento inexistente
        </Contenedor>
    </div>
</template>

<style scoped>

</style>
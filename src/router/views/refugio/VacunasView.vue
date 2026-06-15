<script setup lang="ts">

import Contenedor from '@/components/generales/Contenedor.vue'
import { useEventosVacunacionStore } from '@/stores/vacunas.ts'
import { computed, onMounted, type Ref, ref } from 'vue'
import EventoCard from '@/components/eventos/voluntarios/EventoCard.vue'
import moment from 'moment/moment'
import type { IEventoVacunacion } from '@/lib/tipos/vacunacion.ts'
import { useRefugioStore } from '@/stores/refugio.ts'
import Modal from '@/components/modal/Modal.vue'
import { useModalStore } from '@/stores/modales.ts'
import FormCol from '@/components/forms/FormCol.vue'
import EditarEvento from '@/components/vacunacion/EditarEvento.vue'
import AccionesEventoRefugio from '@/components/vacunacion/AccionesEventoRefugio.vue'

const eventosStore = useEventosVacunacionStore()
const { refugio } = useRefugioStore()

onMounted(async () => {
    if (!refugio) return
    await eventosStore.cargar({ id_refugio: refugio?.id_refugio.toString() })
    console.log(eventosStore.eventos)
})
const eventosProximos = computed(() => {
    return eventosStore.eventos.filter(e => moment(e.fecha_evento).isSameOrAfter(moment()))
})
const eventosPasados = computed(() => {
    return eventosStore.eventos.filter(e => moment(e.fecha_evento).isBefore(moment()))
})
</script>

<template>
    <div class="mt-10 mb-15">    
    <div class="w-3/4 m-auto">
        <div class="bg-refugio-500 px-7 py-5 w-full h-full text-center text-4xl font-bold rounded-2xl">
            <span class="text-white">Eventos de vacunación</span></div>
    </div>
    <Contenedor class="w-[75%] m-auto mt-10">
        <Tabs value="1">
            <TabList value="1">
                <Tab value="1">
                    Todos
                </Tab>
                <Tab value="2">
                    Próximos
                </Tab>
                <Tab value="3">
                    Pasados
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="1">
                    <div class="flex flex-col gap-3">
                        <EventoCard v-for="e in eventosStore.eventos" :evento="e">
                            <template #end="e">
                                <AccionesEventoRefugio :evento="e"></AccionesEventoRefugio>
                            </template>
                        </EventoCard>
                    </div>
                </TabPanel>
                <TabPanel value="2">
                    <EventoCard v-for="e in eventosProximos" :evento="e">
                        <template #end="e">
                            <AccionesEventoRefugio :evento="e"></AccionesEventoRefugio>
                        </template>
                    </EventoCard>
                </TabPanel>
                <TabPanel value="3">
                    <EventoCard v-for="e in eventosPasados" :evento="e">
                        <template #end="e">
                            <AccionesEventoRefugio :evento="e"></AccionesEventoRefugio>
                        </template>
                    </EventoCard>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </Contenedor></div>
    <Modal nombre="editar_evento_vacunacion">
        <template #header>
            <div class="text-xl font-semibold text-white p-5">
                <i class="pi pi-pen-to-square p-1"></i>Editar evento de vacunación
            </div>
        </template>
        <template #default="{context: {editar_evento_vacunacion}, closeFn}">
            <EditarEvento v-if="editar_evento_vacunacion" :evento="editar_evento_vacunacion"
                          @close="closeFn"></EditarEvento>
        </template>
    </Modal>
</template>

<style scoped>

</style>
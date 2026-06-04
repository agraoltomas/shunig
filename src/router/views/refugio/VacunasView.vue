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

const { listar } = useEventosVacunacionStore()
const eventos: Ref<IEventoVacunacion[]> = ref([])
const { refugio } = useRefugioStore()

onMounted(async () => {
    if (!refugio) return
    eventos.value = await listar({ id_refugio: refugio?.id_refugio.toString() })
    console.log(eventos)
})
const eventosProximos = computed(() => {
    return eventos.value.filter(e => moment(e.fecha_evento).isSameOrAfter(moment()))
})
const eventosPasados = computed(() => {
    return eventos.value.filter(e => moment(e.fecha_evento).isBefore(moment()))
})
</script>

<template>
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
                        <EventoCard v-for="e in eventos" :evento="e">
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
    </Contenedor>
    <Modal nombre="editar_evento_vacunacion">
        <template #header>
            <div class="text-xl font-semibold text-gray-500 p-5">
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
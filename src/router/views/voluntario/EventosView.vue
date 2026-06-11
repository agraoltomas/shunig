<script setup lang="ts">
import Tabs from '@/volt/Tabs.vue'
import TabList from '@/volt/TabList.vue'
import Tab from '@/volt/Tab.vue'
import TabPanels from '@/volt/TabPanels.vue'
import TabPanel from '@/volt/TabPanel.vue'

import { onMounted, type Ref, ref } from 'vue'
import { useEventosVacunacionStore } from '@/stores/vacunas.ts'
import type { IEventoVacunacion } from '@/lib/tipos/vacunacion.ts'
import EventosInscripto from '@/components/eventos/voluntarios/EventosInscripto.vue'
import EventoCard from '@/components/eventos/voluntarios/EventoCard.vue'
import { useAxios } from '@/lib/axios.ts'
import { rutas_api } from '@/rutas_api.ts'
import { useResponse } from '@/lib/utils/response.ts'
import Modal from '@/components/modal/Modal.vue'
import InscripcionEventoVacunacion from '@/components/vacunacion/InscripcionEventoVacunacion.vue'
import { useModalStore } from '@/stores/modales.ts'

const eventoVacunacion = useEventosVacunacionStore()

const eventos: Ref<IEventoVacunacion[]> = ref([])

onMounted(async () => {
    await eventoVacunacion.cargar({ estado: 'disponible' })
    await eventoVacunacion.cargarInscripcionesUsuario()

})

const modales = useModalStore()


</script>

<template>
    <div class="h-full flex flex-col mx-20">
        <div class="w-fit m-auto flex flex-row">
            <div class="rounded-full bg-primary-200/40 p-2 w-10 text-center">
                <i class="pi pi-calendar text-primary-500"></i>
            </div>
            <span class="px-3 text-3xl leading-none">Eventos de vacunación</span>
        </div>
        <Tabs :value="1" pt:root="bg-transparent">
            <TabList>
                <Tab :value="1">
                    <i class="pi pi-pen-to-square mr-2"></i>A Inscribir
                </Tab>
                <Tab :value="2">
                    <i class="pi pi-check-square mr-2"></i>Inscripto
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel :value="1">
                    <div class="flex flex-col gap-1">
                        <EventoCard v-for="e in eventoVacunacion.eventos" :evento="e">
                            <template #end="evento">
                                <div class="h-full flex flex-col">
                                    <Button class="my-auto!" label="Inscribir" icon="pi pi-pen-to-square"
                                            @click="() => modales.abrir('inscripcion_evento_vacunacion', e)"></Button>
                                </div>
                            </template>
                        </EventoCard>
                    </div>
                </TabPanel>
                <TabPanel :value="2">
                    <EventosInscripto :eventos="eventos"></EventosInscripto>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
    <Modal nombre="inscripcion_evento_vacunacion">
        <template #header>
            <div class="text-xl font-semibold text-white p-5">
                <i class="pi pi-calendar-plus p-1"></i>Inscribir animales al evento
            </div>
        </template>
        <template #default="{context: {inscripcion_evento_vacunacion}}">
            <InscripcionEventoVacunacion v-if="inscripcion_evento_vacunacion"
                                         :evento="inscripcion_evento_vacunacion"></InscripcionEventoVacunacion>
        </template>
    </Modal>
</template>

<style scoped>

</style>
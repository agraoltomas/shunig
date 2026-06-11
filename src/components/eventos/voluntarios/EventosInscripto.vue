<script setup lang="ts">
import type { IEventoVacunacion } from '@/lib/tipos/vacunacion.ts'
import Tabs from '@/volt/Tabs.vue'
import TabList from '@/volt/TabList.vue'
import Tab from '@/volt/Tab.vue'
import TabPanels from '@/volt/TabPanels.vue'
import TabPanel from '@/volt/TabPanel.vue'
import EventoCard from '@/components/eventos/voluntarios/EventoCard.vue'
import { useEventosVacunacionStore } from '@/stores/vacunas.ts'
import { computed, onMounted } from 'vue'
import moment from 'moment'
import { useUsuarioStore } from '@/stores/usuario.ts'

const props = defineProps<{ eventos: IEventoVacunacion[]}>()

const eventosStore = useEventosVacunacionStore()
const animalStore = useUsuarioStore()
const eventosInscripto = computed(() => {
    const inscriptos = eventosStore.inscripcionesEvento.map(i => i.id_evento_vacunacion)
    return eventosStore.eventos.filter(e => inscriptos.includes(e.id_evento_vacunacion))
})
const eventosProximos = computed(() => {
    return eventosInscripto.value.filter(i => moment(i.fecha_evento).isSameOrAfter(moment()))
})

const animalesInscriptos = (e: IEventoVacunacion) => {
const ids_animal = eventosStore.inscripcionesEvento.filter(i => i.id_evento_vacunacion = e.id_evento_vacunacion).map(i => i.id_animal)
console.log(eventosStore.inscripcionesEvento, ids_animal, animalStore.animales)
 return animalStore.animales.filter(a => ids_animal.includes(a.id_animal))
}
onMounted(async () => {
    await animalStore.init()
})
</script>

<template>
        <Tabs :value="1" pt:root="bg-transparent">
            <TabList>
                <Tab :value="1">
                    Próximos<i class="pi pi-calendar-clock ml-2"></i>
                </Tab>
                <Tab :value="2">
                    Completados<i class="pi pi-check-circle ml-2"></i>
                </Tab>
                <Tab :value="3">
                    Cancelados<i class="pi pi-ban ml-2"></i>
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel :value="1">
                    <EventoCard v-for="e in eventosProximos" :evento="e">
                        <template #end>
                            <div class="flex flex-col min-w-50 border-s-gray-200 border-s px-4">
                                <div class="text-lg">Inscriptos:</div>
                                <div class="flex flex-row gap-1">
                                    <div v-for="a in animalesInscriptos(e)" class="py-1 px-3 border-gray-100 rounded-lg bg-gray-200">
                                        <div>{{a.nombre}}</div>
                                        <img :alt="a.id_animal" class="w-15" v-if="a.imagen" :src="a.imagen"/>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </EventoCard>
                </TabPanel>
                <TabPanel :value="2">
                </TabPanel>
            </TabPanels>
        </Tabs>
</template>

<style scoped>

</style>
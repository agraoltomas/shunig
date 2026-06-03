<script setup lang="ts">

import Contenedor from '@/components/generales/Contenedor.vue'
import { useEventosVacunacionStore } from '@/stores/vacunas.ts'
import { onMounted, type Ref, ref } from 'vue'
import EventoCard from '@/components/eventos/voluntarios/EventoCard.vue'
import moment from 'moment/moment'
import type { IEventoVacunacion } from '@/lib/tipos/vacunacion.ts'
const {listar, } = useEventosVacunacionStore()
const eventos: Ref<IEventoVacunacion[]> = ref([])
onMounted(async () => {
    eventos.value = await listar()
    console.log(eventos)
})
const dayDiff = (f: string) => {
    return moment(f).diff(moment(),'days')
}
const messageEventTiming = (e: IEventoVacunacion) => {
    const diff = dayDiff(e.fecha_evento)
    console.log(diff)
    if (diff > 0) {
        return `Evento dentro de ${diff} dia${diff == 1 ? '': 's'}`
    }else if(diff < 0){
        return `Completado el ${moment(e.fecha_evento).format("DD/MM/YYYY")}`
    }
}
</script>

<template>
    <Contenedor class="w-fit">
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
                                <div class="h-full flex flex-col border-l-gray-200 border-l px-3 justify-around">
                                    <div class=" flex flex-row gap-3">
                                        <Tag v-if="dayDiff(e.fecha_evento) == 0" value="Hoy" severity="danger"></Tag>
                                        <Tag v-else-if="dayDiff(e.fecha_evento) > 0" value="Próximo" severity="warn"></Tag>
                                        <Tag v-else value="Finalizado" severity="success"></Tag>
                                        <Tag v-if="e.cupos == 0" value="Cupo completo" severity="success"></Tag>
                                    </div>
                                    <div class="text-gray-600">{{messageEventTiming(e) }}</div>
                                    <div class="flex flex-rew gap-3 justify-between">
                                        <Button icon="pi pi-eye" label="Ver detalles" outlined></Button>
                                        <Button icon="pi pi-pencil" label="Editar" outlined></Button>
                                    </div>
                                </div>
                            </template>
                        </EventoCard>
                    </div>
                </TabPanel>
                <TabPanel value="2">
                    PROXIMOS
                </TabPanel>
                <TabPanel value="3">
                    PASADOS
                </TabPanel>
            </TabPanels>
        </Tabs>
    </Contenedor>
</template>

<style scoped>

</style>
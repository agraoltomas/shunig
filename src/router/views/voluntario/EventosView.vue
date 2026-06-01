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
const eventoVacunacion = useEventosVacunacionStore()

const eventos: Ref<IEventoVacunacion[]> = ref([])
const {axios} = useAxios()
const {unwrap} = useResponse()
onMounted(async () => {
    eventos.value = await eventoVacunacion.listar()
    console.log(eventos.value)
});
interface IVacuna{
    id_vacunacion: string,
    id_tipo_vacuna: string
}
const getVacunas = async (e: IEventoVacunacion) => {
    try{
        const r = await unwrap<IVacuna[]>(axios.value.get(rutas_api.vacunas.ANIMAL(11)))
        const vacunas = r.data;
        if(vacunas.map(v => v.id_tipo_vacuna).includes(e.vacuna_tipo.toString())){
            console.log("La tiene")
        }else{
            console.log("No la tiene")
        }
    }catch(error){}
}
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
                        <EventoCard v-for="e in eventos" :evento="e">
                            <template #end="evento">
                                <div class="h-full flex flex-col">
                                    <Button class="my-auto!" label="Inscribir" icon="pi pi-pen-to-square" @click="() => getVacunas(evento)"></Button>
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
</template>

<style scoped>

</style>
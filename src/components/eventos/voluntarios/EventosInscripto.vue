<script setup lang="ts">
import type { IEventoVacunacion } from '@/lib/tipos/vacunacion.ts'
import Tabs from '@/volt/Tabs.vue'
import TabList from '@/volt/TabList.vue'
import Tab from '@/volt/Tab.vue'
import TabPanels from '@/volt/TabPanels.vue'
import TabPanel from '@/volt/TabPanel.vue'
import EventoCard from '@/components/eventos/voluntarios/EventoCard.vue'

const props = defineProps<{ eventos: IEventoVacunacion[]}>()
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

                </TabPanel>
                <TabPanel :value="2">
                </TabPanel>
            </TabPanels>
        </Tabs>
</template>

<style scoped>

</style>
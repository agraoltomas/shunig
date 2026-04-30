<script setup lang="ts">
import MascotasRefugioTransito from '@/components/mascotas/MascotasRefugioTransito.vue'

</script>

<template>
    <div class="grid grid-cols-4 grid-rows-12 p-3 h-screen">
        <div class="col-span-4 row-span-12">
            <Panel class="border-white! border-0 overflow-auto" pt:header="p-0!">
                <template #header>
                    <div class="w-full h-full">
                         <div class="bg-surface-800 w-full h-full text-center text-4xl font-bold pl-3 py-4">
                            <span class="text-white">Animales en tránsito</span>
                        
                        </div>
                    </div>
                </template>
                <MascotasRefugioTransito></MascotasRefugioTransito>
            </Panel>
        </div>
    </div>
</template>

<style scoped>

</style>
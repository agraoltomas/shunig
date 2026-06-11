<script setup lang="ts">
import MascotasRefugioTransito from '@/components/mascotas/MascotasRefugioTransito.vue'
import MascotasRefugioAdopcion from '@/components/mascotas/MascotasRefugioAdopcion.vue'

</script>

<template>
    <div class="grid grid-cols-4 grid-rows-12 p-3 min-h-screen w-3/4 m-auto mt-5 mb-15">
        <div class="col-span-4 row-span-12">
            <Panel class="border-white!  shadow-[0_0_10px_rgba(0,0,0,0.25)] rounded-2xl border-0 overflow-auto" pt:header="p-0!">
                <template #header>
                    <div class="w-full h-full">
                         <div class="bg-refugio-500 px-7 py-5 w-full h-full text-center text-4xl font-bold pl-3">
                            <span class="text-white">Animales adoptados</span>
                        
                        </div>
                    </div>
                </template>
                <MascotasRefugioAdopcion></MascotasRefugioAdopcion>
            </Panel>
        </div>
    </div>
</template>

<style scoped>

</style>
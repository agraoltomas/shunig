<script setup lang="ts">
import Mascotas from '@/components/mascotas/Mascotas.vue'
</script>

<template>
    <div class="grid grid-cols-4 grid-rows-12 p-3 h-screen">
        <div class="col-span-2 row-span-12">
            <Panel class="border-surface-800! border-2 overflow-auto">
                <Mascotas></Mascotas>
            </Panel>
        </div>
    </div>
</template>

<style scoped>

</style>
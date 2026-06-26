<script setup lang="ts">
import AnimalSearch from '@/router/views/voluntario/search/AnimalSearch.vue'
</script>

<template>
    <AnimalSearch :filtros="{estado: ['refugio']}" action="adopcion">
        <template #actionButton="{accion}">
            <Button variant="outlined" class="mx-auto!" label="Adoptar" @click.stop="accion">
                <template #icon>
                    <Icon icon="famicons:paw" class="text-primary-500"></Icon>
                </template>
            </Button>
        </template>
    </AnimalSearch>
</template>

<style scoped>
.clipped {
    clip-path: circle(50% at 50% 50%);
}
</style>
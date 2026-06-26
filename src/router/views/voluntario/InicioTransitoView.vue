<script setup lang="ts">
import AnimalSearch from '@/router/views/voluntario/search/AnimalSearch.vue'
</script>

<template>
    <div>
        <AnimalSearch :filtros="{estado: ['refugio']}" action="nuevoTransito">
            <template #actionButton="{accion}">
                <Button variant="outlined" class="mx-auto!" label="Transitar" @click.stop="accion">
                    <template #icon>
                        <Icon icon="lucide:handshake" class="text-primary-500"></Icon>
                    </template>
                </Button>
            </template>
        </AnimalSearch>
    </div>
</template>

<style scoped>
.clipped {
    clip-path: circle(50% at 50% 50%);
}
</style>
<script setup lang="ts">
import {  onMounted, type Ref, ref } from 'vue'
import DataTable from '@/volt/DataTable.vue'
import axios from '@/lib/axios.ts'

import type { IMascota } from '@/lib/tipos/mascotas'
const mascotas: Ref<IMascota[]> = ref([]);
onMounted(async () => {
        const r = await axios.get(`/animal/`);
        if(r.status == 200){
            mascotas.value = r.data;
        }
        console.log(r)
})
</script>

<template>
    <div>
        <DataTable :value="mascotas">
            <Column header="Nombre" field="nombre">
            </Column>
            <Column header="Especie" field="especie">
            </Column>
            <Column header="Sexo" field="sexo">
            </Column>
            <Column>
                <template #body>
                    <Button icon="pi pi-arrow-up-right"></Button>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped>

</style>
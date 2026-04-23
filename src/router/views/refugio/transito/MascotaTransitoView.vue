<script setup lang="ts">
import { onMounted, type Ref, ref } from 'vue'
import type { Maybe } from '@/lib/tipos/generics'
import type { IMascota } from '@/lib/tipos/mascotas'
import axios from '@/lib/axios.ts'
import { AxiosError } from 'axios'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
import { useRoute } from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner'
import moment from 'moment'
import DataTable from '@/volt/DataTable.vue'
import Column from 'primevue/column'

const { loading, startLoading, stopLoading } = useLoadingComposable()
const mascota: Ref<Maybe<IMascota>> = ref(null)
const route = useRoute()
const loadMascota = async () => {
    startLoading()
    try {
        const r = await axios.get(`/animal/${route.params.id_animal}`)
        if (r.status == 200) {
            console.log(r.data)
            mascota.value = r.data.data
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.status == 404) {
                mascota.value = null
            }
        }
    }
    stopLoading()

}

onMounted(async () => {
    await loadMascota()
})
const STRING_LENGTH = 40;
const actualizaciones = ref([
    { images: [1],fecha: moment().add(1, 'days'), descripcion: 'Hoy jugo mucho!' },
    { images: [1,2,4],fecha: moment().add(2, 'days'), descripcion: 'comio algo que no debia y gomito' },
    { images: [1,2,4,5,4],fecha: moment().add(3, 'days'), descripcion: 'sin noticias' },
    {
        fecha: moment().add(4, 'days'),
        descripcion: 'se convirtio en un demonio lovecraftiano y me hizo temerle a la existencia misma'
    }
])
</script>

<template>
    <Panel v-if="mascota" class="w-[75%] m-auto ">
        <div class="flex flex-row">
            <div class="max-w-96! flex flex-col gap-3">
                <div class="m-auto text-3xl text-semibold w-fit">{{ mascota.nombre }}</div>
                <Image class="" v-if="mascota.imagen" :src="mascota.imagen"></Image>
                <div class="row-span-3">
                    <h1>Detalles de Transito</h1>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                </div>

            </div>
            <div class="m-auto w-full h-full">
                <DataTable :value="actualizaciones">
                    <template #header>
                        <div>Gestiona </div>
                    </template>
                    <Column header="Fecha" field="fecha">
                        <template #body="{data}">
                            {{ data['fecha'].format('DD/MM/YYYY') }}
                        </template>
                    </Column>
                    <Column header="Detalle">
                        <template #body="{data}">
                            <div class="max-w-52! text-wrap">{{ data['descripcion'].substring(0, STRING_LENGTH+1) }}{{data['descripcion'].length > STRING_LENGTH ? '...' : ''}}</div>
                        </template>
                    </Column>
                    <Column header="Fotos">
                        <template #body="{data}">
                            <Button v-if="data['images'] && data['images'].length > 0"  title="Ver fotos" :icon="data['images'].length > 1 ? 'pi pi-images' : 'pi pi-image'"></Button>
                            <span v-else>Sin fotos</span>
                        </template>|
                    </Column>

                </DataTable>
            </div>

        </div>
    </Panel>
    <Panel v-if="loading">
        <ProgressSpinner class="m-auto h-20! text-center" pt:circle="stroke-red-100 p-progressspinner-circle"
                         pt:root="p-progressspinner w-full!" pt:spin="p-progressspinner-spin" />
    </Panel>
</template>

<style scoped>

</style>
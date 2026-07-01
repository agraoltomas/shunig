<script setup lang="ts">
import { useAxios } from '@/lib/axios.ts'
import { AxiosError } from 'axios'
import { onMounted, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import type { Maybe } from '@/lib/tipos/generics'
import type { IMascota } from '@/lib/tipos/mascotas'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
import type { IVacuna } from '@/lib/tipos/vacunacion.ts'
import { rutas_api } from '@/rutas_api.ts'
import { useResponse } from '@/lib/utils/response.ts'
import Contenedor from '@/components/generales/Contenedor.vue'
import moment from 'moment'
import Dialog from '@/volt/Dialog.vue'
import FormRow from '@/components/forms/FormRow.vue'
import Label from '@/components/forms/Label.vue'
import TableSelect from '@/components/forms/TableSelect.vue'
import { TablaEstatica } from '@/lib/tipos/estaticos.ts'
import FormCol from '@/components/forms/FormCol.vue'
import DatePicker from "@/volt/DatePicker.vue"

const route = useRoute()
const { loading, stopLoading, startLoading } = useLoadingComposable()
const vacunas: Ref<IVacuna[]> = ref([])
const { unwrap } = useResponse()
const { axios } = useAxios()
const mascota: Ref<Maybe<IMascota>> = ref(null)
const agregarVacuna = ref(false)
const loadMascota = async () => {
    startLoading();
    try{
        const r = await unwrap(axios.value.get(`/animal/${route.params.id}`))
        mascota.value = r.data
    }catch (error) {
        if(error instanceof AxiosError) {
            if(error.status == 404) {
                mascota.value = null
            }
        }
    }
    stopLoading();

}
const getVacunas = async ()  => {
    if (!route.params.id) return
    startLoading()
    try {
        const r = await unwrap<IVacuna[]>(axios.value.get(rutas_api.vacunas.ANIMAL(route.params.id.toString())))
        vacunas.value = [...r.data, ...r.data]
        return r.data
    } catch (error) {
        return []
    } finally {
        stopLoading()
    }
}
onMounted(async () => {
    await getVacunas()
    await loadMascota()
})
</script>

<template>
    <div class="w-3/4 h-full m-auto flex flex-col gap-3">

        <Contenedor>
            <div class="flex flex-col gap-3">
                <div v-if="mascota" class="text-3xl p-3 m-auto">
                        Vacunas de {{mascota.nombre}}
                </div>
                <div>
                    <Button class="bg-refugio-500 border-refugio-500 text-white" icon="pi pi-plus" label="Cargar vacuna" @click="agregarVacuna = true"></Button>
                </div>
                <div v-for="vacuna in vacunas" class=" flex flex-row gap-3 justify-between border border-gray-200 rounded-lg p-3 px-5">
                    <div class="flex flex-col gap-3">
                        <div class=" flex flex-row gap-3 items-center">
                            <div class="font-semibold text-2xl">{{vacuna.vacuna}}</div>
                            <div class="text-gray-500 text-sm"><i class="pi pi-calendar"></i> aplicada el {{moment(vacuna.fecha_vacunacion).format('DD/MM/YYYY')}}</div>
                        </div>
                        <div class="flex flex-row gap-3">
                            <div class=" flex flex-col">
                                <div class="text-gray-500">Aplicado por</div>
                                <div class="flex flex-row gap-1">
                                    <Icon icon="healthicons:doctor-outline" class="mx-1 my-auto"></Icon>
                                    {{ vacuna.veterinario}}
                                </div>
                            </div>
                            <div class="flex flex-col">
                                <div class="text-gray-500">Observaciones</div>
                                <div class="flex flex-row gap-1">{{ vacuna.observaciones ?? '-'}}</div>
                            </div>
                        </div>
                    </div>
                    <div v-if="vacuna.evento">
                        <div class="text-sm text-gray-500">Aplicado en evento</div>
                        <div class="text-lg font-semibold">{{vacuna.evento.descripcion}}</div>
                        <div class="text-sm text-gray-500">{{moment(vacuna.evento.fecha_evento).format('DD/MM/YYYY')}}</div>
                    </div>
                </div>
            </div>
        </Contenedor>
    </div>
    <Dialog v-model:visible="agregarVacuna" modal>
        <div class="flex flex-col gap-3">
            <FormRow>
                <FormCol :span="6">
                    <Label class="flex flex-row" required>
                        <Icon icon="material-symbols:syringe-outline" class="m-1"></Icon>
                        Vacuna
                    </Label>
                    <TableSelect :tipo="TablaEstatica.Vacuna" fluid></TableSelect>
                </FormCol>
                <FormCol :span="6">
                    <Label required>
                        Fecha de aplicación
                    </Label>
                    <DatePicker></DatePicker>
                </FormCol>
            </FormRow>
            <FormRow>
                <FormCol :span="6">
                    <Label>Veterinario responsable</Label>
                    <InputText></InputText>
                </FormCol>
            </FormRow>
            <FormRow>
                <FormCol :span="12">
                    <Label>Observaciones</Label>
                    <Textarea></Textarea>
                </FormCol>
            </FormRow>
            <div clasS=" flex flex-row justify-end gap-3">
                <Button class="bg-refugio-500 border-refugio-500" label="Cargar" icon="pi pi-save"></Button>
            </div>
        </div>
    </Dialog>
</template>

<style scoped>

</style>
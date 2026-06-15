<script setup lang="ts">

import Contenedor from '@/components/generales/Contenedor.vue'
//import vaccDog from '@/assets/images/vacunas.png'
import ContenedorTitulo from '@/components/generales/ContenedorTitulo.vue'
import { useRefugioStore } from '@/stores/refugio.ts'
import FormRow from '@/components/forms/FormRow.vue'
import FormCol from '@/components/forms/FormCol.vue'
import Label from '@/components/forms/Label.vue'
import DatePicker from '@/volt/DatePicker.vue'
import TableSelect from '@/components/forms/TableSelect.vue'
import { TablaEstatica } from '@/lib/tipos/estaticos.ts'
import { reactive } from 'vue'
import { rutas_api } from '@/rutas_api.ts'
import { useAxios } from '@/lib/axios.ts'
import { useResponse } from '@/lib/utils/response.ts'
import { useToast } from '@/lib/toast/toast.ts'
import { useRouter } from 'vue-router'
import moment from 'moment/moment'

const { refugio } = useRefugioStore()
const router = useRouter()
const { axios } = useAxios()
const { unwrap } = useResponse()
const toast = useToast()
const validar = () => {
    return dataIngreso.cupo_maximo
        && dataIngreso.descripcion != null
        && dataIngreso.tipo_vacuna != null
        && dataIngreso.fecha_evento != null
}
const ingresar = async () => {
    if(!refugio)return
    if (!validar()) return
    try {
        const r = await unwrap(axios.value.post(rutas_api.eventos_vacunacion.CREAR(refugio.id_refugio),{
            ...dataIngreso,
            fecha_evento: moment(dataIngreso.fecha_evento).format('YYYY-MM-DD'),
        }))
        toast.add({severity:"success", detail: r.message})
        Object.assign(dataIngreso, {
            fecha_evento: null,
            descripcion: null,
            tipo_vacuna: null,
            veterinario_responsable: null,
            observaciones: null,
            cupo_maximo: null
        })

    } catch (error) {
    } finally {

    }
}
const dataIngreso = reactive({
    fecha_evento: null,
    descripcion: null,
    tipo_vacuna: null,
    veterinario_responsable: null,
    observaciones: null,
    cupo_maximo: null
})
</script>

<template>
    <div class="w-3/4 m-auto flex flex-col gap-4 mt-10 mb-15">
        <Contenedor class="overflow-auto" pt:header="p-0!">
            <!--header-->
            <div class="flex flex-row justify-between items-center gap-4 pb-4 mb-5 border-b border-gray-200">
                <div>
                    <div class="font-bold text-2xl">
                        Nuevo evento de vacunación
                    </div>
                    <div class="text-gray-500 mt-1">
                        Registrá un nuevo evento de vacunación para realizar en el refugio.
                    </div>
                </div>
                <div class="rounded-full bg-primary-200/30 w-20 h-20 flex items-center justify-center shrink-0">
                    <i class="pi pi-calendar-plus text-primary-500 text-3xl"></i>
                </div>
            </div>
            <!--fin header-->
            <!--refugio-->
            <div v-if="refugio" title="Refugio" icon="pi pi-home" class="m-3 flex flex-row">
            <div class="flex flex-row text-xl gap-3 pb-3 ">
                <div class="bg-primary-200/30 rounded-full p-1 min-w-9 text-center">
                    <i :class="['text-primary-500 text-center', 'pi pi-home']"></i>
                </div>
                <div class="font-semibold h-fit my-auto">Refugio</div>
            </div>
            <div class="border rounded-lg border-gray-500 h-fit px-3 py-1 font-semibold mx-3 align-middle inline">
                {{ refugio.nombre }}
            </div>
            </div>
            <!--fin refugio-->
        </Contenedor>
        <!--Detalles de evento de vacunacion-->
        <div class="flex flex-row gap-3">
            <ContenedorTitulo title="Información general" icon="pi pi-calendar" class="grow">
                <FormRow>
                    <FormCol :span="12">
                        <Label required>
                            Fecha del evento
                        </Label>
                        <DatePicker v-model="dataIngreso.fecha_evento"></DatePicker>
                    </FormCol>
                </FormRow>
                <FormRow>
                    <FormCol :span="12">
                        <Label>Descripción</Label>
                        <Textarea v-model="dataIngreso.descripcion" :maxlength="150" :auto-resize="true"
                                  placeholder="Ej: El próximo 29 de mayo realizaremos una jornada de vacunación abierta para perros y gatos. Será una excelente oportunidad para mantener al día el calendario sanitario de tu mascota y recibir asesoramiento de profesionales veterinarios."></Textarea>
                    </FormCol>
                </FormRow>
            </ContenedorTitulo>
            <ContenedorTitulo title="Vacuna a aplicar" icon="pi pi-pencil" class="grow">
                <FormRow>
                    <FormCol :span="12">
                        <Label required>Vacuna</Label>
                        <TableSelect v-model="dataIngreso.tipo_vacuna" :tipo="TablaEstatica.Vacuna"
                                     placeholder="Seleccionar tipo de vacuna"></TableSelect>
                    </FormCol>
                </FormRow>
                <FormRow>
                    <FormCol :span="12">
                        <Label>Veterinario responsable</Label>
                        <InputText v-model="dataIngreso.veterinario_responsable"
                                   placeholder="Nombre del/la veterinari@"></InputText>
                    </FormCol>
                </FormRow>
                <FormRow>
                    <FormCol :span="12">
                        <Label>Observaciones</Label>
                        <Textarea v-model="dataIngreso.observaciones"
                                  placeholder="Observaciones adicionales (opcional)"></Textarea>
                    </FormCol>
                </FormRow>
            </ContenedorTitulo>
        </div>
        <ContenedorTitulo title="Cupo" icon="pi pi-users">
            <div class="flex flex-row gap-5 items-center">
                <Label required>Cupo maximo de animales</Label>
                <InputNumber v-model="dataIngreso.cupo_maximo" show-buttons :min="0"></InputNumber>
                <span class="text-gray-400 text-sm">Cantidad máxima de animales que se vacunarán en este evento</span>
            </div>
        </ContenedorTitulo>
        <div class="flex flex-row px-3 py-5 gap-3 justify-end">
            <Button  icon="pi pi-times" label="Cancelar" 
            class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500" @click="router.go(-1)"></Button>
            <Button class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500" 
            icon="pi pi-save" label="Guardar evento" @click="ingresar"></Button>
        </div>


        <!--fin detalles-->
    </div>    
</template>

<style scoped>

</style>
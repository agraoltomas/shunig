<script setup lang="ts">

import Contenedor from '@/components/generales/Contenedor.vue'
import vaccDog from '@/assets/images/vacunas.png'
import ContenedorTitulo from '@/components/generales/ContenedorTitulo.vue'
import { useRefugioStore } from '@/stores/refugio.ts'
import FormRow from '@/components/forms/FormRow.vue'
import FormCol from '@/components/forms/FormCol.vue'
import Label from '@/components/forms/Label.vue'
import DatePicker from '@/volt/DatePicker.vue'
import TableSelect from '@/components/forms/TableSelect.vue'
import { TablaEstatica } from '@/lib/tipos/estaticos.ts'

const { refugio} = useRefugioStore()
</script>

<template>
    <div class="flex flex-col w-3/4 m-auto">
        <div class="flex flex-row justify-around">
            <div class="flex flex-col pt-10">
                <div class="text-3xl font-bold">Nuevo evento de vacunación</div>
                <div class="text-gray-600">Registra un nuevo evento de vacunación para realizar en el refugio</div>
            </div>
            <div class="overflow-hidden rounded-full">
                <img :src="vaccDog" class="py-5 w-40 "/>
            </div>
        </div>
        <Contenedor v-if="refugio" title="Refugio" icon="pi pi-home" class="m-3 flex flex-row">
            <div class="flex flex-row text-xl gap-3 pb-3 ">
                <div class="bg-primary-200/30 rounded-full p-1 min-w-9 text-center">
                    <i  :class="['text-primary-500 text-center', 'pi pi-home']"></i>
                </div>
                <div class="font-semibold h-fit my-auto">Refugio</div>
            </div>
            <div class="border rounded-lg border-gray-500 w-fit px-3 py-1 font-semibold mx-3 align-middle inline">{{ refugio.nombre}}</div>
        </Contenedor>
        <div class="flex flex-row gap-3 mx-3">
            <ContenedorTitulo title="Información general" icon="pi pi-calendar" class="grow">
                <FormRow>
                    <FormCol :span="12">
                        <Label required>
                            Fecha del evento
                        </Label>
                        <DatePicker></DatePicker>
                    </FormCol>
                </FormRow>
                <FormRow>
                    <FormCol :span="12">
                        <Label>Descripción</Label>
                        <Textarea :maxlength="150" :auto-resize="true" placeholder="Ej: El próximo 29 de mayo realizaremos una jornada de vacunación abierta para perros y gatos. Será una excelente oportunidad para mantener al día el calendario sanitario de tu mascota y recibir asesoramiento de profesionales veterinarios."></Textarea>
                    </FormCol>
                </FormRow>
            </ContenedorTitulo>
            <ContenedorTitulo title="Vacuna a aplicar" icon="pi pi-pencil" class="grow">
                <FormRow>
                    <FormCol :span="12">
                        <Label required>Vacuna</Label>
                        <TableSelect :tipo="TablaEstatica.Vacuna" placeholder="Seleccionar tipo de vacuna"></TableSelect>
                    </FormCol>
                </FormRow>
                <FormRow>
                    <FormCol :span="12">
                        <Label>Veterinario responsable</Label>
                        <InputText placeholder="Nombre del/la veterinari@"></InputText>
                    </FormCol>
                </FormRow>
                <FormRow>
                    <FormCol :span="12">
                        <Label>Observaciones</Label>
                        <Textarea placeholder="Observaciones adicionales (opcional)"></Textarea>
                    </FormCol>
                </FormRow>
            </ContenedorTitulo>
        </div>
        <ContenedorTitulo class="m-3" title="Cupo" icon="pi pi-users">
            <div class="flex flex-row gap-5 items-center">
                <Label required>Cupo maximo de animales</Label>
                <InputNumber show-buttons :min="0"></InputNumber>
                <span class="text-gray-400 text-sm">Cantidad máxima de animales que se vacunarán en este evento</span>
            </div>
        </ContenedorTitulo>
        <div class="flex flex-row px-3 py-5 gap-3 justify-end">
            <Button variant="outlined">Cancelar</Button>
            <Button icon="pi pi-save" label="Guardar evento"></Button>
        </div>
    </div>

</template>

<style scoped>

</style>
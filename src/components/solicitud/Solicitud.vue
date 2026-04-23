<script setup lang="ts">

import FormRow from '@/components/forms/FormRow.vue'
import Label from '@/components/forms/Label.vue'
import { onMounted, type Reactive, reactive, type Ref, ref, watch, defineExpose } from 'vue'
import {Form} from "@primevue/forms"
import FormCol from '@/components/forms/FormCol.vue'
import ToggleButton from '@/volt/ToggleButton.vue'
import Textarea from '@/volt/Textarea.vue'
import CheckBox from '@/volt/CheckBox.vue'
import type { User } from '@/lib/tipos/usuarios'
import { useAxios } from '@/lib/axios.ts'
import { AxiosError } from 'axios'
import { useToast } from '@/lib/toast/toast.ts'
import type { Maybe, MessageResponse } from '@/lib/tipos/generics'

export interface IDetalleSolicitud {
    fecha?: string,
    id_usuario: number,
    tipo_vivienda: string,
    tiene_patio: boolean,
    vive_adentro: boolean,
    cantidad_personas: number,
    hay_ninios: boolean,
    tuvo_mascotas: boolean,
    tiene_mascotas_actualmente: boolean,
    mascotas_vacunadas: boolean,
    mascotas_castradas: boolean,
    horas_solo: number,
    puede_cubrir_gastos: boolean,
    motivo: string,
    experiencia_transito?: boolean,
    tiempo_dias_disponibles?: number,
}


export interface ISolicitud {
    fecha?: string,
    id_usuario: number,
    tipo_vivienda: string,
    tiene_patio: boolean,
    vive_adentro: boolean,
    cantidad_personas: number,
    hay_ninios: boolean,
    tuvo_mascotas: boolean,
    tiene_mascotas_actualmente: boolean,
    mascotas_vacunadas: boolean,
    mascotas_castradas: boolean,
    horas_solo: number,
    puede_cubrir_gastos: boolean,
    motivo: string,
    experiencia_transito?: boolean,
    tiempo_dias_disponibles?: number,
    responsable_solicitud: string,
    compromiso: boolean
}

const toast = useToast()
const axiosService = useAxios()

const props = defineProps<{ usuario: User }>();

const solicitudAnterior: Ref<Maybe<IDetalleSolicitud>> = ref(null);
const getSolicitud = async () => {
    try{
        const r = await axiosService.axios.value.get(`/usuario/${props.usuario.id_usuario}/detalle_solicitud/`)
        const response: MessageResponse<IDetalleSolicitud> = r.data;
        solicitudAnterior.value = response.data;
    }catch(e){
        if(e instanceof AxiosError){
            if (e.response && e.response.status === 404){
                toast.add({ detail: e.response.data.message, severity: 'error' })
                solicitudAnterior.value = null
            }
        }
    }
}
onMounted(async () => {
    await getSolicitud()
})

watch(() => props.usuario, async () => {
    await getSolicitud()
})

const datosForm: Reactive<Partial<ISolicitud>> = reactive({})
const optionsTipoVivienda = ref(['Departamento','Casa'])


const guardar = async () => {
    const r = await axiosService.axios.value.post(`/usuario/${props.usuario.id_usuario}/detalle_solicitud/`,{

    })
    return null
}

defineExpose({
    guardar
})
</script>

<template>
    <div v-if="solicitudAnterior">
        <Message severity="success"  class="text-xl my-5 max-w-fit mx-auto">
            Ya tiene datos cargados para el detalle de la solicitud.<br/>
            Revise el formulario y confirme que sean correctos.
        </Message>
        <div></div>
    </div>

    <Form v-else class="flex flex-col p-3 gap-5!">
        <hr class=""/>
        <h1 class="text-xl py-3 text-center font-bold gap-5">Información del hogar</h1>
        <FormRow :gap="6">
            <FormCol :span="6">
                <Label>Tipo de vivienda</Label>
                <Select :options="optionsTipoVivienda" v-model="datosForm.tipo_vivienda"></Select>
            </FormCol>
            <FormCol :span="6">
                <Label>¿Tiene patio?</Label>
                <ToggleButton v-model="datosForm.tiene_patio" on-label="Si" off-label="No"></ToggleButton>
            </FormCol>
        </FormRow >
        <FormRow :gap="6">
            <FormCol :span="6">
                <Label>¿El animal viviría adentro o afuera? </Label>
                <ToggleButton v-model="datosForm.vive_adentro" on-label="Adentro" off-label="Afuera" ></ToggleButton>
            </FormCol>
            <FormCol :span="6">
                <Label>¿Cuántas personas viven en el hogar?</Label>
                <InputNumber v-model="datosForm.cantidad_personas" :min="1" :max="99"></InputNumber>
            </FormCol>
        </FormRow>
        <FormRow>
            <FormCol :span="6">
                <Label>¿Hay niños?</Label>
                <ToggleButton v-model="datosForm.hay_ninios" on-label="Si" off-label="No"></ToggleButton>
            </FormCol>
        </FormRow>
        <hr/>
        <h1 class="text-xl py-3 text-center font-bold gap-5">Experiencia con animales</h1>
        <FormRow :gap="6">
            <FormCol :span="3">
                <Label>¿Tuvo mascotas antes?</Label>
                <ToggleButton on-label="Si" off-label="No" v-model="datosForm.tuvo_mascotas"></ToggleButton>
            </FormCol>
            <FormCol :span="3">
                <Label>¿Tiene otras mascotas?</Label>
                <ToggleButton  v-model="datosForm.tiene_mascotas_actualmente" on-label="Si" off-label="No"></ToggleButton>
            </FormCol>
            <FormCol :span="3">
                <Label>¿Están vacunadas?</Label>
                <ToggleButton  v-model="datosForm.mascotas_vacunadas" on-label="Si" off-label="No"></ToggleButton>
            </FormCol>
            <FormCol :span="3">
                <Label>¿Están castradas?</Label>
                <ToggleButton  v-model="datosForm.mascotas_castradas" on-label="Si" off-label="No"></ToggleButton>
            </FormCol>
        </FormRow>
        <hr/>
        <h1 class="text-xl py-3 text-center font-bold gap-5">Disponibilidad y Cuidado</h1>
        <FormRow :gap="6">
            <FormCol :span="4">
                <Label> ¿Cuántas horas estaría solo el animal?</Label>
                <InputNumber v-model="datosForm.horas_solo" :min="1" :max="99"></InputNumber>
            </FormCol>
            <FormCol :span="4" :min="0">
                <Label>¿Quién sería el responsable principal?</Label>
                <InputText v-model="datosForm.responsable_solicitud"></InputText>
            </FormCol>
            <FormCol :span="4">
                <Label>¿Podrías cubrir gastos veterinarios?</Label>
                <ToggleButton  v-model="datosForm.puede_cubrir_gastos" on-label="Si" off-label="No"></ToggleButton>
            </FormCol>
        </FormRow>
        <hr/>
        <h1 class="text-xl py-3 text-center font-bold gap-5">Motivación</h1>
        <FormRow :gap="6">
            <FormCol :span="12">
                <Label>¿Por qué querés adoptar este animal?</Label>
                <Textarea v-model="datosForm.motivo"></Textarea>
            </FormCol>
        </FormRow>
        <hr/>
        <h1 class="text-xl py-3 text-center font-bold gap-5">Compromiso</h1>
        <FormRow :gap="6">
            <FormCol :span="6" modo="horizontal">
                <Label>Me comprometo a cuidar al animal responsablemente</Label>
                <CheckBox class="m-auto" v-model="datosForm.compromiso" binary></CheckBox>
            </FormCol>
        </FormRow>
        <Button type="submit" label="Cargar Detalles"></Button>
    </Form>
</template>

<style scoped>

</style>
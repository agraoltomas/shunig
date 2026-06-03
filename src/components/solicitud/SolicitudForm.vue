<script setup lang="ts">

import FormRow from '@/components/forms/FormRow.vue'
import Label from '@/components/forms/Label.vue'
import { onMounted, type Reactive, reactive, type Ref, ref, watch, defineExpose, useTemplateRef } from 'vue'
import { Form } from '@primevue/forms'
import FormCol from '@/components/forms/FormCol.vue'
import ToggleButton from '@/volt/ToggleButton.vue'
import Textarea from '@/volt/Textarea.vue'
import CheckBox from '@/volt/CheckBox.vue'
import type { User } from '@/lib/tipos/usuarios'
import { useAxios } from '@/lib/axios.ts'
import { AxiosError } from 'axios'
import { useToast } from '@/lib/toast/toast.ts'
import type { Maybe, MessageResponse } from '@/lib/tipos/generics'
import { bool, ValidationError } from 'yup'
import { yupResolver } from '@primevue/forms/resolvers/yup';
import type { FormSubmitEvent } from '@primevue/forms/form'
import * as yup from 'yup'
import { shade } from '@primeuix/themes'
import { useResponse } from '@/lib/utils/response.ts'
import type { IDetalleSolicitud, ISolicitud } from '@/lib/tipos/solicitud.ts'


const toast = useToast()
const { axios } = useAxios()
const {unwrap} = useResponse()

const props = defineProps<{ usuario: User }>()
const solicitudAnterior: Ref<Maybe<IDetalleSolicitud>> = ref(null)
const getSolicitud = async () => {
    try {
        const r = await axios.value.get(`/usuario/${props.usuario.id_usuario}/detalle_solicitud/`)
        const response: MessageResponse<IDetalleSolicitud> = r.data
        solicitudAnterior.value = response.data
    } catch (e) {
        if (e instanceof AxiosError) {
            if (e.response && e.response.status === 404) {
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
const emit = defineEmits<{cargado: [ok: boolean]}>()
const datosForm: Reactive<Partial<ISolicitud>> = reactive({
    tipo_vivienda: null,
    tiene_patio: false,
    vive_adentro: false,
    cantidad_personas: null,
    hay_ninios: false,
    tuvo_mascotas: false,
    tiene_mascotas_actualmente: false,
    mascotas_vacunadas: false,
    mascotas_castradas: false,
    horas_solo: null,
    puede_cubrir_gastos: false,
    motivo: null,
    experiencia_transito: false,
    tiempo_disponible_dias: null,
    animales_transitados: null
})
const optionsTipoVivienda = ref(['Departamento', 'Casa'])
const form = useTemplateRef<typeof Form>('form')

const schemaSolicitud = yup.object().shape({
    tipo_vivienda: yup.string().required(),
    tiene_patio: yup.boolean().default(false),
    vive_adentro: yup.boolean().default(false),
    cantidad_personas: yup.number().required(),
    hay_ninios: yup.boolean().default(false),
    tuvo_mascotas: yup.boolean().default(false),
    tiene_mascotas_actualmente: yup.boolean().default(false),
    mascotas_vacunadas: yup.boolean().default(false),
    mascotas_castradas: yup.boolean().default(false),
    horas_solo: yup.number().required(),
    puede_cubrir_gastos: yup.boolean().default(false),
    motivo: yup.string().required().length(200),
    experiencia_transito: yup.boolean().default(false),
    tiempo_disponible_dias: yup.number().required(),
    animales_transitados: yup.number().required()
})

const saveData: Ref<Maybe<Partial<ISolicitud>>> = ref(null);
const validar = async () => {
    if (solicitudAnterior.value) return true
    const r = await form.value?.validate();
    console.log(r);
    if(r.errors.length > 0)return false;
    saveData.value = r.values;
    return form.value?.valid;
}
const _validar = () => {

}
const guardar = async () => {
    if(solicitudAnterior.value) return solicitudAnterior.value
    try {
        const r = await unwrap<IDetalleSolicitud>(axios.value.post(`/usuario/${props.usuario.id_usuario}/detalle_solicitud/`, {
            ...saveData.value
        }));
        return r.data

    } catch (e) {
        return false
    }
}

defineExpose({
    guardar,
    validar
});
const resolver = yupResolver(schemaSolicitud)
</script>

<template>
    <div v-if="solicitudAnterior">
        <Message severity="success" class="text-xl my-5 max-w-fit mx-auto">
            Ya tiene datos cargados para el detalle de la solicitud.<br />
            Revise el formulario y confirme que sean correctos.
        </Message>
        <div></div>
    </div>
    <Form v-else class="flex flex-col p-3 gap-5!" @submit="_validar" ref="form" :resolver="resolver" :initial-values="datosForm">
        <hr class="" />
        <h1 class="text-xl py-3 text-center font-bold gap-5">Información del hogar</h1>
        <FormRow :gap="6">
            <FormCol :span="6">
                <Label required>Tipo de vivienda</Label>
                <Select name="tipo_vivienda" :options="optionsTipoVivienda" v-model="datosForm.tipo_vivienda"></Select>
            </FormCol>
            <FormCol :span="6">
                <Label>¿Tiene patio?</Label>
                <ToggleButton name="tiene_patio" v-model="datosForm.tiene_patio" on-label="Si" off-label="No"></ToggleButton>
            </FormCol>
        </FormRow>
        <FormRow :gap="6">
            <FormCol :span="6">
                <Label required>¿El animal viviría adentro o afuera? </Label>
                <ToggleButton name="vive_adentro" v-model="datosForm.vive_adentro" on-label="Adentro" off-label="Afuera"></ToggleButton>
            </FormCol>
            <FormCol :span="6">
                <Label required>¿Cuántas personas viven en el hogar?</Label>
                <InputNumber name="cantidad_personas" v-model="datosForm.cantidad_personas" :min="1" :max="99"></InputNumber>
            </FormCol>
        </FormRow>
        <FormRow>
            <FormCol :span="6">
                <Label>¿Hay niños?</Label>
                <ToggleButton name="hay_ninios" v-model="datosForm.hay_ninios" on-label="Si" off-label="No"></ToggleButton>
            </FormCol>
        </FormRow>
        <hr />
        <h1 class="text-xl py-3 text-center font-bold gap-5">Experiencia con animales</h1>
        <FormRow :gap="6">
            <FormCol :span="3">
                <Label>¿Tuvo mascotas antes?</Label>
                <ToggleButton name="tuvo_mascotas" on-label="Si" off-label="No" v-model="datosForm.tuvo_mascotas"></ToggleButton>
            </FormCol>
            <FormCol :span="3">
                <Label >¿Tiene otras mascotas?</Label>
                <ToggleButton name="tiene_mascotas_actualmente" v-model="datosForm.tiene_mascotas_actualmente" on-label="Si"
                              off-label="No"></ToggleButton>
            </FormCol>
            <FormCol :span="3">
                <Label>¿Están vacunadas?</Label>
                <ToggleButton name="mascotas_vacunadas" v-model="datosForm.mascotas_vacunadas" on-label="Si" off-label="No"></ToggleButton>
            </FormCol>
            <FormCol :span="3">
                <Label>¿Están castradas?</Label>
                <ToggleButton name="mascotas_castradas" v-model="datosForm.mascotas_castradas" on-label="Si" off-label="No"></ToggleButton>
            </FormCol>
        </FormRow>
        <hr />
        <h1 class="text-xl py-3 text-center font-bold gap-5">Disponibilidad y Cuidado</h1>
        <FormRow :gap="6">
            <FormCol :span="6">
                <Label required> ¿Cuántas horas estaría solo el animal?</Label>
                <InputNumber name="horas_solo" v-model="datosForm.horas_solo" :min="1" :max="99"></InputNumber>
            </FormCol>
            <FormCol :span="6">
                <Label required> ¿Cuanto tiempo podes tenerlo en transito? </Label>
                <InputNumber placeholder="Días" name="tiempo_disponible_dias" v-model="datosForm.tiempo_disponible_dias" :min="1"></InputNumber>
            </FormCol>

        </FormRow>
        <FormRow :gap="6">
            <FormCol :span="6">
                <Label >¿Podrías cubrir gastos veterinarios?</Label>
                <ToggleButton name="puede_cubrir_gastos" v-model="datosForm.puede_cubrir_gastos" on-label="Si" off-label="No"></ToggleButton>
            </FormCol>
        </FormRow>
        <hr />
        <h1 class="text-xl py-3 text-center font-bold gap-5">Motivación</h1>
        <FormRow :gap="6">
            <FormCol :span="12">
                <Label required>¿Por qué querés adoptar este animal?</Label>
                <Textarea name="motivo" v-model="datosForm.motivo"></Textarea>
            </FormCol>
        </FormRow>
        <hr />
        <h1 class="text-xl py-3 text-center font-bold gap-5">Transito</h1>
        <FormRow :gap="6">
            <FormCol :span="6">
                <Label>¿Ya transitaste animales antes?</Label>
                <ToggleButton name="experiencia_transito" on-label="Si" off-label="No"></ToggleButton>
            </FormCol>
            <FormCol :span="6">
                <Label required>¿Cuántos animales transitaste anteriormente?</Label>
                <InputNumber name="animales_transitados" :min="0"></InputNumber>
            </FormCol>
        </FormRow>
        <FormRow :gap="6">
            <FormCol :span="6">
                <Label class="text-center">¿Tuviste experiencia con animales enfermos o en recuperación?</Label>
                <ToggleButton on-label="Si" off-label="No"></ToggleButton>
            </FormCol>
        </FormRow>

        <hr/>
    </Form>
</template>

<style scoped>

</style>
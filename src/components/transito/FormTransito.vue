<script setup lang="ts">

import { useAuthStore } from '@/stores/auth.ts'
import Solicitud, { type IDetalleSolicitud } from '@/components/solicitud/Solicitud.vue'
import FormRow from '@/components/forms/FormRow.vue'
import FormCol from '@/components/forms/FormCol.vue'
import Label from '@/components/forms/Label.vue'
import { Form } from '@primevue/forms'
import { computed, onMounted, reactive, type Ref, ref, useTemplateRef } from 'vue'
import { useAxios } from '@/lib/axios.ts'
import type { Maybe, MessageResponse } from '@/lib/tipos/generics'
import type { User } from '@/lib/tipos/usuarios'
import type { IMascota } from '@/lib/tipos/mascotas'
import type { IDomicilio } from '@/lib/tipos/domicilio'
import { useToast } from '@/lib/toast/toast.ts'
import { type IDatosSolicitud, TipoSolicitud } from '@/lib/tipos/solicitud.ts'


import domicilio from '@/lib/modelos/domicilio.ts'
import CheckBox from '@/volt/CheckBox.vue'
import { useResponse } from '@/lib/utils/response.ts'

const props = defineProps<{ mascota: IMascota, user?: Maybe<User> }>()
const solicitud = useTemplateRef<typeof Solicitud>('solicitud')
const usuarios: Ref<User[]> = ref([])
const {unwrap, tryLogError} = useResponse();
const { axios } = useAxios()
onMounted(async () => {
    const r = await axios.value.get('/usuario')

    const response: MessageResponse<User[]> = r.data
    usuarios.value = response.data
    console.log(usuarios.value)
})
const usuario: Ref<Maybe<User>> = ref(props.user ?? null)


const toast = useToast()
const emit = defineEmits<{ cargada: [], cerrar: [] }>()
const iniciarSolicitud = async () => {
    if (!usuario.value) return
    console.log(solicitud.value)
    const ok = await solicitud.value?.validar()
    if (!ok) return
    try {
        const data: Maybe<IDetalleSolicitud> = await solicitud.value?.guardar()
        if (!data) return
        const r = await unwrap(axios.value.post('/solicitud', {
            id_detalle_solicitud: data.id_detalle_solicitud,
            id_animal: props.mascota.id_animal,
            id_usuario: usuario.value.id_usuario,
            compromiso: datosForm.compromiso,
            tipo_solicitud: TipoSolicitud.Transito,
            responsable_principal: datosForm.responsable_principal
        } satisfies Partial<{ [r in keyof IDatosSolicitud]: any }>))
        toast.add({ detail: 'Solicitud iniciada correctamente', severity: 'success' })
        emit('cargada')
    } catch (error) {
        tryLogError(<Error>error,toast);
        emit('cerrar')
    }
}
const userName = computed(() => `${props.user?.nombre} ${props.user?.apellido}`)
const detalleSolicitudCargada = ref(false)
const datosForm = reactive({
    responsable_principal: null,
    compromiso: false,
})
</script>

<template>
    <div class="max-w-200">
        <div class="w-fit py-3 text-xl m-auto">Transitando a <b>{{ props.mascota.nombre }}</b></div>
        <Form class="flex flex-col gap-3">
            <FormRow>
                <FormCol :span="3">
                    <Label>Usuario adoptante</Label>
                    <Select v-if="!user" v-model="usuario"
                            :option-label="(u: User) => { return `${u.nombre} ${u.apellido} - ${u.email}`}"
                            placeholder="Usuario" :options="usuarios" filter></Select>
                    <InputText v-else :value="userName" disabled></InputText>
                </FormCol>
                <FormCol :span="5">
                    <Label>Mail</Label>
                    <InputText disabled :value="usuario?.email"></InputText>
                </FormCol>
                <FormCol :span="4">
                    <Label>Teléfono</Label>
                    <InputText disabled :value="usuario?.telefono"></InputText>
                </FormCol>
            </FormRow>
            <FormRow>
                <FormCol :span="12">
                    <Label>Direccion</Label>
                    <InputText disabled
                               :value="domicilio.toText(usuario?.domicilio)"></InputText>
                </FormCol>
            </FormRow>
            <FormRow>
            </FormRow>
        </Form>
        <Solicitud ref="solicitud" v-if="usuario" :usuario="usuario" @cargado="(ok) => detalleSolicitudCargada = ok">
        </Solicitud>
        <h1 class="text-xl py-3 text-center font-bold gap-5">Compromiso</h1>

        <FormRow :gap="6">
            <FormCol :span="6">
                <Label required>¿Quién sería el responsable principal?</Label>
                <InputText v-model="datosForm.responsable_principal"></InputText>
            </FormCol>

        </FormRow>
        <FormRow class="my-3">
            <FormCol :span="6" modo="horizontal">
                <Label required>Me comprometo a cuidar al animal responsablemente</Label>
                <CheckBox class="m-auto" v-model="datosForm.compromiso" binary></CheckBox>
            </FormCol>
        </FormRow>
        <div class="flex flex-row gap-3 my-3 justify-center">
            <Button :disabled="!usuario || !datosForm.compromiso || !datosForm.responsable_principal" label="Iniciar solicitud" @click="iniciarSolicitud" ></Button>
        </div>
    </div>
</template>

<style scoped>

</style>
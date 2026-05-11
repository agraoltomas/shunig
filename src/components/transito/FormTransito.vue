<script setup lang="ts">

import { useAuthStore } from '@/stores/auth.ts'
import Solicitud from '@/components/solicitud/Solicitud.vue'
import FormRow from '@/components/forms/FormRow.vue'
import FormCol from '@/components/forms/FormCol.vue'
import Label from '@/components/forms/Label.vue'
import { Form } from '@primevue/forms'
import { onMounted, type Ref, ref } from 'vue'
import { useAxios } from '@/lib/axios.ts'
import type { Maybe, MessageResponse } from '@/lib/tipos/generics'
import type { User } from '@/lib/tipos/usuarios'
import type { IMascota } from '@/lib/tipos/mascotas'
import type { IDomicilio } from '@/lib/tipos/domicilio'
import { useToast } from 'primevue'
import { TipoSolicitud } from '@/lib/tipos/solicitud.ts'
import type { IDatosSolicitud } from '@/components/adopcion/FormAdopcion.vue'
import domicilio from '@/lib/modelos/domicilio.ts'
const props = defineProps<{ mascota: IMascota }>()
const authStore = useAuthStore()

const usuarios: Ref<User[]> = ref([])
const { axios } = useAxios()
onMounted(async () => {
    const r = await axios.value.get('/usuario')

    const response: MessageResponse<User[]> = r.data
    usuarios.value = response.data
    console.log(usuarios.value)
})
const usuario: Ref<Maybe<User>> = ref(null)


const toast = useToast()
const emit = defineEmits<{ cargada: []}>()
const iniciarSolicitud =  async () => {
    if(!usuario.value)return;
    try{
        const r = await axios.value.post('/solicitud',{
            id_animal:props.mascota.id_animal,
            id_usuario: usuario.value.id_usuario,
            compromiso: true,
            tipo_solicitud: TipoSolicitud.Transito,
            responsable_principal: usuario.value.nombre
        } satisfies Partial<{[ r in keyof IDatosSolicitud]: any}>);
        toast.add({ detail: "Solicitud iniciada correctamente", severity:"success"})
        emit('cargada')
    }catch (error) {}

}
</script>

<template>
    <div class="">
        <div class="w-fit py-3 text-xl m-auto">Transitando a <b>{{ props.mascota.nombre }}</b></div>
        <Form class="">
            <FormRow>
                <FormCol :span="3">
                    <Label>Usuario adoptante</Label>
                    <Select v-model="usuario"
                            :option-label="(u: User) => { return `${u.nombre} ${u.apellido} - ${u.email}`}"
                            placeholder="Usuario" :options="usuarios" filter></Select>
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
        <!--    <Solicitud v-if="usuario" :usuario="usuario">-->
        <!--    </Solicitud>-->
        <div class="flex flex-row gap-3 my-3 justify-center">
            <Button click="" label="Iniciar solicitud" @click="iniciarSolicitud" :disabled="!usuario"></Button>
        </div>
    </div>
</template>

<style scoped>

</style>
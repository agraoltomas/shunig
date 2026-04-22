<script setup lang="ts">

import { useAuthStore } from '@/stores/auth.ts'
import Solicitud from '@/components/solicitud/Solicitud.vue'
import FormRow from '@/components/forms/FormRow.vue'
import FormCol from '@/components/forms/FormCol.vue'
import Label from '@/components/forms/Label.vue'
import {Form} from "@primevue/forms"
import { onMounted, type Ref, ref } from 'vue'
import { useAxios } from '@/lib/axios.ts'
import type { Maybe, MessageResponse } from '@/lib/tipos/generics'
import type { User } from '@/lib/tipos/usuarios'
import type { IMascota } from '@/lib/tipos/mascotas'

const props = defineProps<{ mascota: IMascota }>() ;
const authStore = useAuthStore();

const usuarios: Ref<User[]> = ref([])
const axiosService = useAxios()
onMounted(async () => {
    const r  = await axiosService.axios.value.get('/usuario')

    const response: MessageResponse<User[]> = r.data;
    usuarios.value = response.data;
    console.log(usuarios.value);
});
const usuario: Ref<Maybe<User>> = ref(null);
</script>

<template>
    <div class="">
        <div class="w-fit py-3 text-xl m-auto">Transitando a <b>{{ props.mascota.nombre}}</b></div>
    <Form class="">
        <FormRow>
            <FormCol :span="3">
                <Label>Usuario adoptante</Label>
                <Select v-model="usuario"   :option-label="(u: User) => { return `${u.nombre} ${u.apellido} - ${u.email}`}" placeholder="Usuario" :options="usuarios" filter></Select>
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
                <InputText disabled :value="usuario?.domicilio ? `${usuario?.domicilio.direccion},${usuario?.domicilio.codigo_postal} ${usuario?.domicilio.ciudad}, ${usuario?.domicilio.localidad},${usuario?.domicilio.provincia}` : 'N/A'"></InputText>
            </FormCol>
        </FormRow>
        <FormRow>
        </FormRow>
    </Form>
    <Solicitud v-if="usuario" :usuario="usuario">
    </Solicitud>
    </div>
</template>

<style scoped>

</style>
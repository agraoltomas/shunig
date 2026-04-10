<script setup lang="ts">
import { computed, type ComputedRef, type Reactive, reactive, type Ref, ref } from 'vue'
import { useToast } from 'primevue'
import { useRoute, useRouter } from 'vue-router'
import InputMask from '@/volt/InputMask.vue'
import Menubar from '@/components/Menubar.vue'
import Select from '@/volt/Select.vue'
import SecondaryButton from '@/volt/SecondaryButton.vue'
import FormRow from '@/components/forms/FormRow.vue'
import FormCol from '@/components/forms/FormCol.vue'
import { TipoUsuario } from '@/lib/tipos/usuario.ts'
import type { Maybe } from '@/lib/tipos/generics'


const toast = useToast()
// const router = useRouter()
// const route = useRoute()
interface DatosUsuario{
    cuil: Maybe<string>,
    nombre: Maybe<string>,
    apellido: Maybe<string>,
    mail: Maybe<string>,
    password: Maybe<string>,
    direccion: Maybe<string>,
    telefono: {
        numero: Maybe<string>,
        codigo: Maybe<string>
    },
}
const datosUsuario: Reactive<DatosUsuario> = reactive({
    cuil: null,
    nombre: null,
    apellido: null,
    mail: null,
    password: null,
    direccion: null,
    telefono: {
        numero: null,
        codigo: null
    }
});
const MAIL_REGEX = /^[\w0-9.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/g;
const validarDatosUsuario = (datos: DatosUsuario) => {
    return datos.cuil !== null
        && datos.nombre !== null
        && datos.apellido !== null
        && datos.mail !== null
        && RegExp(MAIL_REGEX).test(datos.mail)
}
const register = () => {
    toast.add({ detail: 'Registrado exitosamente', summary: 'exito', severity: 'success' })
    // setTimeout(() => {
    //     router.push('/')
    // }, 5000)
    console.log(datosUsuario)
}



const tipo = ref(TipoUsuario.VoluntarioTransito)
const canRegister = computed(() => false)
</script>

<template>
    <Menubar></Menubar>
    <Panel class="bg-white flex flex-col gap-3 w-[75%] m-auto p-5!" header="Registro de Usuario"
           pt:header="m-auto text-xl font-semibold w-fit py-3">
        <FormRow :cols="12" :gap="3">
            <FormCol :span="6" >
                <label class="font-semibold text-lg">Nombre</label>
                <InputText placeholder="Nombre" :maxlength="11" v-model="datosUsuario.nombre"></InputText>
            </FormCol>
            <FormCol :span="6" >
                <label class="font-semibold text-lg">Apellido</label>
                <InputText placeholder="Apellido" :maxlength="11" v-model="datosUsuario.apellido"></InputText>
            </FormCol>
        </FormRow>
        <FormRow :cols="12" :gap="3">
            <FormCol :span="6">
                <label class="text-lg font-semibold">E-Mail</label>
                <InputText placeholder="E-mail" v-model="datosUsuario.mail"></InputText>
            </FormCol>
            <FormCol :span="6">
                <label class="text-lg font-semibold">Contraseña</label>
                <Password fluid placeholder="Contraseña" v-model="datosUsuario.password"></Password>
            </FormCol>
        </FormRow>
        <FormRow :cols="12" :gap="3">
            <FormCol :span="7">
                <label class="text-lg font-semibold">Direccion</label>
                <InputText placeholder="Direccion" v-model="datosUsuario.direccion" :maxlength="100"></InputText>
            </FormCol>
            <FormCol :span="5">
                <label class="text-lg font-semibold">Telefono</label>
                <FormRow class="w-full grid grid-cols-12 gap-3">
                    <Select class="col-span-3" :options="[]"></Select>
                    <InputMask class="col-span-3" :autoClear="false" placeholder="11" mask="99?99"
                               v-model="datosUsuario.telefono.codigo" fluid></InputMask>
                    <InputMask class="col-span-6" :autoClear="false" placeholder="1234-5678" mask="9999-9999"
                               v-model="datosUsuario.telefono.numero" fluid></InputMask>
                </FormRow>
                <!--                <InputText placeholder="Telefono" v-model="data.telefono"></InputText>-->
            </FormCol>
        </FormRow>
        <div class="flex flex-row pt-3 w-fit m-auto">
            <label class="mx-3 text-3xl font-semibold text-center leading-[revert]">Soy </label>
            <div class="flex flex-row gap-4 rounded-lg p-2 bg-secondary-50">
                <SecondaryButton
                    :class="{'text-gray-500!': tipo != TipoUsuario.VoluntarioTransito, 'bg-primary-500! text-surface-200!' : tipo == TipoUsuario.VoluntarioTransito }"
                    @click="() => tipo = TipoUsuario.VoluntarioTransito">Voluntario de Transito
                </SecondaryButton>
                <SecondaryButton
                    :class="{'text-gray-500!': tipo != TipoUsuario.Adoptante, 'bg-primary-500! text-surface-200!' : tipo == TipoUsuario.Adoptante }"
                    @click="() => tipo = TipoUsuario.Adoptante">Adoptante
                </SecondaryButton>
                <SecondaryButton
                    :class="{'text-gray-500!': tipo != TipoUsuario.Refugio, 'bg-primary-500! text-surface-200!' : tipo == TipoUsuario.Refugio }"
                    @click="() => tipo = TipoUsuario.Refugio">Refugio
                </SecondaryButton>
            </div>
        </div>
        <div v-if="tipo == TipoUsuario.Refugio">
            <hr class="pt-3 mt-3 border-t-surface-600!"></hr>
            <h1 class="m-auto font-semibold text-lg w-fit pb-3">Registro de Refugio</h1>
                <FormRow >
                    <FormCol :span="12">
                        <label class="font-semibold text-lg">Nombre</label>
                        <InputText fluid placeholder="Nombre" :maxlength="100" v-model="datosUsuario.nombre"></InputText>
                    </FormCol>
                </FormRow>
            <FormRow>
                <FormCol :span="10">
                    <label class="font-semibold text-lg">Domicilio</label>
                    <InputText placeholder="Nombre" :maxlength="11" v-model="datosUsuario.nombre"></InputText>
                </FormCol>
                <FormCol :span="2">
                    <label class="font-semibold text-lg">CP</label>
                    <InputText></InputText>
                </FormCol>
            </FormRow>
            <FormRow>
                <FormCol :span="12">
                    <label class="font-semibold text-lg">CUIT/CUIL</label>
                    <div  class="flex items-stretch w-full">
                        <InputMask fluid mask="99-99999999-9" class="rounded-e-none rounded-s-md"></InputMask>
                        <Button icon="pi pi-search" class="rounded-s-none"></Button>
                    </div>
                </FormCol>
            </FormRow>
            <FormRow>
                <FormCol :span="6">
                    <label class="text-lg font-semibold">E-Mail</label>
                    <InputText placeholder="E-mail" v-model="datosUsuario.mail"></InputText>
                </FormCol>
                <FormCol :span="6">
                    <label class="text-lg font-semibold">Telefono</label>
                    <FormRow class="w-full grid grid-cols-12 gap-3">
                        <Select class="col-span-3" :options="[]"></Select>
                        <InputMask class="col-span-3" :autoClear="false" placeholder="11" mask="99?99"
                                   v-model="datosUsuario.telefono.codigo" fluid></InputMask>
                        <InputMask class="col-span-6" :autoClear="false" placeholder="1234-5678" mask="9999-9999"
                                   v-model="datosUsuario.telefono.numero" fluid></InputMask>
                    </FormRow>
                    <!--                <InputText placeholder="Telefono" v-model="data.telefono"></InputText>-->
                </FormCol>
            </FormRow>
        </div>
        <div class="w-full py-3">
            <Button :disabled="!canRegister" fluid label="Registrarse" @click="register"></Button>
        </div>
    </Panel>
</template>

<style scoped></style>

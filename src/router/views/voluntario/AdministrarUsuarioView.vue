<script setup lang="ts">
import Label from '@/components/forms/Label.vue'
import InputMask from '@/volt/InputMask.vue'
import { Form } from '@primevue/forms'
import FormCol from '@/components/forms/FormCol.vue'
import FormRow from '@/components/forms/FormRow.vue'
import Domicilio from '@/components/forms/Domicilio.vue'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import * as yup from 'yup'
import { domicilioSchema } from '@/validations/domicilio.ts'
import DataBlock from '@/components/generales/DataBlock.vue'
import { useAuthStore } from '@/stores/auth.ts'
import type { FormSubmitEvent } from '@primevue/forms/form'
import { useAxios } from '@/lib/axios.ts'
import { rutas_api } from '@/rutas_api.ts'
import Contenedor from '@/components/generales/Contenedor.vue'
import ContenedorTitulo from '@/components/generales/ContenedorTitulo.vue'
import DangerButton from '@/volt/DangerButton.vue'

const { user } = useAuthStore()
const { axios } = useAxios()
const datosUsuario = {
    domicilio: user?.domicilio,
    nombre: user?.nombre,
    apellido: user?.apellido,
    email: user?.email,
    telefono: user?.telefono

}
const updateDatos = async (e: FormSubmitEvent) => {
    if (!confirm('actualizar datos?')) return
    if (!user) return
    try {
        const r = await axios.value.patch(rutas_api.usuario.UPDATE({ id_usuario: user.id_usuario }), {
            ...e.values
        })

    } catch (error) {
    }
}
const eliminarCuenta = async () => {
    let check = prompt("Para confirmar la eliminacion escriba `ELIMINAR`");
    while(!(check == "ELIMINAR")) {
        if(check === null)return null;
        check = prompt("Para confirmar la eliminacion escriba `ELIMINAR`");
    }
}
</script>

<template>
    <Form v-slot="$form" :initialValues="datosUsuario"
          @submit="updateDatos"
          class="flex flex-col gap-4">
        <div class="w-3/4 m-auto">
            <div>

            </div>
            <div class=" flex flex-row gap-3">
                <Contenedor class="h-fit w-100">
                    <FormRow :gap="3">
                        <FormCol :span="12">
                            <Label required>Mail</label>
                            <InputText name="email" placeholder="E-mail"></InputText>
                            <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">
                                {{ $form.email?.error?.message }}
                            </Message>
                        </FormCol>
                    </FormRow>
                    <FormRow :gap="3">
                        <FormCol :span="12">
                            <Label reqxuired>Teléfono</label>
                            <InputText name="telefono" class="col-span-2"
                                       fluid></InputText>
                            <Message v-if="$form.telefono?.invalid" severity="error"
                                     size="small" variant="simple">
                                {{ $form.telefono?.error?.message }}
                            </Message>
                            <!--                <InputText placeholder="Telefono" v-model="data.telefono"></InputText>-->
                        </FormCol>
                    </FormRow>
                </Contenedor>
                <Contenedor>
                    <Domicilio class="w-150"  v-model:value="datosUsuario.domicilio" label="Datos de domicilio" name="domicilio"
                               :background="false" :border="false"
                    ></Domicilio>
                </Contenedor>
            </div>
            <div class="flex flex-row justify-end py-3">
                <Button type="submit" label="Actualizar"></Button>
            </div>
            <ContenedorTitulo title="Baja de usuario">
                <div> <i class="pi pi-exclamation-triangle text-red-500"></i>
                    Esta acción es permanente y no se puede deshacer.
                </div>
                Al eliminar tu cuenta perderás acceso a todos tus datos, solicitudes e inscripciones.
                Esta acción es irreversible y no podrá deshacerse.
                <div class="w-fit">
                    <DangerButton label="Dar de baja" @click="() => eliminarCuenta()"></DangerButton>
                </div>
            </ContenedorTitulo>
        </div>

    </Form>
    <!--    <Panel class="w-[65%]! m-auto" header="" pt:header="p-0!">-->
    <!--        <template #header>-->
    <!--            <div class="w-full h-full">-->
    <!--                <div class="bg-surface-800 w-full h-full text-center text-3xl font-bold pl-3 py-4 text-white">-->
    <!--                    Actualizar datos de contacto-->
    <!--                </div>-->
    <!--            </div>-->
    <!--        </template>-->
    <!--        <div class=" grid grid-cols-12 pl-2 text-2xl font-semibold py-5">-->
    <!--            <DataBlock class="col-span-3" label="Nombre y apellido" data="Juana de Azurduy"></DataBlock>-->
    <!--            <DataBlock class="col-span-3" label="CUIL " data="27-33454665-1"></DataBlock>-->
    <!--        </div>-->


</template>

<style scoped>

</style>
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
const datosUsuario = {
    domicilio: {}
}
const yupUserSchema = yup.object().shape({
    cuit: yup.string().required('Campo obligatorio').test('valid-cuil', 'El CUIL es inválido', value => CUILValidator(value)).transform(value => value ? value.replaceAll('-', '') : value),
    nombre: yup.string().required('Campo obligatorio'),
    apellido: yup.string().required('Campo obligatorio'),
    email: yup.string().email('Ingrese un mail valido').required('Campo obligatorio'),
    password: yup.string().required('Campo obligatorio').min(8, 'Ingrese al menos 8 caracteres'),
    domicilio: domicilioSchema,
    telefono: yup.object().shape({
        numero: yup.string().transform(value => String(value).replace('-', '')).matches(/(\d)+/g),
        codigo: yup.number()
    })
})
const userResolver = yupResolver(yupUserSchema);

</script>

<template>
    <Panel class="w-[65%]! m-auto" header="" pt:header="p-0!">
        <template #header>
            <div class="w-full h-full">
                <div class="bg-surface-800 w-full h-full text-center text-3xl font-bold pl-3 py-4 text-white">
                    Actualizar datos de contacto
                </div>
            </div>
        </template>
        <div class=" grid grid-cols-12 pl-2 text-2xl font-semibold py-5">
            <DataBlock class="col-span-3" label="Nombre y apellido" data="Juana de Azurduy"></DataBlock>
            <DataBlock class="col-span-3" label="CUIL " data="27-33454665-1"></DataBlock>
        </div>
        <Form v-slot="$form" :initialValues="datosUsuario" :resolver="userResolver"
              @submit="() => {}"
              class="flex flex-col gap-4">
            <FormRow  :gap="3">
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
                    <Label required>Teléfono</label>
                    <FormRow class="w-full grid grid-cols-12 gap-3">
                        <!--                        <Select class="col-span-3" :options="[]"></Select>-->
                        <InputMask name="telefono.codigo" class="col-span-2" :autoClear="false" placeholder="11"
                                   mask="99?99" fluid></InputMask>
                        <InputMask name="telefono.numero" class="col-span-10" :autoClear="false" placeholder="1234-5678"
                                   mask="9999-9999" fluid></InputMask>
                    </FormRow>
                    <Message v-if="$form.telefono?.numero?.invalid || $form.telefono?.codigo?.invalid" severity="error"
                             size="small" variant="simple">
                        {{ $form.telefono?.error?.message }}
                    </Message>
                    <!--                <InputText placeholder="Telefono" v-model="data.telefono"></InputText>-->
                </FormCol>
            </FormRow>
            <div class="flex flex-row justify-end">
                <Button type="submit"  label="Actualizar"></Button>
            </div>
        </Form>
        <hr class="m-10 border-surface-800 border-1  w-full mx-0"/>
        <div class="flex flex-col gap-3">
            <Domicilio v-model:value="datosUsuario.domicilio" label="Datos de domicilio" name="domicilio" :border="false" :background="false"></Domicilio>
            <div class="flex flex-row justify-end">
                <Button type="submit"  label="Actualizar"></Button>
            </div>
        </div>
    </Panel>
</template>

<style scoped>

</style>
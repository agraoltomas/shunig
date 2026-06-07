<script setup lang="ts">

import { TipoUsuario } from '@/lib/tipos/usuario.ts'
import Label from '@/components/forms/Label.vue'
import Select from '@/volt/Select.vue'
import InputMask from '@/volt/InputMask.vue'
import { Form, FormField } from '@primevue/forms'
import FormCol from '@/components/forms/FormCol.vue'
import FormRow from '@/components/forms/FormRow.vue'
import type { FormSubmitEvent } from '@primevue/forms/form'
import axios from '@/lib/axios.ts'
import * as yup from 'yup'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import { onMounted, reactive, type Reactive, ref } from 'vue'
import type { Maybe, MessageResponse } from '@/lib/tipos/generics'
import type { User } from '@/lib/tipos/usuarios'
import { CUILValidator } from '@/lib/utils/cuil.ts'
import { useToast } from '@/lib/toast/toast.ts'
import Domicilio from '@/components/forms/Domicilio.vue'
import { domicilioSchema } from '@/validations/domicilio.ts'
import { useRoute } from 'vue-router'


interface DatosUsuario {
    cuit: Maybe<string>,
    nombre: Maybe<string>,
    apellido: Maybe<string>,
    email: Maybe<string>,
    password: Maybe<string>,
    direccion: Maybe<string>,
    telefono: {
        numero: Maybe<string>,
        codigo: Maybe<string>
    },
}

const toast = useToast()
const tipo = defineModel<Maybe<TipoUsuario>>('tipo')
const route = useRoute()

const defered  = ref(false);
onMounted(() => {
    if(route.query.t){
        switch (route.query.t){
            case 'refugio':
                tipo.value = TipoUsuario.Refugio
                break;
            case 'adopcion':
                tipo.value = TipoUsuario.Adoptante
                break;
            case 'transito':
                tipo.value = TipoUsuario.VoluntarioTransito
                break;
        }
        defered.value = true

    }
})
const datosUsuario: Reactive<DatosUsuario> = reactive({
    cuit: null,
    nombre: null,
    apellido: null,
    email: null,
    password: null,
    direccion: null,
    telefono: {
        numero: null,
        codigo: null
    }
})

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
const userResolver = yupResolver(yupUserSchema)

const emits = defineEmits<{ ingresado: [e: User] }>()
const ingresarUsuario = async (e: FormSubmitEvent) => {
    if(!e.valid)return;
    console.log(e)
    const r = await axios.post('/auth', {
        ...e.values,
        telefono: e.values?.telefono.numero ? `${e.values.telefono.codigo}${e.values.telefono.numero}` : null
    })
    if (r.status == 200) {
        const response: MessageResponse<User> = r.data
        toast.add({ detail: 'Se ha registrado correctamente', severity: 'success' })
        emits('ingresado', response.data)
    }
}
</script>

<template>
    <Form v-slot="$form" :initialValues="datosUsuario" :resolver="userResolver"
          @submit="ingresarUsuario"
          class="flex flex-col gap-4 w-full">
        <FormRow :cols="12" :gap="3">
            <FormCol :span="6">
                <Label required>Nombre</Label>
                <InputText required name="nombre" placeholder="Nombre" :maxlength="11"></InputText>
                <Message v-if="$form.nombre?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.nombre?.error?.message }}
                </Message>
            </FormCol>
            <FormCol :span="6">
                <Label required>Apellido</Label>
                <InputText name="apellido" placeholder="Apellido" :maxlength="11"></InputText>
                <Message v-if="$form.apellido?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.apellido?.error?.message }}
                </Message>
            </FormCol>
        </FormRow>
        <FormRow :cols="12" :gap="3">
            <FormCol :span="4">
                <Label required>Mail</label>
                <InputText name="email" placeholder="E-mail"></InputText>
                <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.email?.error?.message }}
                </Message>
            </FormCol>
            <FormCol :span="4">
                <Label required>Contraseña</label>
                <Password name="password" fluid placeholder="Contraseña"></Password>
                <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.password?.error?.message }}
                </Message>
            </FormCol>
            <FormCol :span="4">
                <Label required>CUIL</Label>
                <InputMask
                    name="cuit"
                    mask="99-99999999-9" :auto-clear="false"></InputMask>
            </FormCol>
        </FormRow>
        <FormRow :cols="12" :gap="3">
            <FormCol :span="6">
                <Label required>Teléfono</label>
                <FormRow class="w-full grid grid-cols-12 gap-3">
                    <!--                        <Select class="col-span-3" :options="[]"></Select>-->
                    <InputMask name="telefono.codigo" class="col-span-4" :autoClear="false" placeholder="11"
                               mask="99?99" fluid></InputMask>
                    <InputMask name="telefono.numero" class="col-span-8" :autoClear="false" placeholder="1234-5678"
                               mask="9999-9999" fluid></InputMask>
                </FormRow>
                <Message v-if="$form.telefono?.numero?.invalid || $form.telefono?.codigo?.invalid" severity="error"
                         size="small" variant="simple">
                    {{ $form.telefono?.error?.message }}
                </Message>
                <!--                <InputText placeholder="Telefono" v-model="data.telefono"></InputText>-->
            </FormCol>
        </FormRow>
        <hr />
        <Domicilio name="domicilio"></Domicilio>
        <div v-for="field in ['direccion','codigo_postal','localidad','ciudad','provincia']">
            <Message  v-if="$form.domicilio ? !!$form.domicilio[field].invalid : false " severity="error" size="large">
                {{ $form.domicilio ? $form.domicilio[field].error?.message : 'error' }}
            </Message>
        </div>

        <hr />
        <FormRow>
            <FormCol :span="12">
                <Label required>Registrarme como</Label>
                <Select :disabled="defered" class="max-w-fit" v-model="tipo" option-label="descripcion" option-value="id"
                        placeholder="Seleccione una opción"
                        :options="[ {id: TipoUsuario.Adoptante, descripcion: 'Adoptante'},{id: TipoUsuario.VoluntarioTransito, descripcion: 'Voluntario de Tránsito'},{ id: TipoUsuario.Refugio, descripcion: 'Refugio'}]"></Select>
            </FormCol>
        </FormRow>
        <div>
            <Button :disabled="!tipo" type="submit" fluid label="Registrarse"></Button>
        </div>
    </Form>
</template>

<style scoped>

</style>
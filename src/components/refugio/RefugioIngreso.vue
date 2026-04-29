<script setup lang="ts">
import * as yup from 'yup'
import { CUILValidator } from '@/lib/utils/cuil.ts'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import type { FormSubmitEvent } from '@primevue/forms/form'
import axios from '@/lib/axios.ts'
import Label from '@/components/forms/Label.vue'
import InputMask from '@/volt/InputMask.vue'
import { Form } from '@primevue/forms'
import FormCol from '@/components/forms/FormCol.vue'
import FormRow from '@/components/forms/FormRow.vue'
import { reactive, type Reactive } from 'vue'
import type { Maybe, MessageResponse } from '@/lib/tipos/generics'
import type { User } from '@/lib/tipos/usuarios'
import { useToast } from '@/lib/toast/toast.ts'
import Domicilio from '@/components/forms/Domicilio.vue'
import { domicilioSchema } from '@/validations/domicilio.ts'

const props = defineProps<{ admin: User }>()
const toast = useToast()
const yupRefugioSchema = yup.object().shape({
    cuit: yup.string().required('Campo obligatorio').test('valid-cuil', 'El CUIT es invalido', value => CUILValidator(value)).transform(value => value ? value.replaceAll('-', '') : value),
    nombre: yup.string().required('Campo obligatorio'),
    email: yup.string().email('Ingrese un mail valido').required('Campo obligatorio'),
    domicilio: domicilioSchema,
    telefono: yup.object().shape({
        numero: yup.string().transform(value => String(value).replace('-', '')).matches(/(\d)+/g),
        codigo: yup.number()
    })
})

interface DatosRefugio {
    cuit: Maybe<string>,
    nombre: Maybe<string>,
    email: Maybe<string>,
    telefono: {
        numero: Maybe<string>,
        codigo: Maybe<string>
    },
}

const datosRefugio: Reactive<DatosRefugio> = reactive({
    cuit: null,
    nombre: null,
    email: null,
    domicilio: null,
    telefono: {
        numero: '4440-8492',
        codigo: '11'
    }
})

interface IRefugio {

}

const refugioResolver = yupResolver(yupRefugioSchema)
const emits = defineEmits<{ ingresado: [refugio: any] }>()

const ingresarRefugio = async (e: FormSubmitEvent) => {
    if(!e.valid)return
    console.log(e, props.admin)
    if (!props.admin) {
        return
    }
    const r = await axios.post('/refugio', {
        id_usuario_adm: props.admin.id_usuario,
        ...e.values,
        telefono: e.values.telefono.numero ? `${e.values.telefono.codigo} ${e.values.telefono.numero}` : null
    })
    if (r.status == 200) {
        const response: MessageResponse<IRefugio> = r.data
        emits('ingresado', response.data)
        toast.add({ detail: `'${e.values.nombre}' ingresado correctamente `, severity: 'success' })
    }
}
</script>

<template>
    <Form v-slot="$form" :initialValues="datosRefugio" :resolver="refugioResolver" @submit="ingresarRefugio"
          class="flex flex-col gap-4 w-full">
        <FormRow>
            <FormCol :span="8">
                <Label required>Nombre</label>
                <InputText name="nombre" fluid placeholder="Nombre" :maxlength="100"></InputText>
                <Message v-if="$form.nombre?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.nombre?.error?.message }}
                </Message>
            </FormCol>
            <FormCol :span="4">
                <Label required>Capacidad total</Label>
                <InputNumber name="capacidad_total" :min="0"></InputNumber>
                <Message v-if="$form.capacidad_total?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.capacidad_total?.error?.message }}
                </Message>
            </FormCol>
        </FormRow>
        <FormRow>
            <!--            <FormCol :span="8">-->
            <!--                <Label required>Direccion</label>-->
            <!--                <InputText name="direccion" placeholder="Domicilio" :maxlength="11"></InputText>-->
            <!--                <Message v-if="$form.direccion?.invalid" severity="error" size="small" variant="simple">-->
            <!--                    {{ $form.direccion?.error?.message }}-->
            <!--                </Message>-->
            <!--            </FormCol>-->
        </FormRow>
        <Domicilio name="domicilio"></Domicilio>
        <div class="flex flex-row flex-wrap gap-2">
            <div v-for="field in ['direccion','codigo_postal','localidad','ciudad','provincia']">
                <Message v-if="$form.domicilio ? !!$form.domicilio[field].invalid : false " severity="error" pt:content="min-w-fit!" variant="outlined">
                    {{ $form.domicilio ? $form.domicilio[field].error?.message : 'error' }}
                </Message>
            </div>

        </div>

        <FormRow>
            <FormCol :span="12">
                <Label required>CUIT</label>
                <div class="flex items-stretch w-full">
                    <InputMask name="cuit" fluid mask="99-99999999-9"
                               class="rounded-e-none rounded-s-md"></InputMask>
                </div>
                <Message v-if="$form.cuit?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.cuit?.error?.message }}
                </Message>
            </FormCol>
        </FormRow>
        <FormRow>
            <FormCol :span="6">
                <Label required>Mail</label>
                <InputText name="email" placeholder="Mail"></InputText>
                <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.email?.error?.message }}
                </Message>
            </FormCol>
            <FormCol :span="6">
                <Label required>Teléfono</label>
                <FormRow class="w-full grid grid-cols-12 gap-3">
                    <InputMask class="col-span-3" :autoClear="false" placeholder="11" mask="99?99"
                               name="telefono.codigo" fluid></InputMask>
                    <InputMask class="col-span-6" :autoClear="false" placeholder="1234-5678" mask="9999-9999"
                               name="telefono.numero" fluid></InputMask>
                </FormRow>
                <Message v-if="$form.telefono?.codigo?.invalid || $form.telefono?.codigo?.invalid" severity="error"
                         size="small" variant="simple">
                    {{ $form.telefono?.error?.message }}
                </Message>
                <!--                <InputText placeholder="Telefono" v-model="data.telefono"></InputText>-->
            </FormCol>
        </FormRow>
        <div class="w-full py-3">
            <Button type="submit" fluid label="Registrarse"></Button>
        </div>
    </Form>
</template>

<style scoped>

</style>
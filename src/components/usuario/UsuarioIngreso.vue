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
import { onMounted, reactive, type Reactive, type Ref, ref, watch } from 'vue'
import type { Maybe, MessageResponse } from '@/lib/tipos/generics'
import type { User } from '@/lib/tipos/usuarios'
import { CUILValidator } from '@/lib/utils/cuil.ts'
import { useToast } from '@/lib/toast/toast.ts'
import Domicilio from '@/components/forms/Domicilio.vue'
import { useRoute } from 'vue-router'
import Contenedor from '@/components/generales/Contenedor.vue'
import ContenedorTitulo from '@/components/generales/ContenedorTitulo.vue'
import type { IDomicilio } from '@/lib/tipos/domicilio'
import FooterInterno from '../generales/FooterInterno.vue'


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
const domicilio: Ref<IDomicilio> = ref({
    direccion: null,
    localidad: null,
    provincia: null,
    no_tiene_altura: false
})
const defered = ref(false)
const parseTipo = () => {
    console.log(route.query.t)
    if (route.query.t) {
        switch (route.query.t) {
            case 'refugio':
                tipo.value = TipoUsuario.Refugio
                break
            case 'adopcion':
                tipo.value = TipoUsuario.Adoptante
                break
            case 'transito':
                tipo.value = TipoUsuario.VoluntarioTransito
                break
        }
        defered.value = true
    }
}
onMounted(() => {

    parseTipo()
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
    telefono: yup.object().shape({
        numero: yup.string().transform(value => String(value).replace('-', '')).matches(/(\d)+/g),
        codigo: yup.number()
    })
})
const userResolver = yupResolver(yupUserSchema)

const emits = defineEmits<{ ingresado: [e: User] }>()
const ingresarUsuario = async (e: FormSubmitEvent) => {
    console.log("!",e, domicilio.value, e.valid)
    if (!e.valid) return
    console.log(domicilio.value, domicilio.value.direccion)
    if(!domicilio.value || !domicilio.value.direccion) return

    console.log(1,e)
    const r = await axios.post('/auth', {
        ...e.values,
        domicilio: domicilio.value,
        telefono: e.values?.telefono.numero ? `${e.values.telefono.codigo}${e.values.telefono.numero}` : null,
    })
    if (r.status == 200) {
        const response: MessageResponse<User> = r.data
        toast.add({ detail: 'Se ha registrado correctamente', severity: 'success' })
        emits('ingresado', response.data)
    }
}

watch(() => route.query.t, () => {
    parseTipo()
})
</script>
<!--form de registro usuario-->
<template>
    <Form v-slot="$form" :initialValues="datosUsuario" :resolver="userResolver"
          @submit="ingresarUsuario"
          class="flex flex-col gap-4 w-full">

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ContenedorTitulo :cols="12" :gap="3" title="Datos generales" icon="pi pi-clipboard">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="flex flex-col gap-3">
                    <Label required for="nombre">Nombre</Label>
                    <InputText id="nombre" required name="nombre" placeholder="Nombre" :maxlength="11"></InputText>
                    <Message v-if="$form.nombre?.invalid" severity="error" size="small" variant="simple">
                        {{ $form.nombre?.error?.message }}
                    </Message>
                    </div>
                    <div class="flex flex-col gap-3">
                    <Label required for="apellido">Apellido</Label>
                    <InputText id="apellido" name="apellido" placeholder="Apellido" :maxlength="11"></InputText>
                    <Message v-if="$form.apellido?.invalid" severity="error" size="small" variant="simple">
                        {{ $form.apellido?.error?.message }}
                    </Message>
                    </div>
                    <div class="flex flex-col gap-3 sm:col-span-2">
                    <Label for="cuil" required>CUIL</Label>
                    <InputMask id="cuil"
                        name="cuit"
                        mask="99-99999999-9" :auto-clear="false"></InputMask>
                    </div>
                </div>               
                
            </ContenedorTitulo>

            <ContenedorTitulo title="Contacto" icon="pi pi-phone">
                <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-3">
                    <Label for="email" required>Mail</label>
                    <InputText id="email" name="email" placeholder="E-mail"></InputText>
                    <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">
                        {{ $form.email?.error?.message }}
                    </Message>
                    </div>

                    <div class="flex flex-col gap-3">
                    <Label for="telefono" required>Teléfono</label>
                    <div class="grid grid-cols-12 gap-3">
                        <!--                        <Select class="col-span-3" :options="[]"></Select>-->
                        <InputMask name="telefono.codigo" class="col-span-4" :autoClear="false" placeholder="11"
                                   mask="99?99" fluid></InputMask>
                        <InputMask id="telefono" name="telefono.numero" class="col-span-8" :autoClear="false" placeholder="1234-5678"
                                   mask="9999-9999" fluid></InputMask>
                    </div>
                    <Message v-if="$form.telefono?.numero?.invalid || $form.telefono?.codigo?.invalid" severity="error"
                             size="small" variant="simple">
                        {{ $form.telefono?.error?.message }}
                    </Message>
                </div>
                </div>                
            </ContenedorTitulo>            
        </div>

        <ContenedorTitulo title="Seguridad" icon="pi pi-lock">
            <div class="flex flex-col gap-3">
            <Label for="password" required>Contraseña</label>
            <Password id="password" name="password" fluid placeholder="Contraseña"></Password>
            <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">
                {{ $form.password?.error?.message }}
            </Message>
            </div>
        </ContenedorTitulo>

        <Contenedor>
            <Domicilio v-model:value="domicilio" :border="false"></Domicilio>
        </Contenedor>

        <Contenedor>
            <div class="flex flex-col gap-3">
                <Label required>Registrarme como</Label>
                <Select :disabled="defered" class="w-full sm:max-w-fit" v-model="tipo" option-label="descripcion"
                        option-value="id"
                        placeholder="Seleccione una opción"
                        :options="[ {id: TipoUsuario.Adoptante, descripcion: 'Adoptante'},{id: TipoUsuario.VoluntarioTransito, descripcion: 'Voluntario de Tránsito'},{ id: TipoUsuario.Refugio, descripcion: 'Refugio'}]"></Select>
            
            </div>
        </Contenedor>
        <div>
            <Button :disabled="!tipo" type="submit" fluid label="Registrarse"></Button>
        </div>
    </Form>
</template>

<style scoped>

</style>
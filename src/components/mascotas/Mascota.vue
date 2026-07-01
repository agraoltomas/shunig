<script setup lang="ts">
import type { IMascota } from '@/lib/tipos/mascotas'
import { useModalStore } from '@/stores/modales.ts'
import { type Reactive, reactive, type Ref, ref, useTemplateRef } from 'vue'
import { Form, type FormResolverOptions } from '@primevue/forms'
import FormRow from '@/components/forms/FormRow.vue'
import FormCol from '@/components/forms/FormCol.vue'
import TableSelect from '@/components/forms/TableSelect.vue'
import { TablaEstatica } from '@/lib/tipos/estaticos.ts'
import Label from '@/components/forms/Label.vue'
import ToggleSwitch from '@/volt/ToggleSwitch.vue'
import FileUpload from '@/components/forms/FileUpload.vue'
import SinImagen from '@/components/generales/SinImagen.vue'
import MascotaDetalle from '@/components/mascotas/MascotaDetalle.vue'
import type { Maybe, MessageResponse } from '@/lib/tipos/generics'
import type { FormSubmitEvent } from '@primevue/forms/form'
import { useAxios } from '@/lib/axios.ts'
import { toBase64 } from '@/lib/utils/files.ts'
import { AxiosError } from 'axios'
import { useToast } from '@/lib/toast/toast.ts'
import ProgressSpinner from 'primevue/progressspinner'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
import handshake from '@/assets/images/handshake-regular-full-white.svg'
import paw from '@/assets/images/paw-solid-full.svg'
import Tag from '@/volt/Tag.vue'
import { useAuthStore } from '@/stores/auth.ts'
import { useRouter } from 'vue-router'
import { TipoSolicitud } from '@/lib/tipos/solicitud.ts'
import Contenedor from '@/components/generales/Contenedor.vue'
import DataListGroup from '@/components/generales/DataListGroup.vue'
import EstadoSalud from '@/components/mascotas/EstadoSalud.vue'
import Footer from '@/components/generales/Footer.vue'
import Modal from '@/components/modal/Modal.vue'
import HistorialAnimal from '@/components/mascotas/HistorialAnimal.vue'
import VacunasAnimalResumen from '@/components/mascotas/VacunasAnimalResumen.vue'
import ContenedorTitulo from '@/components/generales/ContenedorTitulo.vue'
import moment from 'moment'

const props = defineProps<{ mascota: IMascota }>()
const emit = defineEmits<{ actualizado: [] }>()

const modalStore = useModalStore()
const { axios } = useAxios()
const { startLoading, loading, stopLoading } = useLoadingComposable()
const authStore = useAuthStore()
const router = useRouter()
const toImageSource = (f: File): string => {
    return URL.createObjectURL(f)
}

const editando = ref(false)
const valores = reactive({
    id_sexo: props.mascota.id_sexo,
    raza: props.mascota.raza,
    es_castrado: props.mascota.es_castrado,
    edad: props.mascota.edad,
    id_especie: props.mascota.id_especie,
    observaciones: props.mascota.observaciones
})
const newValues: Reactive<{ [k in keyof IMascota]?: any }> = reactive({})
const updateNew = (l: keyof IMascota, v: any) => {
    newValues[l] = v
}
const toast = useToast()

const resolver = ({ values }: FormResolverOptions) => {
    const errors: {
        raza: { message: string }[]
        edad: { message: string }[]
        id_sexo: { message: string }[]
        id_especie: { message: string }[]
        observaciones: { message: string }[]
        es_castrado: { message: string }[]
    } = {
        raza: [],
        edad: [],
        id_sexo: [],
        id_especie: [],
        observaciones: [],
        es_castrado: []
    }

    if (!values.raza) {
        errors.raza.push({ message: 'La raza es obligatoria' })
    }

    if (values.edad === null || values.edad === undefined) {
        errors.edad.push({ message: 'La edad es obligatoria' })
    }

    if (!values.id_sexo) {
        errors.id_sexo.push({ message: 'El sexo es obligatorio' })
    }

    if (!values.id_especie) {
        errors.id_especie.push({ message: 'La especie es obligatoria' })
    }

    return {
        values,
        errors
    }
}

const actualizarMascota = async (e: FormSubmitEvent) => {
    if (!props.mascota) return
    const dirty = Object.keys(e.states).filter(k => e.states[k]?.dirty)
    console.log(dirty)
    const datos: { [k: string]: any } = {}
    dirty.forEach((k) => {
        datos[k] = e.values[k]
        console.log(typeof datos[k])
    })
    console.log(datos)
    if (newImage.value) {
        datos['imagen'] = await toBase64(newImage.value)
    }
    try {

        const r = await axios.value.patch(`/animal/${props.mascota.id_animal}/`, {
            ...datos
        })
        const response: MessageResponse<any> = r.data
        toast.add({ detail: 'Animal actualizado exitosamente', severity: 'success' })
        editando.value = false
        emit('actualizado')
    } catch (e) {
        if (e instanceof AxiosError) {

        }
    }
}

const form = useTemplateRef<typeof Form & { submit: () => void }>('form')
const newImage: Ref<Maybe<File>> = ref(null)
const imageDisplay: Ref<Maybe<File>> = ref(props.mascota.imagen ? new File(Array.from(props.mascota.imagen), 'imagen') : null)

const formatearFecha = (fecha?: string | null) => {
    return fecha ? moment.utc(fecha).format('DD-MM-YYYY') : '-'
}

</script>

<template>
    <div class="w-3/4 m-auto mt-10 mb-15">
        <!--edicion-->
        <Contenedor v-if="editando">
            <div class="flex flex-row justify-between items-center mb-5">
                <div>
                    <div class="text-3xl font-bold mb-2">
                        Editar animal
                    </div>

                    <div class="text-xl mb-2">
                        <span class="font-semibold mr-4">{{ mascota.nombre }}</span>
                        <span class="pi pi-calendar text-primary-500 mr-1"></span>
                        <span>{{ formatearFecha(mascota.fecha_ingreso) }}</span>
                    </div>

                    <div class="text-gray-500">
                        Modificá los datos principales del animal.
                    </div>
                </div>
                <div class="rounded-full bg-primary-200/30 w-20 h-20 flex items-center justify-center">
                    <i class="pi pi-pencil text-primary-500 text-3xl"></i>
                </div>
            </div>
            <Form ref="form" v-slot="$form" :initialValues="valores" :resolver
                  @submit="actualizarMascota" class="flex flex-col gap-4">
                <div class="grid grid-cols-2 gap-5">
                    <div class="shadow-[0_0_10px_rgba(0,0,0,0.10)] rounded-2xl p-4 flex flex-col gap-4">
                        <div class="flex flex-row text-xl gap-3 mb-2">
                            <div class="bg-primary-200/30 rounded-full p-1 min-w-9 h-fit text-center">
                                <i class="pi pi-image text-primary-500"></i>
                            </div>
                            <div class="font-semibold h-fit my-auto">
                                Imagen
                            </div>
                        </div>
                        <Image v-if="newImage" class="m-auto" pt:image="max-w-72!"
                               :src="toImageSource(newImage)">
                        </Image>
                        <Image v-else-if="mascota.imagen" class="m-auto" pt:image="max-w-72!"
                               :src="mascota.imagen"></Image>
                        <SinImagen v-else />
                        <div class="flex flex-row gap-3 justify-around">
                            <FileUpload v-model="newImage" @update:model-value="(f) => {
                        if(f === undefined) return
                        newImage = f;
                        imageDisplay = f;
                        }" :preview="false"></FileUpload>
                        </div>
                        <!--                <div :hidden="" class=""></div>-->
                    </div>
                    <div class="shadow-[0_0_10px_rgba(0,0,0,0.10)] rounded-2xl p-4">
                        <div class="flex flex-row text-xl gap-3 mb-4">
                            <div class="bg-primary-200/30 rounded-full p-1 min-w-9 h-fit text-center">
                                <i class="pi pi-info-circle text-primary-500"></i>
                            </div>

                            <div class="font-semibold h-fit my-auto">
                                Datos principales
                            </div>
                        </div>
                        <FormRow class="w-fulL mb-3">
                            <FormCol :span="6">
                                <Label for="id_sexo" required>Sexo</Label>
                                <TableSelect id="id_sexo" name="id_sexo" :tipo="TablaEstatica.Sexo"></TableSelect>
                                <Message v-if="$form.id_sexo?.invalid" severity="error" size="small" variant="simple">
                                    {{ $form.id_sexo.error?.message }}
                                </Message>
                            </FormCol>
                            <FormCol :span="6">
                                <Label for="raza" required>Raza</Label>
                                <InputText id="raza" fluid name="raza"></InputText>
                                <Message v-if="$form.raza?.invalid" severity="error" size="small" variant="simple">
                                    {{ $form.raza.error?.message }}
                                </Message>
                            </FormCol>
                        </FormRow>
                        <FormRow class="w-full mb-3">
                            <FormCol :span="6">
                                <Label for="edad" required>Edad</Label>
                                <InputNumber id="edad" fluid name="edad"></InputNumber>
                            </FormCol>
                            <FormCol :span="6">
                                <Label for="id_especie" required>Especie</Label>
                                <TableSelect id="id_especie" name="id_especie"
                                             :tipo="TablaEstatica.Especie"></TableSelect>
                                <Message
                                    v-if="$form.id_especie?.invalid"
                                    severity="error"
                                    size="small"
                                    variant="simple">
                                    {{ $form.id_especie.error?.message }}
                                </Message>
                            </FormCol>
                        </FormRow>
                        <FormRow>
                            <FormCol :span="4">
                                <Label class="my-auto ml-3">Castrado</Label>
                                <ToggleSwitch name="es_castrado" class="m-auto"></ToggleSwitch>
                            </FormCol>
                        </FormRow>
                    </div>
                </div>
                <div class="flex flex-col gap-4">
                    <div class="shadow-[0_0_10px_rgba(0,0,0,0.10)] rounded-2xl p-4">
                        <FormRow class="w-full">
                            <FormCol :span="12">
                                <Label for="observaciones">
                                    Observaciones
                                </Label>
                                <Textarea id="observaciones" fluid name="observaciones" :auto-resize="true"
                                          rows="4"
                                ></Textarea>
                            </FormCol>
                        </FormRow>
                    </div>
                </div>
                <div class="flex justify-end gap-3 py-2">
                    <Button
                        type="button"
                        class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500"
                        icon="pi pi-times"
                        label="Cancelar"
                        @click="editando = false"></Button>

                    <Button
                        type="submit"
                        class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500"
                        icon="pi pi-check"
                        label="Guardar"></Button>
                </div>
            </Form>
        </Contenedor>
        <!--fin edicion-->
        <!--detalle-->
        <Contenedor v-else class="overflow-auto m-auto" pt:header="p-0!">
            <div v-if="mascota" class="flex flex-col gap-3">
                <!-- Sector de botones -->
                <div class="flex flex-row justify-between items-center gap-4 pb-4 mb-5 border-b border-gray-200">
                    <span class="font-bold text-2xl">Detalle del animal</span>
                    <div class="flex flex-row gap-3">
                        <Button
                            class="bg-transparent! border-refugio-500! text-refugio-500! hover:bg-refugio-200!"
                            outlined
                            severity="secondary"
                            icon="pi pi-undo"
                            label="Volver"
                            @click="$router.go(-1)"></Button>

                        <Button
                            outlined
                            severity="success"
                            icon="pi pi-pencil"
                            label="Editar"
                            @click="editando = true"></Button>

                    </div>
                </div>
                <!--fin sector de botones-->
                <MascotaDetalle :mascota="mascota">
                    <div v-if="mascota.transito">
                        <Button
                            class="font-semibold bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500"
                            @click="() => router.push(`/refugio/transito/${mascota.transito}`)">
                            <span>En tránsito</span>
                            <i class="pi pi-eye"></i>
                            <span class="sr-only">Ver detalle del tránsito</span>
                        </Button>
                    </div>
                    <div v-else-if="mascota.adopcion">
                        <Button
                            class="font-semibold bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500"
                            @click="() => router.push(`/refugio/adopcion/${mascota.adopcion}`)">
                            <span>Adoptado</span>
                            <i class="pi pi-eye"></i>
                            <span class="sr-only">Ver detalle de la adopción</span>
                        </Button>
                    </div>

                    <Tag v-else-if="mascota.solicitud">Solicitud
                        {{ mascota.solicitud.tipo_solicitud == TipoSolicitud.Adopcion ? 'de adopcion' : 'de transito' }}
                        pendiente
                    </Tag>
                    <div v-else class="flex flex-row gap-3 justify-around">
                        <Button label="Adoptar" icon-pos="left"
                                class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500"
                                @click="() => modalStore.abrir('adopcion', {mascota, usuario: authStore.user})">
                            <template #icon>
                                <img class="size-5 text-white" :src="paw"></img>
                            </template>
                        </Button>
                        <Button label="Asignar tránsito" icon-pos="left"
                                class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500"
                                @click="() => modalStore.abrir('nuevoTransito', {mascota, usuario: authStore.user})">
                            <template #icon>
                                <img class="size-5 text-white" :src="handshake"></img>
                            </template>
                        </Button>
                    </div>
                </MascotaDetalle>
            </div>
        </Contenedor>
        <!--fin detalle-->
        <div class="flex flex-row gap-5 mt-10">
            <EstadoSalud class="w-1/3" :mascota="mascota"></EstadoSalud>
            <ContenedorTitulo title="Eventos de vacunación" icon="pi pi-heart" class="w-1/3">
                <VacunasAnimalResumen :mascota="mascota"></VacunasAnimalResumen>
            </ContenedorTitulo>
            <Contenedor class="w-1/3">
                <div class="flex flex-row text-xl gap-3 pb-3">
                    <div class="bg-primary-200/30 rounded-full p-1 min-w-9 text-center">
                        <i class="text-primary-500 text-center pi pi-heart"></i>
                    </div>
                    <div class="font-semibold h-fit my-auto pr-2">Historial de hogares</div>
                </div>
                <HistorialAnimal :id_animal="mascota.id_animal"></HistorialAnimal>
            </Contenedor>
        </div>
    </div>
    <Contenedor v-if="loading" class="col-span-12 row-span-4 col-start-5">
        <ProgressSpinner
            class="m-auto h-20! text-center"
            pt:circle="stroke-red-100 p-progressspinner-circle"
            pt:root="p-progressspinner w-full!"
            pt:spin="p-progressspinner-spin" />
    </Contenedor>
</template>

<style scoped>
.crossed {
    background: linear-gradient(to top left,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0) calc(50% - 2px),
    color-mix(in oklab, var(--color-gray-500) 30%, transparent) 50%,
    rgba(0, 0, 0, 0) calc(50% + 2px),
    rgba(0, 0, 0, 0) 100%);
}
</style>
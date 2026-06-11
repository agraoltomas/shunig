<script setup lang="ts">
import type { IMascota } from '@/lib/tipos/mascotas'
import { useModalStore } from '@/stores/modales.ts'
import { type Reactive, reactive, type Ref, ref, useTemplateRef } from 'vue'
import { Form } from '@primevue/forms'
import FormRow from '@/components/forms/FormRow.vue'
import FormCol from '@/components/forms/FormCol.vue'
import TableSelect from '@/components/forms/TableSelect.vue'
import { TablaEstatica } from '@/lib/tipos/estaticos.ts'
import Label from '@/components/forms/Label.vue'
import ToggleSwitch from '@/volt/ToggleSwitch.vue'
import FileUpload from '@/components/forms/FileUpload.vue'
import * as yup from 'yup'
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
import VacunasAnimal from '@/components/mascotas/VacunasAnimal.vue'
import ContenedorTitulo from '@/components/generales/ContenedorTitulo.vue'

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
const newValues: Reactive<{ [k in keyof IMascota]?: any }> = reactive({})
const updateNew = (l: keyof IMascota, v: any) => {
    newValues[l] = v
}
const toast = useToast()
const updateAnimalSchema = yup.object({
    nombre: yup.string().trim().min(3),
    edad: yup.number().min(1)
    // es_castrado: false,
    // id_especie: 0,
    // id_sexo: 0,
    // imagen: null,
    // observaciones: null,
    // raza: null,
} satisfies { [k in keyof IMascota]?: any })


const actualizar = async (e: FormSubmitEvent) => {
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


</script>

<template>
    <Contenedor v-if="editando" class="w-3/4 m-auto">
        <div class="flex flex-row gap-4 pt-3">
            <Form ref="form" v-slot="$form" @submit="actualizar" :initial-values="mascota" class="flex flex-row">
                <div class="flex flex-col gap-3 mx-3 min-w-96 justify-between h-full">
                    <Image v-if="newImage" class="m-auto" pt:image="max-w-72!"
                           :src="toImageSource(newImage)">
                    </Image>
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
                <div class="flex flex-col mx-6 gap-3 ">
                    <FormRow class="text-start text-lg font-semibold" :gap="5">
                        <FormCol :span="3">
                            <Label>Sexo</Label>
                            <TableSelect name="id_sexo" :tipo="TablaEstatica.Sexo"></TableSelect>
                        </FormCol>
                        <FormCol :span="6">
                            <Label>Raza</Label>
                            <InputText fluid name="raza"></InputText>
                        </FormCol>
                        <FormCol :span="3">
                            <Label class="my-auto ml-3">Castrado</Label>
                            <ToggleSwitch name="es_castrado" class="m-auto"></ToggleSwitch>
                        </FormCol>
                    </FormRow>
                    <FormRow class="text-start text-lg font-semibold">
                        <FormCol :span="2">
                            <Label>Edad</Label>
                            <InputNumber fluid name="edad"></InputNumber>
                        </FormCol>
                        <FormCol :span="10">
                            <Label>Especie</Label>
                            <TableSelect class="w-fit" name="id_especie" :tipo="TablaEstatica.Especie"></TableSelect>
                        </FormCol>
                    </FormRow>
                    <FormRow class="text-start text-lg font-semibold">
                    </FormRow>
                    <FormRow class="text-start text-lg font-semibold">
                        <FormCol :span="12">
                            <Label>Observaciones</Label>
                            <Textarea name="observaciones"></Textarea>
                        </FormCol>
                    </FormRow>
                </div>
            </Form>
        </div>
    </Contenedor>
    <Contenedor v-else class="overflow-auto w-[75%] m-auto" pt:header="p-0!">
        <div v-if="mascota" class="flex flex-col gap-3">
            <MascotaDetalle :mascota="mascota">
                <div v-if="mascota.transito">
                    <Button label="En tránsito" icon="pi pi-eye" icon-pos="right"
                            @click="() => router.push(`/refugio/transito/${mascota.transito}`)"></Button>
                </div>
                <Tag v-else-if="mascota.adopcion">
                    <Button label="En adopción" icon="pi pi-eye" icon-pos="right"
                            @click="() => router.push(`/refugio/adopcion/${mascota.adopcion}`)"></Button>
                </Tag>
                <Tag v-else-if="mascota.solicitud">Solicitud
                    {{ mascota.solicitud.tipo_solicitud == TipoSolicitud.Adopcion ? 'de adopcion' : 'de transito' }}
                    pendiente
                </Tag>
                <div v-else class="flex flex-row gap-3 justify-around">
                    <Button label="Adoptar" icon-pos="left"
                            @click="() => modalStore.abrir('adopcion', {mascota, usuario: authStore.user})">
                        <template #icon>
                            <img class="size-5 text-white" :src="paw"></img>
                        </template>
                    </Button>
                    <Button label="Asignar tránsito" icon-pos="left"
                            @click="() => modalStore.abrir('nuevoTransito', {mascota, usuario: authStore.user})">
                        <template #icon>
                            <img class="size-5 text-white" :src="handshake"></img>
                        </template>
                    </Button>
                </div>
            </MascotaDetalle>
        </div>
    </Contenedor>
    <div class="w-3/4">
        <div class="flex-row flex gap-3 justify-end py-5">
            <Button v-if="editando" icon="pi pi-check" label="Guardar" @click="() => form?.submit()"></Button>
            <Button class=""
                    :icon="editando ? 'pi pi-times' : 'pi pi-pencil' "
                    :label=" editando ? 'Cancelar' : 'Editar'"
                    @click="() => editando = !editando"></Button>
        </div>
    </div>
    <div class="flex flex-row gap-5 m-auto w-3/4">
        <EstadoSalud class="w-1/3" :mascota="mascota"></EstadoSalud>

        <ContenedorTitulo title="Eventos de vacunación" icon="pi pi-heart" class="w-1/3">
                <VacunasAnimal :mascota="mascota"></VacunasAnimal>
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
    <Panel v-if="loading" class="col-span-12 row-span-4 col-start-5">
        <ProgressSpinner
            class="m-auto h-20! text-center"
            pt:circle="stroke-red-100 p-progressspinner-circle"
            pt:root="p-progressspinner w-full!"
            pt:spin="p-progressspinner-spin" />
    </Panel>
    <Footer></Footer>

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
<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import type { IPatrocinador } from '@/lib/tipos/patrocinadores'
import moment from 'moment'
import FormRow from '@/components/forms/FormRow.vue'
import FormCol from '@/components/forms/FormCol.vue'
import Label from '@/components/forms/Label.vue'
import axios from '@/lib/axios.ts'
import { useToast } from '@/lib/toast/toast.ts'
import { useModalStore } from '@/stores/modales'
import { Form, type FormResolverOptions } from '@primevue/forms'
import type { FormSubmitEvent } from '@primevue/forms/form'
import DataTable from '@/volt/DataTable.vue'
import type { IDonacionPatrocinador } from '@/lib/tipos/donaciones'
import DangerButton from '@/volt/DangerButton.vue'

const toast = useToast()
const modalesStore = useModalStore()

const props = defineProps<{
    patrocinador: IPatrocinador
}>()

const emits = defineEmits<{
    actualizado: [patrocinador: IPatrocinador]
    eliminado: []
}>()

const editando = ref(false)
const donaciones = ref<IDonacionPatrocinador[]>([]);

const totalDonacionesAceptadas = computed(() => {
    return donaciones.value.filter((donacion) => {
        return Number(donacion.id_estado_solicitud) === 1
    }).length
})

const totalDonacionesRecibidas = computed(() => {
    return donaciones.value.filter((donacion) => {
        return Number(donacion.id_estado_solicitud) === 1
            && donacion.fecha_recepcion
    }).length
})

const totalDonacionesPendientes = computed(() => {
    return donaciones.value.filter((donacion) => {
        return Number(donacion.id_estado_solicitud) === 2
    }).length
})

const valores = reactive({
    nombre: props.patrocinador.nombre,
    contacto: props.patrocinador.contacto,
    email: props.patrocinador.email,
    descripcion: props.patrocinador.descripcion
})

const inicialesPatrocinador = (nombre: string) => {
    return nombre
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((parte) => parte[0])
        .join('')
        .toUpperCase()
}

const cargarDonacionesPatrocinador = async () => {
    const r = await axios.get(`/donacion/patrocinador/${props.patrocinador.id_patrocinador}`)

    if ([200, 201].includes(r.status)) {
        donaciones.value = r.data.data
    }
}

onMounted(async () => {
    await cargarDonacionesPatrocinador()
})

const actualizarPatrocinador = async (e: FormSubmitEvent) => {
    if (!props.patrocinador) return

    const r = await axios.patch(`/patrocinador/${props.patrocinador.id_patrocinador}`, e.values)

    if ([200, 201].includes(r.status)) {
        const patrocinadorActualizado = r.data.data

        Object.assign(valores, {
            nombre: patrocinadorActualizado.nombre,
            contacto: patrocinadorActualizado.contacto,
            email: patrocinadorActualizado.email,
            descripcion: patrocinadorActualizado.descripcion
        })

        toast.add({
            severity: 'success',
            summary: 'Éxito!',
            detail: `${e.values.nombre} se modificó exitosamente`
        })

        editando.value = false
        emits('actualizado', patrocinadorActualizado)
    }
}

const resolver = ({ values }: FormResolverOptions) => {
    const errors: { [K in keyof typeof valores]: { message: string }[] } = {
        nombre: [],
        contacto: [],
        email: [],
        descripcion: []
    }

    if (!values.nombre) {
        errors.nombre.push({ message: 'El nombre es obligatorio' })
    }

    if (!values.contacto) {
        errors.contacto.push({ message: 'Los datos de contacto son obligatorios' })
    }

    if (!values.email) {
        errors.email.push({ message: 'El email es obligatorio' })
    }

    if (!values.descripcion) {
        errors.descripcion.push({ message: 'La descripción es obligatoria' })
    }

    return {
        values,
        errors
    }
}

const formatearFecha = (fecha?: string | null) => {
    return fecha ? moment.utc(fecha).format('DD-MM-YYYY') : '-'
}
</script>
<!--Vista del detalle de cada patrocinador-->
<template>
    <div class="w-3/4 m-auto flex flex-col gap-4 mt-10 mb-15">
        <div v-if="patrocinador" class="shadow-[0_0_10px_rgba(0,0,0,0.18)] rounded-2xl p-5 bg-white">
            <div v-if="!editando" class="gap-6">
                <!-- Sector de botones -->
                <div class="flex flex-row justify-between items-center gap-4 pb-4 mb-5 border-b border-gray-200">
                    <span class="font-bold text-2xl">Detalle del patrocinador</span>
                    <div class="flex flex-row gap-3">
                        <Button
                        class="!bg-transparent !border-refugio-500 !text-refugio-500 hover:!bg-refugio-200"
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
                        @click="editando = true"
                        ></Button>

                        <DangerButton
                        outlined
                        icon="pi pi-trash"
                        label="Eliminar"
                        @click="modalesStore.abrir('eliminar', {
                        nombre: patrocinador.nombre,
                            endpoint: `/patrocinador/${patrocinador.id_patrocinador}`,
                            volverPrincipal: '/refugio/patrocinadores'
                        })"></DangerButton>
                        
                    </div>
                </div>
                <!--fin sector de botones-->
                <!--Detalles-->
                <div class="flex flex-row gap-5 grow">
                    <div class="rounded-full bg-primary-200/30 w-28 h-28 flex items-center justify-center shrink-0">
                        <div class="text-primary-500 text-4xl font-bold">
                            {{ inicialesPatrocinador(patrocinador.nombre) }}
                        </div>
                    </div>

                    <div class="flex flex-col gap-3 grow">
                        <div class="flex flex-row gap-4 items-center">
                            <div class="font-bold text-3xl">
                                {{ patrocinador.nombre }}
                            </div>

                            <Tag severity="success" value="Patrocinador" />
                        </div>

                        <div class="flex flex-row flex-wrap gap-4 pb-4 shadow-[0_0.5px_0_0_rgba(0,0,0,0.12)] w-fit">
                            <div class="flex flex-row gap-2 items-center">
                                <span class="pi pi-hashtag text-primary-500"></span>
                                <span>Código #{{ patrocinador.id_patrocinador }}</span>
                            </div>

                            <div class="flex flex-row gap-2 items-center">
                                <span class="pi pi-calendar text-primary-500"></span>
                                <span>{{ formatearFecha(patrocinador.fecha_alta) }}</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4 mt-2">
                            <div class="flex flex-row gap-2 items-center">
                                <span class="pi pi-phone text-primary-500"></span>
                                <div>
                                    <div class="text-sm text-gray-500">Contacto</div>
                                    <div class="font-semibold">{{ patrocinador.contacto }}</div>
                                </div>
                            </div>

                            <div class="flex flex-row gap-2 items-center">
                                <span class="pi pi-envelope text-primary-500"></span>
                                <div>
                                    <div class="text-sm text-gray-500">Email</div>
                                    <div class="font-semibold">{{ patrocinador.email }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--fin detalles-->               
            </div>

            <!-- edicion -->
            <div v-else>
                <div class="flex flex-row justify-between items-center mb-5">
                    <div>
                        <div class="text-3xl font-bold mb-2">
                            Editar patrocinador
                        </div>
                        <div class="text-xl mb-2">
                        <span>
                            <span class="mr-4">{{ patrocinador.nombre}}</span>
                                <span class="pi pi-hashtag text-primary-500 mr-1"></span>
                                <span class="mr-4">Código #{{ patrocinador.id_patrocinador }}</span>
                          

                                <span class="pi pi-calendar text-primary-500 mr-1"></span>
                                <span>{{ formatearFecha(patrocinador.fecha_alta) }}</span>
                            
                        
                        </span>                        
                    </div>
                        <div class="text-gray-500">
                            Modificá los datos principales del patrocinador.
                        </div>
                    </div>

                    <div class="rounded-full bg-primary-200/30 w-20 h-20 flex items-center justify-center">
                        <i class="pi pi-user-edit text-primary-500 text-3xl"></i>
                    </div>
                </div>

                <Form
                    ref="form"
                    v-slot="$form"
                    :initialValues="valores"
                    :resolver
                    @submit="actualizarPatrocinador"
                    class="flex flex-col gap-4"
                >

                    <div class="shadow-[0_0_10px_rgba(0,0,0,0.10)] rounded-2xl p-4">
                        <div class="flex flex-row text-xl gap-3 mb-4">
                            <div class="bg-primary-200/30 rounded-full p-1 min-w-9 h-fit text-center">
                                <i class="pi pi-user text-primary-500"></i>
                            </div>
                            <div class="font-semibold h-fit my-auto">
                                Datos principales
                            </div>
                        </div>

                        <FormRow class="w-full mb-5">
                            <FormCol :span="6">
                                <Label for="nombre" required>Nombre</Label>
                                <InputText id="nombre" fluid name="nombre" />
                                <Message
                                    v-if="$form.nombre?.invalid"
                                    severity="error"
                                    size="small"
                                    variant="simple"
                                >
                                    {{ $form.nombre.error?.message }}
                                </Message>
                            </FormCol>

                            <FormCol :span="6">
                                <Label for="contacto" required>Contacto</Label>
                                <InputText id="contacto" fluid name="contacto" />
                                <Message
                                    v-if="$form.contacto?.invalid"
                                    severity="error"
                                    size="small"
                                    variant="simple"
                                >
                                    {{ $form.contacto.error?.message }}
                                </Message>
                            </FormCol>
                        </FormRow>

                        <FormRow class="w-full">
                            <FormCol :span="12">
                                <Label for="email" required>Email</Label>
                                <InputText id="email" fluid name="email" />
                                <Message
                                    v-if="$form.email?.invalid"
                                    severity="error"
                                    size="small"
                                    variant="simple"
                                >
                                    {{ $form.email.error?.message }}
                                </Message>
                            </FormCol>
                        </FormRow>
                    </div>

                    <div class="shadow-[0_0_10px_rgba(0,0,0,0.10)] rounded-2xl p-4">
                        <div class="flex flex-row text-xl gap-3 mb-4">
                            <div class="bg-primary-200/30 rounded-full p-1 min-w-9 h-fit text-center">
                                <i class="pi pi-pencil text-primary-500"></i>
                            </div>
                            <div class="font-semibold h-fit my-auto">
                                Descripción
                            </div>
                        </div>

                        <FormRow class="w-full">
                            <FormCol :span="12">
                                <Label class="sr-only" for="descripcion" required>Descripción</Label>
                                <Textarea
                                    id="descripcion"
                                    fluid
                                    name="descripcion"
                                    :auto-resize="true"
                                    rows="4"
                                />
                                <Message
                                    v-if="$form.descripcion?.invalid"
                                    severity="error"
                                    size="small"
                                    variant="simple"
                                >
                                    {{ $form.descripcion.error?.message }}
                                </Message>
                            </FormCol>
                        </FormRow>
                    </div>

                    <div class="flex justify-end gap-3 py-2">
                        <Button
                            type="button" class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500"
                            icon="pi pi-times"
                            label="Cancelar"
                            @click="editando = false"
                        />

                        <Button
                            type="submit" class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500"
                            icon="pi pi-check"
                            label="Guardar"
                        />
                    </div>
                </Form>
            </div>
        </div>

        <!-- descripcion -->
        <div
            v-if="patrocinador && !editando"
            class="shadow-[0_0_10px_rgba(0,0,0,0.18)] rounded-2xl p-5 bg-white"
        >
            <div class="flex flex-row text-xl gap-3">
                <div class="bg-primary-200/30 rounded-full p-1 min-w-9 h-fit text-center">
                    <i class="pi pi-align-left text-primary-500"></i>
                </div>
                <div class="font-semibold h-fit my-auto">
                    Descripción
                </div>
            </div>

            <div class="p-3">
                <Textarea
                    fluid
                    disabled
                    :value="patrocinador.descripcion"
                    :auto-resize="true"
                    rows="3"
                />
            </div>
        </div>
        <!--fin descripcion-->
        <!--metricas-->

        <div class="grid grid-cols-3 gap-4 ">         

            <div class="shadow-[0_0_10px_rgba(0,0,0,0.10)] rounded-2xl p-4 bg-white">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center">
                        <i class="pi pi-inbox text-xl"></i>
                    </div>

                    <div class="flex flex-col">
                        <span class="text-3xl font-bold text-gray-700">
                        {{ totalDonacionesRecibidas }}/{{ totalDonacionesAceptadas }}
                        </span>
                        <span class="text-sm text-gray-500">
                         Donaciones recibidas de las aceptadas
                        </span>
                    </div>
                </div>
            </div>

               <div class="shadow-[0_0_10px_rgba(0,0,0,0.10)] rounded-2xl p-4 bg-white">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                        <i class="pi pi-check-circle text-xl"></i>
                    </div>

                    <div class="flex flex-col">
                        <span class="text-3xl font-bold text-gray-700">
                        {{ totalDonacionesAceptadas }}
                        </span>
                        <span class="text-sm text-gray-500">
                        Donaciones aceptadas
                        </span>
                    </div>
                </div>
            </div>

            <div class="shadow-[0_0_10px_rgba(0,0,0,0.10)] rounded-2xl p-4 bg-white">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center">
                        <i class="pi pi-clock text-xl"></i>
                    </div>

                    <div class="flex flex-col">
                        <span class="text-3xl font-bold text-gray-700">
                        {{ totalDonacionesPendientes }}
                        </span>
                        <span class="text-sm text-gray-500">
                        Donaciones pendientes
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <!--fin metricas-->

        <!-- donaciones -->
        <div
            v-if="patrocinador && !editando"
            class="shadow-[0_0_10px_rgba(0,0,0,0.18)] rounded-2xl p-5 bg-white"
        >
            <div class="flex flex-row justify-between items-center mb-4">
                <div class="flex flex-row text-xl gap-3">
                    <div class="bg-primary-200/30 rounded-full p-1 min-w-9 h-fit text-center">
                        <i class="pi pi-gift text-primary-500"></i>
                    </div>
                    <div class="font-semibold h-fit my-auto">
                        Donaciones
                    </div>
                </div>

                <Tag
                    severity="info"
                    :value="`${donaciones.length} registros`"
                />
            </div>

            <DataTable :value="donaciones">
                <template #empty>
                    <div class="m-auto text-gray-500 w-fit p-3">
                        No hay donaciones registradas para este patrocinador
                    </div>
                </template>

                <Column header="Producto" field="producto" style="width:25%"></Column>

                <Column header="Fecha solicitud" style="width:18%">
                    <template #body="{ data }">
                        {{ formatearFecha(data.fecha_solicitud) }}
                    </template>
                </Column>

                <Column header="Estado" field="estado_solicitud" style="width:15%"></Column>

                <Column header="Fecha confirmación" style="width:18%">
                    <template #body="{ data }">
                        {{ formatearFecha(data.fecha_confirmacion) }}
                    </template>
                </Column>

                <Column header="Recepción" style="width:20%">
                    <template #body="{ data }">
                        {{ formatearFecha(data.fecha_recepcion) }}
                    </template>
                </Column>
            </DataTable>
        </div>
        <!--fin donaciones-->
    </div>
</template>

<style scoped>
</style>
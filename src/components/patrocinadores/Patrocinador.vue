<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { IPatrocinador } from '@/lib/tipos/patrocinadores'
import moment from 'moment'
import DataBlock from '@/components/generales/DataBlock.vue'
import FormRow from '@/components/forms/FormRow.vue'
import FormCol from '@/components/forms/FormCol.vue'
import Label from '@/components/forms/Label.vue'
import axios from '@/lib/axios.ts'
import { useToast } from '@/lib/toast/toast.ts'
import { useModalStore } from '@/stores/modales'
import { Form, type FormResolverOptions} from '@primevue/forms'
import type { FormSubmitEvent } from '@primevue/forms/form'
import DataTable from '@/volt/DataTable.vue'
import type { IDonacionPatrocinador } from '@/lib/tipos/donaciones'

const toast = useToast();
const modalesStore = useModalStore();

const props = defineProps<{
    patrocinador: IPatrocinador
}>()

const emits = defineEmits<{
    actualizado: [patrocinador: IPatrocinador]
    eliminado: []
}>();

const editando = ref(false);
//const form: TemplateRef<typeof Form> = useTemplateRef("form");
const donaciones = ref<IDonacionPatrocinador[]>([])


const valores = reactive({
    nombre: props.patrocinador.nombre,
    contacto: props.patrocinador.contacto,
    email: props.patrocinador.email,
    descripcion: props.patrocinador.descripcion
})

const cargarDonacionesPatrocinador = async () => {
    const r = await axios.get(`/donacion/patrocinador/${props.patrocinador.id_patrocinador}`)

    if ([200, 201].includes(r.status)) {
        donaciones.value = r.data.data;
    }
}

onMounted(async () => {
    await cargarDonacionesPatrocinador()
})

const actualizarPatrocinador = async (e: FormSubmitEvent) => {
    if (!props.patrocinador) return;
    console.log('Valores modificados del patrocinador:', valores)
    const r = await axios.patch(`/patrocinador/${props.patrocinador.id_patrocinador}`, e.values);
    if([200,201].includes(r.status)){
        const patrocinadorActualizado = r.data.data;
        Object.assign(valores, {
            nombre: patrocinadorActualizado.nombre,
            contacto: patrocinadorActualizado.contacto,
            email: patrocinadorActualizado.email,
            descripcion: patrocinadorActualizado.descripcion
        });
        toast.add({severity:"success", summary:"Éxito!", detail: 
        `${e.values.nombre} se modificó exitosamente`
        })
        editando.value = false;
        emits('actualizado', patrocinadorActualizado)
    }
}

const resolver = ({ values }: FormResolverOptions) => {
    const errors: { [K in keyof typeof valores]: { message: string }[] } = {
        nombre: [], contacto: [], email: [], descripcion: []
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
        values, // (Optional) Used to pass current form values to submit event.
        errors
    }
}

const formatearFecha = (fecha?: string | null) => {
    return fecha ? moment.utc(fecha).format('DD-MM-YYYY') : '-'
}


</script>

<template>
    <div class="flex flex-col items-center mt-3">
        <!--patrocinador-->
    <Panel v-if="patrocinador" class="border-white! border-0 overflow-auto m-3 w-[60%]" pt:header="p-0!">        
        <template #header>
            <div class="w-full h-full">
               <div class="bg-surface-800 w-full h-full text-center text-4xl font-bold pl-3 py-4 text-white">
                        {{ editando ? valores.nombre : patrocinador.nombre }}
                </div>
            </div>
        </template>

        <div v-if="editando" class="flex justify-center">
            <Form ref="form" v-slot="$form" :initialValues="valores" :resolver @submit="actualizarPatrocinador" class="flex flex-col mx-6 gap-3 pt-5">

            <div class="rounded-lg bg-gray-200 px-2 py-1 text-lg font-semibold">
                Fecha de alta | {{ moment(patrocinador.fecha_alta).format('DD-MM-YYYY') }}
            </div>

            <FormRow class="text-start text-lg font-semibold">
                <FormCol modo="horizontal" :span="12">
                    <Label>Nombre</Label>
                    <InputText fluid name="nombre" />
                    <Message v-if="$form.nombre?.invalid" severity="error" size="small" variant="simple">
                        {{ $form.nombre.error?.message }}
                    </Message>
                </FormCol>
            </FormRow>

            <FormRow class="text-start text-lg font-semibold">
                <FormCol modo="horizontal" :span="12">
                    <Label>Contacto</Label>
                    <InputText
                        fluid name="contacto"
                    />
                    <Message v-if="$form.contacto?.invalid" severity="error" size="small" variant="simple">
                         {{ $form.contacto.error?.message }}
                        </Message>
                </FormCol>
            </FormRow>

            <FormRow class="text-start text-lg font-semibold">
                <FormCol modo="horizontal" :span="12">
                    <Label>Email</Label>
                    <InputText
                        fluid name="email"
                    />
                    <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">
                                {{ $form.email.error?.message }}
                    </Message>
                </FormCol>
            </FormRow>

            <FormRow class="text-start text-lg font-semibold">
                <FormCol :span="12">
                    <Label>Descripción</Label>
                    <Textarea name="descripcion"
                    />
                    <Message v-if="$form.descripcion?.invalid" severity="error" size="small" variant="simple">
                         {{ $form.descripcion.error?.message }}
                    </Message>
                </FormCol>
            </FormRow>

            <div class="flex justify-end gap-3 px-6 py-4">
                <Button type="submit" icon="pi pi-check" label="Guardar"/>
                <Button tyoe="button" icon="pi pi-times" label="Cancelar" @click="editando = false" />
           
            </div>
        </Form>
        </div>

       <div v-else class="px-6 pt-5">
            <div class="flex flex-row gap-4 mb-5">
                <div class="rounded-lg bg-surface-300 px-2 py-1 text-lg font-semibold w-fit">
                    Código patrocinador | {{ patrocinador.id_patrocinador }}
                </div>

                <div class="rounded-lg bg-gray-200 px-2 py-1 text-lg font-semibold w-fit">
                    Fecha de alta | {{ moment(patrocinador.fecha_alta).format('DD-MM-YYYY') }}
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <DataBlock label="Contacto" :data="patrocinador.contacto" />
                <DataBlock label="Email" :data="patrocinador.email" />
            </div>

            <hr class="border-surface-500/80! my-3" />

            <div>
                <DataBlock label="Descripción" :data="patrocinador.descripcion" />
            </div>
        </div>
         <div v-if="!editando" class="flex justify-between items-center">
            <Button class="mx-4" icon="pi pi-undo" label="Volver" @click="$router.go(-1)"></Button>
            <div class="flex justify-end gap-3 px-6 py-4">
                <Button icon="pi pi-pencil" label="Editar" @click="editando = true" />
                <DangerButton icon="pi pi-trash" label="Eliminar" @click="modalesStore.abrir('eliminar', {
                    nombre: patrocinador.nombre,
                    endpoint: `/patrocinador/${patrocinador.id_patrocinador}`,
                    volverPrincipal: '/refugio/patrocinadores'})">
                </DangerButton>
            </div>
        </div>
        
    </Panel>
    <!--fin patrocinador-->

    <!--donaciones-->
    <Panel v-if="patrocinador && !editando" class="border-white! border-0 overflow-auto m-3 w-[60%]" pt:header="p-0!">
        <template #header>
            <div class="w-full h-full">
                <div class="w-full h-full text-center text-3xl font-semibold pl-3 py-4">
                    Donaciones
                </div>
            </div>
        </template>

        <div class="pb-5">
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
    </Panel>
    </div>
</template>

<style scoped>
</style>
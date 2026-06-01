<script setup lang="ts">
import { ref, reactive, type Reactive, useTemplateRef, type TemplateRef } from 'vue'
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
import { useRouter } from 'vue-router'

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


const valores = reactive({
    nombre: props.patrocinador.nombre,
    contacto: props.patrocinador.contacto,
    email: props.patrocinador.email,
    descripcion: props.patrocinador.descripcion
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

</script>

<template>
    <div class="flex justify-center mt-3">
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
                <Button icon="pi pi-times" label="Cancelar" @click="editando = false" />
           
            </div>
        </Form>
        </div>

        <div v-else class="flex justify-center">
            <div class="flex flex-col mx-6 gap-3 pt-5 ">
                <div class="rounded-lg bg-gray-200 px-2 py-1 text-lg font-semibold">
                    Fecha de alta | {{ moment(patrocinador.fecha_alta).format('DD-MM-YYYY') }}
                </div>
                <DataBlock label="Contacto" :data="patrocinador.contacto" />
                <hr class="border-surface-500/80!" />
                <DataBlock label="Email" :data="patrocinador.email" />
                <hr class="border-surface-500/80!" />
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
    </div>
</template>

<style scoped>
</style>
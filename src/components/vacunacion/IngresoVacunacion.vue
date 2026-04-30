<script setup lang="ts">

import { type Reactive, reactive, ref } from 'vue'
import { Form } from '@primevue/forms'
import type { IEventoVacunacion } from '@/lib/tipos/vacunacion'
import type { Maybe } from '@/lib/tipos/generics'

import FormRow from '@/components/forms/FormRow.vue'
import FormCol from '@/components/forms/FormCol.vue'
import Textarea from '@/volt/Textarea.vue'
import ToggleSwitch from '@/volt/ToggleSwitch.vue'
import TableSelect from '@/components/forms/TableSelect.vue'
import FileUpload from '@/components/forms/FileUpload.vue'
import { useToast } from '@/lib/toast/toast.ts'
import Label from '@/components/forms/Label.vue'
const toast = useToast();

type Optional<T> = { [K in keyof T]: Maybe<T[K]> }
const initialValues = reactive({
    fecha_evento: null,
    descripcion: null,
    vacuna_tipo: null,
    cupo_maximo: null,
    observaciones: null
})

interface EventoVacunacionData {
    fecha_evento: Maybe<string>,
    descripcion: Maybe<string>,
    vacuna_tipo: Maybe<number>,
    cupo_maximo: Maybe<number>,
    observaciones: Maybe<string>
}

const data: Reactive<Partial<Optional<EventoVacunacionData>>> = reactive({
    fecha_evento: null,
    descripcion: null,
    vacuna_tipo: null,
    cupo_maximo: null,
    observaciones: null
})

const vacunasTipo = [
    {
        id_vacuna_tipo: 1,
        descripcion: "Antirrábica"
    },
    {
        id_vacuna_tipo: 2,
        descripcion: "Sextuple"
    }
]



const emits = defineEmits<{close: []}>();
/*
const ingresar = async (d: any) => {
        let foto = null;
        if(data.foto){
             foto = await toBase64(data.foto)
        }
        const r = await axios.post(`/animal/`, {
            ...d.values,
            foto
        });
        if([200,201].includes(r.status)){
            toast.add({severity:"success", summary:"Éxito!", detail: `${d.values.nombre} se ha dado de alta exitosamente`})
            emits('close')
        }
}*/

const resolver = ({ values }: { values: Partial<Optional<IEventoVacunacion>> }) => {
    const errors: { [K in keyof EventoVacunacionData]: { message: string }[] } = {
        fecha_evento: [], descripcion: [], vacuna_tipo: [], cupo_maximo: [],
        observaciones: []
    }

    if (!values.fecha_evento) {
        errors.fecha_evento.push({ message: 'La fecha de evento es obligatoria' })
    }
    if (!values.descripcion) {
        errors.descripcion.push({ message: 'Debe ingresar un nombre del evento de vacunación' })
    }
    if (!values.vacuna_tipo) {
        errors.vacuna_tipo.push({ message: 'Debe seleccionar un tipo de vacuna' })
    }
    if (!values.cupo_maximo) {
        errors.cupo_maximo.push({ message: 'Debe ingresar el cupo máximo del evento' })
    }
    return {
        values, // (Optional) Used to pass current form values to submit event.
        errors
    }
}

const ptButton = ref({
    root: 'bg-secondary-500 px-3 py-2 rounded-lg flex flex-row gap-3 cursor-pointer max-h-fit disabled:pointer-events-none disabled:opacity-60 ',
    icon: 'm-auto text-surface-800',
    label: 'text-surface-800 m-auto'
})


</script>

<template>
    <Form v-slot="$form" :initialValues :resolver class="flex flex-col gap-4 w-full">
        <!--        <div class="flex flex-col gap-7">-->
        <FormRow class="w-full">
            <FormCol :span="6">
                <Label required>Vacuna</Label>
                <Select fluid name="vacuna_tipo" v-model="data.vacuna_tipo" :options="vacunasTipo" option-label="descripcion" 
                option-value="id_vacuna_tipo" placeholder="Seleccione una vacuna"></Select>
              
            </FormCol>
            <FormCol :span="6">
                <Label required>Fecha de evento</Label>
                <InputText fluid name="fecha_evento" type="date"></InputText>
               
            </FormCol>
        </FormRow>
         <FormRow>
             <FormCol :span="6">
                <Label required>Nombre de la campaña</Label>
                <InputText fluid name="descripcion" type="text"></InputText>        
              
            </FormCol>
            <FormCol :span="6">
                <Label required>Cupo máximo</Label>
                <InputText fluid name="cupo" type="number"></InputText>
               
            </FormCol>            
        </FormRow>
        <FormRow>
           <FormCol :span="12">
                <Label>Observaciones</Label>
                <Textarea name="observaciones"></Textarea>
            </FormCol>
        </FormRow>
        <div class="flex flex-row justify-end gap-3">
            <Button type="submit" icon="pi pi-save" label="Guardar" icon-pos="right"></Button>
        </div>
    </Form>
</template>

<style scoped>
</style>